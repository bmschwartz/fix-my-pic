import { Addressable, ContractTransactionReceipt, ethers } from 'ethers'
import { BrowserProvider, Contract, Provider } from 'zksync-ethers'

import { Bounty, BountyStatus } from '@/types/bounty'
import { ContractEvents } from '@/types/events'
import { EIP6963ProviderDetail } from '@/types/eip6963'
import PictureBountySchema from '@/public/artifacts/PictureBounty.json'
import PictureBountyFactorySchema from '@/public/artifacts/PictureBountyFactory.json'
import { convertUsdToEth } from './currency'

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
    status: BountyStatus
  }
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
    return {
      address,
      title,
      description,
      imageId,
      reward: Number(ethers.formatEther(reward)),
    }
  }

  const _fetchAllPictureBounties = async (): Promise<Record<string, Bounty>> => {
    const bountyAddresses = await factoryContract.getPictureBounties()
    const batchSize = 50 // Adjust based on rate limits
    let bountyContracts: Bounty[] = []

    for (let i = 0; i < bountyAddresses.length; i += batchSize) {
      const batch = bountyAddresses.slice(i, i + batchSize)
      const batchBounties = await Promise.all(batch.map(_fetchBountyContract))
      bountyContracts = bountyContracts.concat(batchBounties)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 second delay
    }

    return bountyContracts.reduce((acc: { [key: string]: Bounty }, obj: Bounty) => {
      acc[obj.address] = obj
      return acc
    }, {})
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

  const getPictureBounty = async (params: GetPictureBountyParams): Promise<Bounty> => {
    const { address, refetch } = params

    if (refetch || !(address in bounties)) {
      bounties[address] = await _fetchBountyContract(address)
    }

    return bounties[address]
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
