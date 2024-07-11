import { BrowserProvider, Contract, Provider } from 'zksync-ethers'
import { Addressable, ContractTransactionReceipt, ethers } from 'ethers'

import { ContractEvents } from '@/types/events'
import { Bounty, BountyState } from '@/types/bounty'
import { BountySubmission } from '@/types/submission'
import { EIP6963ProviderDetail } from '@/types/eip6963'
import PictureBountySchema from '@/public/artifacts/PictureBounty.json'
import BountySubmissionSchema from '@/public/artifacts/BountySubmission.json'
import PictureBountyFactorySchema from '@/public/artifacts/PictureBountyFactory.json'

import { convertUsdToEth } from './currency'
import { batchTasksAsync } from './batch'

interface CreatePictureBountyParams {
  wallet: EIP6963ProviderDetail
  address: string
  bountyData: {
    title: string
    description: string
    imageId: string
    reward: number
  }
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

interface GetSubmissionsParams {
  bountyAddress: string
}

export interface PictureBountyApi {
  createPictureBounty(params: CreatePictureBountyParams): Promise<Bounty>
  getPictureBounty(params: GetPictureBountyParams): Promise<Bounty>
  getPictureBounties(params?: GetPictureBountiesParams): Bounty[]
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
  const provider = new Provider(BOUNTY_RPC_URL)

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
    const title = await bountyContract.title()
    const description = await bountyContract.description()
    const imageId = await bountyContract.imageId()
    const reward = await bountyContract.reward()
    const state = await bountyContract.currentState()
    const submissionAddresses = await bountyContract.getSubmissions()
    submissionAddresses.forEach((element: any) => {
      console.log('DEBUG address', element, typeof element)
    })
    const submissions = await _fetchBountySubmissions(submissionAddresses)
    console.log('DEBUG submissions', submissions)

    return {
      address,
      title,
      description,
      imageId,
      state,
      submissions,
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
    return batchTasksAsync<BountySubmission>({
      tasks: addresses,
      mapFunction: _fetchBountySubmissionContract,
    })
  }

  const _fetchBountySubmissionContract = async (address: string): Promise<BountySubmission> => {
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
    const {
      address: walletAddress,
      wallet,
      bountyData: { title, description, imageId, reward },
    } = params

    const provider = new BrowserProvider(wallet.provider)
    const signer = await provider.getSigner(walletAddress)

    const bountyFactory = new Contract(factoryAddress, PictureBountyFactorySchema.abi, signer)

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
      console.error('Unable to create the bounty:', error)
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
  const getSubmissions = async ({
    bountyAddress,
  }: GetSubmissionsParams): Promise<BountySubmission[]> => {
    return bounties[bountyAddress].submissions
  }

  await _initFactoryContract()
  bounties = await _fetchAllPictureBounties()

  return {
    createPictureBounty,
    getPictureBounty,
    getPictureBounties,
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
