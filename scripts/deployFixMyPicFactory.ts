import { deployContract, getWallet } from '../contracts/utils'

const main = async () => {
  try {
    const wallet = getWallet()

    const contractName = 'FixMyPicFactory'

    await deployContract(contractName, [], { wallet, asProxy: true })
  } catch (error) {
    console.error('Error deploying contract:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
