import path from 'path';
import fs from 'fs-extra';
import { task } from 'hardhat/config';
import { HardhatUserConfig } from 'hardhat/types';
import klaw from 'klaw';

import '@matterlabs/hardhat-zksync';
import '@matterlabs/hardhat-zksync-solc';
import '@matterlabs/hardhat-zksync-ethers';
import '@nomicfoundation/hardhat-chai-matchers';

task(
  'copy-artifacts',
  'Copies ABI files to the frontend folder',

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (taskArgs: any, hre: any) => {
    const artifactsDir = path.join(__dirname, './artifacts-zk');
    const frontendDir = path.join(__dirname, './public/artifacts');

    await fs.ensureDir(frontendDir);

    const filesToCopy: string[] = [];

    const filterJsonFiles = (filePath: string) => {
      return (
        filePath.endsWith('.json') &&
        !filePath.endsWith('.dbg.json') &&
        !filePath.includes('build-info') &&
        !filePath.includes('@openzeppelin')
      );
    };

    await new Promise<void>((resolve, reject) => {
      klaw(artifactsDir)
        .on('data', (item: any) => {
          if (filterJsonFiles(item.path)) {
            filesToCopy.push(item.path);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    for (const file of filesToCopy) {
      const fileName = path.basename(file);
      const destinationPath = path.join(frontendDir, fileName);
      await fs.copyFile(file, destinationPath);
    }
  }
);

const config: HardhatUserConfig = {
  defaultNetwork: 'zkSyncDocker',
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
      url: 'http://127.0.0.1:3050',
      ethNetwork: 'http://127.0.0.1:8545',
      zksync: true,
    },
    zkSyncInMemory: {
      url: 'http://127.0.0.1:8011',
      ethNetwork: 'localhost',
      zksync: true,
    },
    zkSyncTestnet: {
      url: 'https://sepolia.era.zksync.dev',
      ethNetwork: 'sepolia',
      zksync: true,
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
    },
    hardhat: {
      zksync: true,
    },
  },
};

export default config;
