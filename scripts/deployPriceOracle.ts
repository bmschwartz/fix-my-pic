import dotenv from 'dotenv';

import { deployContract, getWallet } from '../contracts/utils';

dotenv.config();

const main = async () => {
  const priceFeedAddress = process.env.FEED_ADDRESS as string;

  try {
    const wallet = getWallet();

    const contractName = 'PriceOracle';

    await deployContract(contractName, [], {
      wallet,
      asProxy: true,
      proxyConstructorArgs: [priceFeedAddress],
    });
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
