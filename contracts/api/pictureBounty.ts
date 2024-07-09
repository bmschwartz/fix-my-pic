import fs from 'fs'
import path from 'path'

import { Addressable, ethers } from 'ethers'
import { Contract, Provider } from 'zksync-ethers'
import { Bounty, BountyStatus } from '@/types/bounty'
import { ContractEvents } from '../events'

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
  getPictureBounty(params: GetPictureBountyParams): Promise<Bounty>
  getPictureBounties(params: GetPictureBountiesParams): Promise<Bounty[]>
}

const ABI_FOLDER: string[] = [process.cwd(), 'public', 'artifacts']

export const getContractABI = (contractName: string) => {
  const filePath = path.join(...ABI_FOLDER, `${contractName}.json`)
  const jsonData = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(jsonData)
  return data.abi
}

const BOUNTY_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_BOUNTY_FACTORY_ADDRESS || ''

if (!BOUNTY_FACTORY_ADDRESS) {
  process.exit('No bounty factory address provided')
}

async function createPictureBountyApi(initialFactoryAddress: string): Promise<PictureBountyApi> {
  let factoryContract: Contract
  let factoryAddress: string | Addressable = initialFactoryAddress
  let factoryABI: string[] = []
  let bountyABI: string[] = []
  let bounties: Record<string, Bounty> = {}
  const provider = new Provider('http://127.0.0.1:8011')

  const _pictureBountyCreatedHandler = async (address: string) => {
    await getPictureBounty({ address, refetch: true })
  }

  const _initFactoryContract = async (): Promise<void> => {
    if (factoryContract) {
      return
    }

    bountyABI = await getContractABI('PictureBounty')
    factoryABI = await getContractABI('PictureBountyFactory')

    factoryContract = new Contract(factoryAddress, factoryABI, provider)

    if (!factoryContract) {
      throw new Error('Could not create the picture bounty factory!')
    }

    await factoryContract.addListener(
      ContractEvents.PictureBountyCreated,
      _pictureBountyCreatedHandler
    )
  }

  const _fetchBountyContract = async (address: string): Promise<Bounty> => {
    const bountyContract = new ethers.Contract(address, bountyABI, provider)
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

  const getPictureBounties = async (params: GetPictureBountiesParams): Promise<Bounty[]> => {
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
