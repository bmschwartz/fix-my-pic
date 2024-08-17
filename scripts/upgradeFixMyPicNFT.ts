import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import dotenv from 'dotenv';
import * as hre from 'hardhat';

import { deployContract, getWallet } from '../contracts/utils';

dotenv.config();

const main = async () => {
  try {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

    const factoryProxyAddress = process.env.PROXY as string;
    const contractName = process.env.CONTRACT as string;
    const contractInitializer = process.env.INITIALIZER as string;

    if (!factoryProxyAddress) {
      throw new Error('Missing proxy address for the FixMyPicNFT contract');
    }
    if (!contractName) {
      throw new Error('Missing factory contract name for upgrade!');
    }
    if (!contractInitializer) {
      throw new Error(`Missing initializer function name to upgrade ${contractName}!`);
    }

    const upgradedContract = await deployContract(contractName, [], {
      wallet,
      proxyAddress: factoryProxyAddress,
    });
    upgradedContract.connect(deployer.zkWallet);

    // wait some time before the next call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const initTx = await upgradedContract[contractInitializer]();
    const receipt = await initTx.wait();

    console.log(`${contractName} initialized!`, receipt.hash);
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
