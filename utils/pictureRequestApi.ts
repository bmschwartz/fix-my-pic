import { BrowserProvider, Contract, Provider, Signer } from 'zksync-ethers'
import { Addressable, ContractTransactionReceipt, ethers } from 'ethers'

import { PictureRequestSubmission } from '@/types/submission'
import { EIP6963ProviderDetail } from '@/types/eip6963'
import { PictureRequest } from '@/types/pictureRequest'
import PictureRequestSchema from '@/public/artifacts/PictureRequest.json'
import RequestSubmission from '@/public/artifacts/RequestSubmission.json'
import PictureRequestFactorySchema from '@/public/artifacts/PictureRequestFactory.json'

import { convertUsdToEthWithoutRate } from './currency'
import { batchTasksAsync } from './batch'
import { arrayToMap } from './object'

interface CreatePictureRequestParams {
  title: string
  description: string
  imageId: string
  budget: number
  account: string
  wallet: EIP6963ProviderDetail
}

interface GetPictureRequestParams {
  address: string
  refetch?: boolean
}

interface CreateSubmissionsParams {
  price: number
  account: string
  description: string
  requestAddress: string
  wallet: EIP6963ProviderDetail
  freePictureId: string | null
  encryptedPictureId: string | null
  watermarkedPictureId: string | null
}

interface GetSubmissionsParams {
  requestAddress: string
  refetch: boolean
}

interface GetSubmissionParams {
  address: string
  refetch: boolean
}

export interface PictureRequestApi {
  createPictureRequest(params: CreatePictureRequestParams): Promise<PictureRequest>
  getPictureRequest(params: GetPictureRequestParams): Promise<PictureRequest>
  getPictureRequests(): PictureRequest[]

  createSubmission(params: CreateSubmissionsParams): Promise<PictureRequestSubmission>
  getSubmission(params: GetSubmissionParams): Promise<PictureRequestSubmission>
  getSubmissions(params: GetSubmissionsParams): Promise<PictureRequestSubmission[]>
}

const IMAGE_REQUEST_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || ''
const IMAGE_REQUEST_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_IMAGE_REQUEST_FACTORY_ADDRESS || ''
const IMAGE_URL_ROOT = process.env.NEXT_PUBLIC_PINATA_GATEWAY || ''

if (!IMAGE_REQUEST_RPC_URL) {
  process.exit('No RPC URL provided')
}
if (!IMAGE_REQUEST_FACTORY_ADDRESS) {
  process.exit('No image factory address provided')
}
if (!IMAGE_URL_ROOT) {
  process.exit('No image url root provided')
}

async function createPictureRequestApi(initialFactoryAddress: string): Promise<PictureRequestApi> {
  let factoryContract: Contract
  let factoryAddress: string | Addressable = initialFactoryAddress
  let pictureRequests: Record<string, PictureRequest> = {}
  let submissions: Record<string, PictureRequestSubmission> = {}
  const provider = new Provider(IMAGE_REQUEST_RPC_URL)

  const _getSigner = (wallet: EIP6963ProviderDetail, account: string): Promise<Signer> => {
    const provider = new BrowserProvider(wallet.provider)
    return provider.getSigner(account)
  }

  const _initFactoryContract = async (): Promise<void> => {
    if (factoryContract) {
      return
    }

    factoryContract = new Contract(factoryAddress, PictureRequestFactorySchema.abi, provider)

    if (!factoryContract) {
      throw new Error('Could not connect to the image request factory!')
    }
  }

  const _fetchPictureRequestContract = async (address: string): Promise<PictureRequest> => {
    const pictureRequestContract = new ethers.Contract(address, PictureRequestSchema.abi, provider)
    const title = await pictureRequestContract.title()
    const budget = await pictureRequestContract.budget()
    const imageId = await pictureRequestContract.imageId()
    const description = await pictureRequestContract.description()
    const submissionAddresses = await pictureRequestContract.getSubmissions()
    const submissions = await _fetchPictureRequestSubmissions(submissionAddresses)
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

  const _fetchAllPictureRequests = async (): Promise<Record<string, PictureRequest>> => {
    const requestAddresses = await factoryContract.getPictureRequests()
    let requestContracts: PictureRequest[] = await batchTasksAsync<PictureRequest>({
      batchSize: 50,
      tasks: requestAddresses,
      mapFunction: _fetchPictureRequestContract,
    })

    return arrayToMap<PictureRequest>(requestContracts, 'address')
  }

  const _fetchPictureRequestSubmissions = async (
    addresses: string[]
  ): Promise<PictureRequestSubmission[]> => {
    const requestSubmissions = await batchTasksAsync<PictureRequestSubmission>({
      tasks: addresses,
      mapFunction: _fetchSubmissionContractData,
    })

    requestSubmissions.forEach((submission: PictureRequestSubmission) => {
      submissions[submission.address] = submission
    })

    return requestSubmissions
  }

  const _fetchSubmissionContractData = async (
    address: string
  ): Promise<PictureRequestSubmission> => {
    const submissionContract = new ethers.Contract(address, RequestSubmission.abi, provider)
    const price = await submissionContract.price()
    const imageId = await submissionContract.imageId()
    const submitter = await submissionContract.submitter()
    const description = await submissionContract.description()
    const imageUrl = `${IMAGE_URL_ROOT}/${imageId}`

    return {
      address,
      imageId,
      imageUrl,
      submitter,
      description,
      price: Number(ethers.formatEther(price)),
    }
  }

  const createPictureRequest = async (
    params: CreatePictureRequestParams
  ): Promise<PictureRequest> => {
    const { title, description, imageId, budget, wallet, account } = params

    const pictureRequestFactory = new Contract(
      factoryAddress,
      PictureRequestFactorySchema.abi,
      await _getSigner(wallet, account)
    )

    const budgetEth = await convertUsdToEthWithoutRate(budget)
    const budgetInWei = ethers.parseEther(budgetEth)

    try {
      const tx = await pictureRequestFactory.createPictureRequest(
        title,
        description,
        imageId,
        budgetInWei
      )
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1 || !receipt.contractAddress) {
        throw new Error('Failed to create image request')
      }

      return getPictureRequest({ address: receipt.contractAddress, refetch: true })
    } catch (error) {
      console.error('Unable to create the image request:', error, typeof error)
      throw error
    }
  }

  const getPictureRequests = (): PictureRequest[] => {
    return Object.values(pictureRequests)
  }

  const getPictureRequest = async ({
    address,
    refetch,
  }: GetPictureRequestParams): Promise<PictureRequest> => {
    if (refetch || !(address in pictureRequests)) {
      pictureRequests[address] = await _fetchPictureRequestContract(address)
    }

    return pictureRequests[address]
  }

  const createSubmission = async ({
    price,
    wallet,
    account,
    description,
    requestAddress,
    freePictureId,
    encryptedPictureId,
    watermarkedPictureId,
  }: CreateSubmissionsParams): Promise<PictureRequestSubmission> => {
    try {
      const pictureRequestContract = new Contract(
        requestAddress,
        PictureRequestSchema.abi,
        await _getSigner(wallet, account)
      )

      const priceEth = await convertUsdToEthWithoutRate(price)
      const priceInWei = ethers.parseEther(priceEth)

      const tx = await pictureRequestContract.createSubmission(
        account,
        description,
        originalImageId,
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
  }: GetSubmissionsParams): Promise<PictureRequestSubmission[]> => {
    const pictureRequest = await getPictureRequest({ address: requestAddress, refetch })
    return pictureRequest.submissions
  }

  const getSubmission = async ({
    address,
    refetch = false,
  }: GetSubmissionParams): Promise<PictureRequestSubmission> => {
    if (refetch) {
      submissions[address] = await _fetchSubmissionContractData(address)
    }
    return submissions[address]
  }

  await _initFactoryContract()
  pictureRequests = await _fetchAllPictureRequests()

  return {
    createPictureRequest,
    getPictureRequest,
    getPictureRequests,
    createSubmission,
    getSubmission,
    getSubmissions,
  }
}

let pictureRequestApiPromise: Promise<PictureRequestApi> | null = null

const getPictureRequestApi = async (): Promise<PictureRequestApi> => {
  if (!pictureRequestApiPromise) {
    pictureRequestApiPromise = createPictureRequestApi(IMAGE_REQUEST_FACTORY_ADDRESS)
  }
  return pictureRequestApiPromise
}

export { getPictureRequestApi }
