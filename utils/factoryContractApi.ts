import { BrowserProvider, Contract, Provider, Signer } from 'zksync-ethers'
import { Addressable, ContractTransactionReceipt, ethers } from 'ethers'

import { PictureRequestSubmission } from '@/types/submission'
import { EIP6963ProviderDetail } from '@/types/eip6963'
import { PictureRequest } from '@/types/pictureRequest'
import PictureRequestSchema from '@/public/artifacts/PictureRequest.json'
import RequestSubmissionSchema from '@/public/artifacts/RequestSubmission.json'
import FixMyPicFactorySchema from '@/public/artifacts/FixMyPicFactory.json'

import { convertUsdToEthWithoutRate } from './currency'
import { batchTasksAsync } from './batch'
import { arrayToMap } from './object'
import { SubmissionPurchase } from '@/types/purchase'

interface CreatePictureRequestParams {
  title: string
  budget: number
  imageId: string
  expiresAt?: number
  description: string

  account: string
  wallet: EIP6963ProviderDetail
}

interface CreateSubmissionsParams {
  price: number
  description: string
  requestAddress: string
  freePictureId: string | undefined
  encryptedPictureId: string | undefined
  watermarkedPictureId: string | undefined

  account: string
  wallet: EIP6963ProviderDetail
}

interface PurchaseSubmissionParams {
  address: string

  account: string
  wallet: EIP6963ProviderDetail
}

export interface FixMyPicApi {
  createSubmission(params: CreateSubmissionsParams): Promise<boolean>
  purchaseSubmission(params: PurchaseSubmissionParams): Promise<boolean>
  createPictureRequest(params: CreatePictureRequestParams): Promise<boolean>
}

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || ''
const FIX_MY_PIC_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FIX_MY_PIC_FACTORY_ADDRESS || ''
const IMAGE_URL_ROOT = process.env.NEXT_PUBLIC_PINATA_GATEWAY || ''

if (!RPC_URL) {
  process.exit('No RPC URL provided')
}
if (!IMAGE_URL_ROOT) {
  process.exit('No image url root provided')
}
if (!FIX_MY_PIC_FACTORY_ADDRESS) {
  process.exit('No picture factory address provided')
}

async function createFixMyPicApi(_factoryAddress: string): Promise<FixMyPicApi> {
  const provider = new Provider(RPC_URL)

  let factoryContract: Contract
  let factoryAddress: string | Addressable = _factoryAddress

  let pictureRequests: Record<string, PictureRequest> = {}
  let submissions: Record<string, PictureRequestSubmission> = {}

  const _getSigner = (wallet: EIP6963ProviderDetail, account: string): Promise<Signer> => {
    const provider = new BrowserProvider(wallet.provider)
    return provider.getSigner(account)
  }

  const _initFactoryContract = async (): Promise<void> => {
    if (factoryContract) {
      return
    }

    factoryContract = new Contract(factoryAddress, FixMyPicFactorySchema.abi, provider)

    if (!factoryContract) {
      throw new Error('Could not connect to the fixmypic factory!')
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
      mapFunction: _fetchSubmissionContract,
    })

    requestSubmissions.forEach((submission: PictureRequestSubmission) => {
      submissions[submission.address] = submission
    })

    return requestSubmissions
  }

  const _fetchSubmissionContract = async (address: string): Promise<PictureRequestSubmission> => {
    const submissionContract = new ethers.Contract(address, RequestSubmissionSchema.abi, provider)
    const price = await submissionContract.price()
    const submitter = await submissionContract.submitter()
    const description = await submissionContract.description()
    const purchasers = await submissionContract.getPurchaserList()
    const freePictureId = await submissionContract.freePictureId()
    const encryptedPictureId = await submissionContract.encryptedPictureId()
    const watermarkedPictureId = await submissionContract.watermarkedPictureId()

    return {
      address,
      submitter,
      purchasers,
      description,
      freePictureId,
      encryptedPictureId,
      watermarkedPictureId,
      price: Number(ethers.formatEther(price)),
    }
  }

  const createPictureRequest = async ({
    title,
    description,
    imageId,
    budget,
    expiresAt,
    wallet,
    account,
  }: CreatePictureRequestParams): Promise<boolean> => {
    const fixMyPicFactory = new Contract(
      factoryAddress,
      FixMyPicFactorySchema.abi,
      await _getSigner(wallet, account)
    )

    const budgetEth = await convertUsdToEthWithoutRate(budget)
    const budgetInWei = ethers.parseEther(budgetEth)

    try {
      const tx = await fixMyPicFactory.createPictureRequest(
        title,
        description,
        imageId,
        budgetInWei
      )
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1 || !receipt.contractAddress) {
        throw new Error('Failed to create image request')
      }
      return true
    } catch (error) {
      console.error('Unable to create the image request:', error, typeof error)
      throw error
    }
  }

  const getPictureRequests = (): PictureRequest[] => {
    return Object.values(pictureRequests)
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
  }: CreateSubmissionsParams): Promise<boolean> => {
    try {
      const fixMyPicFactory = new Contract(
        factoryAddress,
        FixMyPicFactorySchema.abi,
        await _getSigner(wallet, account)
      )

      const priceEth = await convertUsdToEthWithoutRate(price)
      const priceInWei = ethers.parseEther(priceEth)

      const tx = await fixMyPicFactory.createSubmission(
        requestAddress,
        description,
        priceInWei,
        freePictureId || '',
        watermarkedPictureId || '',
        encryptedPictureId || ''
      )
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1 || !receipt.contractAddress) {
        throw new Error(`Failed to create submission on picture request ${requestAddress}`)
      }

      return true
    } catch (error) {
      console.error('Unable to create the submission:', error)
      throw error
    }
  }

  // const getSubmissions = async ({
  //   requestAddress,
  //   refetch = false,
  // }: GetSubmissionsParams): Promise<PictureRequestSubmission[]> => {
  //   const pictureRequest = await getPictureRequest({ address: requestAddress, refetch })
  //   return pictureRequest.submissions
  // }

  // const getSubmission = async ({
  //   address,
  //   refetch = false,
  // }: GetSubmissionParams): Promise<PictureRequestSubmission> => {
  //   if (refetch) {
  //     submissions[address] = await _fetchSubmissionContract(address)
  //   }

  //   return submissions[address]
  // }

  const purchaseSubmission = async ({
    address,
    wallet,
    account,
  }: PurchaseSubmissionParams): Promise<boolean> => {
    const submissionContract = new ethers.Contract(
      address,
      RequestSubmissionSchema.abi,
      await _getSigner(wallet, account)
    )
    const price = await submissionContract.price()

    const tx = await submissionContract.purchaseSubmission({ value: price })
    const receipt: ContractTransactionReceipt = await tx.wait()

    const event = receipt.logs
      .map((log) => submissionContract.interface.parseLog(log))
      .find((log) => log && log.name === 'SubmissionPurchased')
    if (!event) {
      throw new Error('SubmissionPurchased event not found')
    }

    return true
  }

  // const getPurchasesForAccount = async ({
  //   account,
  //   wallet,
  // }: GetPurchasesForAccountParams): Promise<SubmissionPurchase[]> => {
  //   const purchaseContract = new ethers.Contract(
  //     purchaseManagerAddress,
  //     PurchaseManagerSchema.abi,
  //     await _getSigner(wallet, account)
  //   )
  //   const purchases = await purchaseContract.getPurchases(account)

  //   return purchases.map((purchase: any) => ({
  //     buyer: purchase.buyer,
  //     submissionAddress: purchase.submissionAddress,
  //     price: Number(ethers.formatEther(purchase.price)),
  //   }))
  // }

  // const getSubmissionPictureId = async ({
  //   address,
  //   wallet,
  //   account,
  // }: GetSubmissionPictureIdParams): Promise<string> => {
  //   const submissionContract = new ethers.Contract(
  //     address,
  //     RequestSubmissionSchema.abi,
  //     await _getSigner(wallet, account)
  //   )

  //   return submissionContract.getPictureId()
  // }

  await _initFactoryContract()
  // pictureRequests = await _fetchAllPictureRequests()

  return {
    createPictureRequest,
    // getPictureRequest,
    // getPictureRequests,
    createSubmission,
    // getSubmission,
    // getSubmissions,
    purchaseSubmission,
    // getPurchasesForAccount,
    // getSubmissionPictureId,
  }
}

let factoryApiPromise: Promise<FixMyPicApi> | null = null

const getFixMyPicApi = async (): Promise<FixMyPicApi> => {
  if (!factoryApiPromise) {
    factoryApiPromise = createFixMyPicApi(FIX_MY_PIC_FACTORY_ADDRESS)
  }
  return factoryApiPromise
}

export { getFixMyPicApi }
