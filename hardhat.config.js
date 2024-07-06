require('fs-extra')
require('klaw')
require('hardhat/config')
require('@matterlabs/hardhat-zksync')
require('@matterlabs/hardhat-zksync-solc')
require('@matterlabs/hardhat-zksync-ethers')

task("copy-artifacts", "Copies ABI files to the frontend folder", async (taskArgs, hre) => {
  const fs = require("fs-extra");
  const path = require("path");
  const klaw = require('klaw')

  // Define source and destination directories
  const artifactsDir = path.join(__dirname, "./contracts/artifacts-zk/contracts");
  const frontendDir = path.join(__dirname, "./public/artifacts");

  // Ensure the destination directory exists
  await fs.ensureDir(frontendDir);

  // Array to hold all JSON files to be copied
  const filesToCopy = [];

  // Function to filter JSON files excluding .dbg.json files
  const filterJsonFiles = (filePath) => {
    return filePath.endsWith(".json") && !filePath.endsWith(".dbg.json");
  };

  // Traverse the directory recursively to find all relevant JSON files
  await new Promise((resolve, reject) => {
    klaw(artifactsDir)
      .on("data", (item) => {
        if (filterJsonFiles(item.path)) {
          filesToCopy.push(item.path);
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });

  for (const file of filesToCopy) {
    const fileName = path.basename(file);  // Get the file name
    const destinationPath = path.join(frontendDir, fileName);  // Flat list in destination directory
    await fs.copyFile(file, destinationPath);
  }
});

const config = {
  defaultNetwork: 'zkSyncLocalTestnet',
  solidity: '0.8.24',
  paths: {
    sources: './contracts',
    tests: './tests/contracts',
    artifacts: './contracts/artifacts',
  },
  networks: {
    zkSyncLocalTestnet: {
      url: 'http://127.0.0.1:3050', // The testnet RPC URL of ZKsync Era network.
      ethNetwork: 'http://127.0.0.1:8545', // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true, // enables zksolc compiler
    },
  },
}

module.exports = config;
