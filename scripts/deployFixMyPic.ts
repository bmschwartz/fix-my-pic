import dotenv from 'dotenv';
import { Contract } from 'zksync-ethers';

import { deployContract, getWallet } from '../contracts/utils';

dotenv.config();

const deployPriceOracle = async (): Promise<Contract> => {
  const priceFeedAddress = process.env.FEED_ADDRESS as string;

  const wallet = getWallet();
  const contractName = 'PriceOracle';

  console.log(`Deploying ${contractName}`);

  const priceOracle = await deployContract(contractName, [], {
    wallet,
    asProxy: true,
    proxyConstructorArgs: [priceFeedAddress],
  });

  return priceOracle;
};

const deployFixMyPicNFT = async (): Promise<Contract> => {
  const wallet = getWallet();
  const contractName = 'FixMyPicNFT';

  console.log(`Deploying ${contractName}`);

  const nftContract = await deployContract(contractName, [], {
    wallet,
    asProxy: true,
  });

  return nftContract;
};

const deployFixMyPicFactory = async (priceOracle: Contract, nftContract: Contract): Promise<Contract> => {
  const wallet = getWallet();
  const contractName = 'FixMyPicFactory';

  const priceOracleAddress = await priceOracle.getAddress();
  const nftContractAddress = await nftContract.getAddress();

  console.log(
    `Deploying ${contractName} with priceOracle: ${priceOracleAddress} and fixMyPicNFT: ${nftContractAddress}`
  );

  const factoryContract = await deployContract(contractName, [], {
    wallet,
    asProxy: true,
    proxyConstructorArgs: [priceOracleAddress, nftContractAddress],
  });

  // @ts-ignore
  await nftContract.connect(getWallet()).transferOwnership(await factoryContract.getAddress());

  return factoryContract;
};

const main = async () => {
  try {
    const priceOracle = await deployPriceOracle();
    const nftContract = await deployFixMyPicNFT();

    const factoryContract = await deployFixMyPicFactory(priceOracle, nftContract);

    console.log('\n\nDEPLOYMENT SUCCESSFUL\n====================');
    console.log('Price Oracle:', await priceOracle.getAddress());
    console.log('FixMyPicNFT:', await nftContract.getAddress());
    console.log('FixMyPicFactory:', await factoryContract.getAddress());
    console.log('====================\n\n');
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
