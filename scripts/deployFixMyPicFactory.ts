import dotenv from 'dotenv';

import { deployContract, getWallet } from '../contracts/utils';

dotenv.config();

const main = async () => {
  const priceOracle = process.env.PRICE_ORACLE;
  const fixMyPicNFT = process.env.FIXMYPIC_NFT;

  if (!priceOracle) {
    throw new Error('PRICE_ORACLE environment variable is not set');
  }
  if (!fixMyPicNFT) {
    throw new Error('FIXMYPIC_NFT environment variable is not set');
  }

  try {
    const wallet = getWallet();
    const contractName = 'FixMyPicFactory';

    console.log(`Deploying ${contractName} with priceOracle: ${priceOracle} and fixMyPicNFT: ${fixMyPicNFT}`);

    await deployContract(contractName, [], {
      wallet,
      asProxy: true,
      proxyConstructorArgs: [priceOracle, fixMyPicNFT],
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
