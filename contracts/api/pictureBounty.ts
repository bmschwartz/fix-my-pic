import hre from 'hardhat'
import { Addressable, ethers } from 'ethers'
import { Contract } from 'zksync-ethers'
import { deployContract, getProvider } from '../utils'
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

const BOUNTY_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_BOUNTY_FACTORY_ADDRESS || ''

async function createPictureBountyApi(initialFactoryAddress: string): Promise<PictureBountyApi> {
  let factoryContract: Contract
  let factoryAddress: string | Addressable = initialFactoryAddress
  let factoryABI: string[] = []
  let bountyABI: string[] = []
  let bounties: Record<string, Bounty> = {}

  const _getFactoryABI = async (): Promise<string[]> => {
    const contractArtifact = await hre.artifacts.readArtifact('PictureBountyFactory')
    return contractArtifact.abi
  }

  const _getBountyABI = async (): Promise<string[]> => {
    const contractArtifact = await hre.artifacts.readArtifact('PictureBounty')
    return contractArtifact.abi
  }

  const _pictureBountyCreatedHandler = async (address: string) => {
    console.log(`DEBUG pictureBountyCreatedHandler ${address}`)
    await getPictureBounty({ address, refetch: true })
  }

  const _initFactoryContract = async (): Promise<Contract> => {
    if (factoryContract) {
      return factoryContract
    }

    if (!factoryAddress) {
      const contractArtifactName = 'PictureBountyFactory'
      const constructorArguments: unknown[] = []
      const pictureBountyFactory = await deployContract(contractArtifactName, constructorArguments)

      factoryAddress = pictureBountyFactory.target
    }

    factoryABI = await _getFactoryABI()
    bountyABI = await _getBountyABI()
    const contract = new Contract(factoryAddress, factoryABI, getProvider())

    if (!contract) {
      throw new Error('Could not create the picture bounty factory!')
    }

    await contract.removeAllListeners()
    console.log(`DEBUG before listeners: ${await contract.listenerCount()}`)
    await contract.addListener(ContractEvents.PictureBountyCreated, _pictureBountyCreatedHandler)
    console.log(`DEBUG after listeners: ${await contract.listenerCount()}`)

    return contract
  }

  const _fetchBountyContract = async (address: string): Promise<Bounty> => {
    const bountyContract = new ethers.Contract(address, bountyABI, getProvider())
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

    if (refetch) {
      console.log(`DEBUG getPictureBounty refetching ${address}`)
      bounties[address] = await _fetchBountyContract(address)
    } else {
      console.log(`DEBUG getPictureBounty without refetching ${address}`)
    }
    return bounties[address]
  }

  factoryContract = await _initFactoryContract()
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
