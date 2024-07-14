import { BrowserProvider, Contract, Provider, Signer } from 'zksync-ethers'
import { Addressable, ContractTransactionReceipt, ethers } from 'ethers'

import { ContractEvents } from '@/types/events'
import { Bounty, BountyState } from '@/types/bounty'
import { BountySubmission } from '@/types/submission'
import PictureBountySchema from '@/public/artifacts/PictureBounty.json'
import BountySubmissionSchema from '@/public/artifacts/BountySubmission.json'
import PictureBountyFactorySchema from '@/public/artifacts/PictureBountyFactory.json'

import { convertUsdToEth } from './currency'
import { batchTasksAsync } from './batch'
import { EIP6963ProviderDetail } from '@/types/eip6963'

interface CreatePictureBountyParams {
  title: string
  description: string
  imageId: string
  reward: number
  wallet: EIP6963ProviderDetail
  account: string
}

interface GetPictureBountyParams {
  address: string
  refetch?: boolean
}

interface GetPictureBountiesParams {
  filters?: {
    status: BountyState
  }
}

interface CreateSubmissionsParams {
  bountyAddress: string
  description: string
  imageId: string
  wallet: EIP6963ProviderDetail
  account: string
}

interface GetSubmissionsParams {
  bountyAddress: string
  refetch: boolean
}

interface GetSubmissionParams {
  address: string
  refetch: boolean
}

interface PayOutRewardParams {
  bountyAddress: string
  submissionAddress: string
  wallet: EIP6963ProviderDetail
  account: string
}

export interface PictureBountyApi {
  createPictureBounty(params: CreatePictureBountyParams): Promise<Bounty>
  getPictureBounty(params: GetPictureBountyParams): Promise<Bounty>
  getPictureBounties(params?: GetPictureBountiesParams): Bounty[]

  createSubmission(params: CreateSubmissionsParams): Promise<BountySubmission>
  getSubmission(params: GetSubmissionParams): Promise<BountySubmission>
  getSubmissions(params: GetSubmissionsParams): Promise<BountySubmission[]>

  payOutReward(params: PayOutRewardParams): Promise<void>
}

const BOUNTY_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || ''
const BOUNTY_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_BOUNTY_FACTORY_ADDRESS || ''

if (!BOUNTY_RPC_URL) {
  process.exit('No RPC URL provided')
}
if (!BOUNTY_FACTORY_ADDRESS) {
  process.exit('No bounty factory address provided')
}

async function createPictureBountyApi(initialFactoryAddress: string): Promise<PictureBountyApi> {
  let factoryContract: Contract
  let factoryAddress: string | Addressable = initialFactoryAddress
  let bounties: Record<string, Bounty> = {}
  let submissions: Record<string, BountySubmission> = {}
  const provider = new Provider(BOUNTY_RPC_URL)

  const _getSigner = (wallet: EIP6963ProviderDetail, account: string): Promise<Signer> => {
    const provider = new BrowserProvider(wallet.provider)
    return provider.getSigner(account)
  }

  const _pictureBountyCreatedHandler = async (address: string) => {
    await getPictureBounty({ address, refetch: true })
  }

  const _initFactoryContract = async (): Promise<void> => {
    if (factoryContract) {
      return
    }

    factoryContract = new Contract(factoryAddress, PictureBountyFactorySchema.abi, provider)

    if (!factoryContract) {
      throw new Error('Could not create the picture bounty factory!')
    }

    await factoryContract.addListener(
      ContractEvents.PictureBountyCreated,
      _pictureBountyCreatedHandler
    )
  }

  const _fetchBountyContract = async (address: string): Promise<Bounty> => {
    const bountyContract = new ethers.Contract(address, PictureBountySchema.abi, provider)
    const owner = await bountyContract.owner()
    const title = await bountyContract.title()
    const imageId = await bountyContract.imageId()
    const reward = await bountyContract.reward()
    const state = await bountyContract.currentState()
    const description = await bountyContract.description()
    const submissionAddresses = await bountyContract.getSubmissions()
    const submissions = await _fetchBountySubmissions(submissionAddresses)

    return {
      owner,
      title,
      state,
      address,
      imageId,
      submissions,
      description,
      reward: Number(ethers.formatEther(reward)),
    }
  }

  const _fetchAllPictureBounties = async (): Promise<Record<string, Bounty>> => {
    const bountyAddresses = await factoryContract.getPictureBounties()
    let bountyContracts: Bounty[] = await batchTasksAsync<Bounty>({
      batchSize: 50,
      tasks: bountyAddresses,
      mapFunction: _fetchBountyContract,
    })

    return bountyContracts.reduce((acc: { [key: string]: Bounty }, obj: Bounty) => {
      acc[obj.address] = obj
      return acc
    }, {})
  }

  const _fetchBountySubmissions = async (addresses: string[]): Promise<BountySubmission[]> => {
    const bountySubmissions = await batchTasksAsync<BountySubmission>({
      tasks: addresses,
      mapFunction: _fetchSubmissionContractData,
    })

    bountySubmissions.forEach((submission: BountySubmission) => {
      submissions[submission.address] = submission
    })

    return bountySubmissions
  }

  const _fetchSubmissionContractData = async (address: string): Promise<BountySubmission> => {
    const submissionContract = new ethers.Contract(address, BountySubmissionSchema.abi, provider)
    const description = await submissionContract.description()
    const imageId = await submissionContract.imageId()
    const isWinner = await submissionContract.isWinner()

    return {
      address,
      description,
      imageId,
      isWinner,
    }
  }

  const createPictureBounty = async (params: CreatePictureBountyParams): Promise<Bounty> => {
    const { title, description, imageId, reward, wallet, account } = params

    const bountyFactory = new Contract(
      factoryAddress,
      PictureBountyFactorySchema.abi,
      await _getSigner(wallet, account)
    )

    const rewardEth = await convertUsdToEth(reward)
    const rewardInWei = ethers.parseEther(rewardEth)

    try {
      const tx = await bountyFactory.createPictureBounty(title, description, imageId, {
        value: rewardInWei,
      })
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1 || !receipt.contractAddress) {
        throw new Error('Failed to create bounty')
      }

      return await getPictureBounty({ address: receipt.contractAddress, refetch: true })
    } catch (error) {
      console.error('Unable to create the bounty:', error, typeof error)
      throw error
    }
  }

  const getPictureBounties = (params?: GetPictureBountiesParams): Bounty[] => {
    return Object.values(bounties)
  }

  const getPictureBounty = async ({
    address,
    refetch,
  }: GetPictureBountyParams): Promise<Bounty> => {
    if (refetch || !(address in bounties)) {
      bounties[address] = await _fetchBountyContract(address)
    }

    return bounties[address]
  }

  const createSubmission = async ({
    bountyAddress,
    imageId,
    description,
    wallet,
    account,
  }: CreateSubmissionsParams): Promise<BountySubmission> => {
    try {
      const bountyContract = new Contract(
        bountyAddress,
        PictureBountySchema.abi,
        await _getSigner(wallet, account)
      )
      const tx = await bountyContract.createSubmission(description, imageId)
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1 || !receipt.contractAddress) {
        throw new Error(`Failed to create submission on bounty ${bountyAddress}`)
      }

      return await getSubmission({ address: receipt.contractAddress, refetch: true })
    } catch (error) {
      console.error('Unable to create the submission:', error)
      throw error
    }
  }

  const getSubmissions = async ({
    bountyAddress,
    refetch = false,
  }: GetSubmissionsParams): Promise<BountySubmission[]> => {
    const bounty = await getPictureBounty({ address: bountyAddress, refetch })
    return bounty.submissions
  }

  const getSubmission = async ({
    address,
    refetch = false,
  }: GetSubmissionParams): Promise<BountySubmission> => {
    if (refetch) {
      submissions[address] = await _fetchSubmissionContractData(address)
    }
    return submissions[address]
  }

  const payOutReward = async ({
    bountyAddress,
    submissionAddress,
    wallet,
    account,
  }: PayOutRewardParams): Promise<void> => {
    const bounty = await getPictureBounty({ address: bountyAddress, refetch: true })
    const submission = await getSubmission({ address: submissionAddress, refetch: true })

    if (bounty.owner !== account) {
      throw new Error('You are not the owner of this bounty!')
    }
    if (bounty.state !== BountyState.ACTIVE) {
      throw new Error('This bounty is not active')
    }
    if (submission.isWinner) {
      throw new Error('This submission is already the winner!')
    }

    const bountyContract = new Contract(
      bountyAddress,
      PictureBountySchema.abi,
      await _getSigner(wallet, account)
    )
    const tx = await bountyContract.payOutReward(submissionAddress)
    const receipt: ContractTransactionReceipt = await tx.wait()
    console.log('Receipt', receipt)
    if (receipt.status !== 1 || !receipt.contractAddress) {
      throw new Error(`Failed to pay out reward on bounty ${bountyAddress}`)
    }
  }

  await _initFactoryContract()
  bounties = await _fetchAllPictureBounties()

  return {
    createPictureBounty,
    getPictureBounty,
    getPictureBounties,
    createSubmission,
    getSubmission,
    getSubmissions,
    payOutReward,
  }
}

let pictureBountyApiPromise: Promise<PictureBountyApi> | null = null

const getPictureBountyApi = async (): Promise<PictureBountyApi> => {
  if (!pictureBountyApiPromise) {
    pictureBountyApiPromise = createPictureBountyApi(BOUNTY_FACTORY_ADDRESS)
  }
  return pictureBountyApiPromise
}

export { getPictureBountyApi }
