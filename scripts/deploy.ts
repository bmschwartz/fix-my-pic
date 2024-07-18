import { deployContract, getWallet } from '../contracts/utils'

const main = async () => {
  try {
    const wallet = getWallet()

    const contractName = 'ImageRequestFactory'

    await deployContract(contractName, [], { wallet })
  } catch (error) {
    console.error('Error deploying contract:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
