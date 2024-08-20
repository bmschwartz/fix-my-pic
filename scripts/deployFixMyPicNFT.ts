import dotenv from 'dotenv';

import { deployContract, getWallet } from '../contracts/utils';

dotenv.config();

const main = async () => {
  try {
    const wallet = getWallet();
    const contractName = 'FixMyPicNFT';

    console.log(`Deploying ${contractName}`);

    await deployContract(contractName, [], {
      wallet,
      asProxy: true,
    });

    console.log(`Successfully deployed ${contractName}`);
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
