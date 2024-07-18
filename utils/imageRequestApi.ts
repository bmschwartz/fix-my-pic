import { BrowserProvider, Contract, Provider, Signer } from 'zksync-ethers'
import { Addressable, ContractTransactionReceipt, ethers } from 'ethers'

import { ContractEvents } from '@/types/events'
import { ImageRequestSubmission } from '@/types/submission'
import { ImageRequest } from '@/types/imageRequest'
import ImageRequestSchema from '@/public/artifacts/ImageRequest.json'
import ImageRequestFactorySchema from '@/public/artifacts/ImageRequestFactory.json'
import ImageRequestSubmissionSchema from '@/public/artifacts/ImageRequestSubmission.json'

import { convertUsdToEthWithoutRate } from './currency'
import { batchTasksAsync } from './batch'
import { EIP6963ProviderDetail } from '@/types/eip6963'
import { arrayToMap } from './object'

interface CreateImageRequestParams {
  title: string
  description: string
  imageId: string
  budget: number
  account: string
  wallet: EIP6963ProviderDetail
}

interface GetImageRequestParams {
  address: string
  refetch?: boolean
}

interface CreateSubmissionsParams {
  requestAddress: string
  description: string
  imageId: string
  price: number
  wallet: EIP6963ProviderDetail
  account: string
}

interface GetSubmissionsParams {
  requestAddress: string
  refetch: boolean
}

interface GetSubmissionParams {
  address: string
  refetch: boolean
}

export interface ImageRequestApi {
  createImageRequest(params: CreateImageRequestParams): Promise<ImageRequest>
  getImageRequest(params: GetImageRequestParams): Promise<ImageRequest>
  getImageRequests(): ImageRequest[]

  createSubmission(params: CreateSubmissionsParams): Promise<ImageRequestSubmission>
  getSubmission(params: GetSubmissionParams): Promise<ImageRequestSubmission>
  getSubmissions(params: GetSubmissionsParams): Promise<ImageRequestSubmission[]>
}

const IMAGE_REQUEST_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || ''
const IMAGE_REQUEST_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_IMAGE_REQUEST_FACTORY_ADDRESS || ''
const IMAGE_URL_ROOT = process.env.NEXT_PUBLIC_PINATA_GATEWAY || ''

if (!IMAGE_REQUEST_RPC_URL) {
  process.exit('No RPC URL provided')
}
if (!IMAGE_REQUEST_FACTORY_ADDRESS) {
  process.exit('No bounty factory address provided')
}
if (!IMAGE_URL_ROOT) {
  process.exit('No image url root provided')
}

async function createImageRequestApi(initialFactoryAddress: string): Promise<ImageRequestApi> {
  let factoryContract: Contract
  let factoryAddress: string | Addressable = initialFactoryAddress
  let imageRequests: Record<string, ImageRequest> = {}
  let submissions: Record<string, ImageRequestSubmission> = {}
  const provider = new Provider(IMAGE_REQUEST_RPC_URL)

  const _getSigner = (wallet: EIP6963ProviderDetail, account: string): Promise<Signer> => {
    const provider = new BrowserProvider(wallet.provider)
    return provider.getSigner(account)
  }

  const _imageRequestCreatedHandler = async (address: string) => {
    await getImageRequest({ address, refetch: true })
  }

  const _initFactoryContract = async (): Promise<void> => {
    if (factoryContract) {
      return
    }

    factoryContract = new Contract(factoryAddress, ImageRequestFactorySchema.abi, provider)

    if (!factoryContract) {
      throw new Error('Could not connect to the image request factory!')
    }

    await factoryContract.addListener(
      ContractEvents.ImageRequestCreated,
      _imageRequestCreatedHandler
    )
  }

  const _fetchImageRequestContract = async (address: string): Promise<ImageRequest> => {
    const imageRequestContract = new ethers.Contract(address, ImageRequestSchema.abi, provider)
    const title = await imageRequestContract.title()
    const budget = await imageRequestContract.budget()
    const imageId = await imageRequestContract.imageId()
    const description = await imageRequestContract.description()
    const submissionAddresses = await imageRequestContract.getSubmissions()
    const submissions = await _fetchImageRequestSubmissions(submissionAddresses)
    const imageUrl = `${IMAGE_URL_ROOT}/${imageId}`

    return {
      title,
      address,
      imageId,
      imageUrl,
      submissions,
      description,
      budget: Number(ethers.formatEther(budget)),
    }
  }

  const _fetchAllImageRequests = async (): Promise<Record<string, ImageRequest>> => {
    const requestAddresses = await factoryContract.getImageRequests()
    let requestContracts: ImageRequest[] = await batchTasksAsync<ImageRequest>({
      batchSize: 50,
      tasks: requestAddresses,
      mapFunction: _fetchImageRequestContract,
    })

    return arrayToMap<ImageRequest>(requestContracts, 'address')
  }

  const _fetchImageRequestSubmissions = async (
    addresses: string[]
  ): Promise<ImageRequestSubmission[]> => {
    const requestSubmissions = await batchTasksAsync<ImageRequestSubmission>({
      tasks: addresses,
      mapFunction: _fetchSubmissionContractData,
    })

    requestSubmissions.forEach((submission: ImageRequestSubmission) => {
      submissions[submission.address] = submission
    })

    return requestSubmissions
  }

  const _fetchSubmissionContractData = async (address: string): Promise<ImageRequestSubmission> => {
    const submissionContract = new ethers.Contract(
      address,
      ImageRequestSubmissionSchema.abi,
      provider
    )
    const price = await submissionContract.price()
    const imageId = await submissionContract.imageId()
    const submitter = await submissionContract.submitter()
    const description = await submissionContract.description()
    const imageUrl = `${IMAGE_URL_ROOT}/${imageId}`

    return {
      price,
      address,
      imageId,
      imageUrl,
      submitter,
      description,
    }
  }

  const createImageRequest = async (params: CreateImageRequestParams): Promise<ImageRequest> => {
    const { title, description, imageId, budget, wallet, account } = params

    const imageRequestFactory = new Contract(
      factoryAddress,
      ImageRequestFactorySchema.abi,
      await _getSigner(wallet, account)
    )

    const budgetEth = await convertUsdToEthWithoutRate(budget)
    const budgetInWei = ethers.parseEther(budgetEth)

    try {
      const tx = await imageRequestFactory.createImageRequest(
        title,
        description,
        imageId,
        budgetInWei
      )
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1 || !receipt.contractAddress) {
        throw new Error('Failed to create image request')
      }

      return getImageRequest({ address: receipt.contractAddress, refetch: true })
    } catch (error) {
      console.error('Unable to create the image request:', error, typeof error)
      throw error
    }
  }

  const getImageRequests = (): ImageRequest[] => {
    return Object.values(imageRequests)
  }

  const getImageRequest = async ({
    address,
    refetch,
  }: GetImageRequestParams): Promise<ImageRequest> => {
    if (refetch || !(address in imageRequests)) {
      imageRequests[address] = await _fetchImageRequestContract(address)
    }

    return imageRequests[address]
  }

  const createSubmission = async ({
    requestAddress,
    imageId,
    description,
    price,
    wallet,
    account,
  }: CreateSubmissionsParams): Promise<ImageRequestSubmission> => {
    try {
      const imageRequestContract = new Contract(
        requestAddress,
        ImageRequestSchema.abi,
        await _getSigner(wallet, account)
      )

      const priceEth = await convertUsdToEthWithoutRate(price)
      const priceInWei = ethers.parseEther(priceEth)

      const tx = await imageRequestContract.createSubmission(
        account,
        description,
        imageId,
        priceInWei
      )
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1 || !receipt.contractAddress) {
        throw new Error(`Failed to create submission on image request ${requestAddress}`)
      }

      return await getSubmission({ address: receipt.contractAddress, refetch: true })
    } catch (error) {
      console.error('Unable to create the submission:', error)
      throw error
    }
  }

  const getSubmissions = async ({
    requestAddress,
    refetch = false,
  }: GetSubmissionsParams): Promise<ImageRequestSubmission[]> => {
    const imageRequest = await getImageRequest({ address: requestAddress, refetch })
    return imageRequest.submissions
  }

  const getSubmission = async ({
    address,
    refetch = false,
  }: GetSubmissionParams): Promise<ImageRequestSubmission> => {
    if (refetch) {
      submissions[address] = await _fetchSubmissionContractData(address)
    }
    return submissions[address]
  }

  await _initFactoryContract()
  imageRequests = await _fetchAllImageRequests()

  return {
    createImageRequest,
    getImageRequest,
    getImageRequests,
    createSubmission,
    getSubmission,
    getSubmissions,
  }
}

let imageRequestApiPromise: Promise<ImageRequestApi> | null = null

const getImageRequestApi = async (): Promise<ImageRequestApi> => {
  if (!imageRequestApiPromise) {
    imageRequestApiPromise = createImageRequestApi(IMAGE_REQUEST_FACTORY_ADDRESS)
  }
  return imageRequestApiPromise
}

export { getImageRequestApi }
