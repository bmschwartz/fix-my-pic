import { HardhatRuntimeEnvironment } from 'hardhat/types'
import fs from 'fs-extra'
import klaw from 'klaw'
import path from 'path'
import { task } from 'hardhat/config'
import '@matterlabs/hardhat-zksync'
import '@matterlabs/hardhat-zksync-solc'
import '@matterlabs/hardhat-zksync-ethers'
import '@nomicfoundation/hardhat-chai-matchers'

task(
  'copy-artifacts',
  'Copies ABI files to the frontend folder',
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // Define source and destination directories
    const artifactsDir = path.join(__dirname, './artifacts-zk')
    const frontendDir = path.join(__dirname, './public/artifacts')

    // Ensure the destination directory exists
    await fs.ensureDir(frontendDir)

    // Array to hold all JSON files to be copied
    const filesToCopy: string[] = []

    // Function to filter JSON files excluding .dbg.json files
    const filterJsonFiles = (filePath: string) => {
      return (
        filePath.endsWith('.json') &&
        !filePath.endsWith('.dbg.json') &&
        !filePath.includes('build-info') &&
        !filePath.includes('@openzeppelin')
      )
    }

    // Traverse the directory recursively to find all relevant JSON files
    await new Promise<void>((resolve, reject) => {
      klaw(artifactsDir)
        .on('data', (item: any) => {
          if (filterJsonFiles(item.path)) {
            filesToCopy.push(item.path)
          }
        })
        .on('end', resolve)
        .on('error', reject)
    })

    for (const file of filesToCopy) {
      const fileName = path.basename(file) // Get the file name
      const destinationPath = path.join(frontendDir, fileName) // Flat list in destination directory
      await fs.copyFile(file, destinationPath)
    }
  }
)

const config: any = {
  defaultNetwork: 'zkSyncInMemory',
  solidity: '0.8.24',
  paths: {
    sources: './contracts',
    tests: './contracts/tests',
    artifacts: './artifacts',
  },
  zksolc: {
    settings: {},
  },
  networks: {
    zkSyncDocker: {
      url: 'http://127.0.0.1:3050', // The testnet RPC URL of ZKsync Era network.
      ethNetwork: 'http://127.0.0.1:8545', // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true, // enables zksolc compiler
    },
    zkSyncInMemory: {
      url: 'http://127.0.0.1:8011',
      ethNetwork: 'localhost', // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
  },
}

export default config
