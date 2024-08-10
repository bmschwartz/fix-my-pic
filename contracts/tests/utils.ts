import { Contract, ContractTransactionReceipt, EventLog, Log, Signer } from 'ethers';
import { ethers } from 'hardhat';

import FixMyPicFactorySchema from '../../public/artifacts/FixMyPicFactory.json';
import { getUnixTimestampOneYearFromNow } from '../../src/utils/datetime';
import { deployContract, getWallet } from '../utils';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

interface Account {
  address: string;
  key: string;
}

interface CreatePictureRequestProps {
  account: Account;
  factoryAddress: string;
  ipfsHash: string;
  budget: number;
  expiresAt: number;
}

interface CreateRequestSubmissionProps {
  account: Account;
  factoryAddress: string;
  requestAddress: string;
  price: number;
  ipfsHash: string;
}

interface CreateRequestCommentProps {
  account: Account;
  ipfsHash: string;
  requestAddress: string;
}

interface PurchaseSubmissionProps {
  account: Account;
  submissionAddress: string;
}

export async function deployPriceOracle(account: Account): Promise<Contract> {
  const wallet = getWallet(account.key);

  const contractName = 'PriceOracle';

  return deployContract(contractName, [], { wallet, asProxy: true, proxyConstructorArgs: [ZERO_ADDRESS] });
}

export async function deployFixMyPicFactory(account: Account, priceOracleAddress: string): Promise<Contract> {
  const wallet = getWallet(account.key);

  const contractName = 'FixMyPicFactory';

  return deployContract(contractName, [], {
    wallet,
    asProxy: true,
    proxyConstructorArgs: [priceOracleAddress],
  });
}

export async function _getSigner({ address, key }: Account): Promise<Signer> {
  try {
    const wallet = getWallet(key);
    // Check if the address matches the wallet's address
    if (wallet.address.toLowerCase() !== address.toLowerCase()) {
      throw new Error(`⛔️ The provided address does not match the wallet's address: ${wallet.address}`);
    }

    return wallet;
  } catch (error) {
    console.error('Error in _getSigner:', error);
    throw error;
  }
}

export async function _createPictureRequest({
  account,
  ipfsHash,
  budget,
  expiresAt,
  factoryAddress,
}: CreatePictureRequestProps): Promise<Contract> {
  const factoryContract = new Contract(factoryAddress, FixMyPicFactorySchema.abi, await _getSigner(account));

  const tx = await factoryContract.createPictureRequest(
    ipfsHash,
    budget,
    expiresAt || getUnixTimestampOneYearFromNow()
  );
  const receipt: ContractTransactionReceipt = await tx.wait();

  if (receipt.status !== 1) {
    throw new Error('Failed to create picture request');
  }

  const event = receipt.logs.find(
    (log: EventLog | Log) =>
      log.address === factoryAddress &&
      log.topics[0] === ethers.id('PictureRequestCreated(address,string,uint256,address,uint256,uint256)')
  );

  if (!event) {
    throw new Error('PictureRequestCreated event not found');
  }

  const decodedEvent = factoryContract.interface.parseLog(event);
  const pictureRequestAddress: string | null = decodedEvent?.args.request;

  if (!pictureRequestAddress) throw new Error('PictureRequestCreated event not found');

  return ethers.getContractAt('PictureRequest', pictureRequestAddress);
}

export async function _createRequestSubmission({
  account,
  factoryAddress,
  requestAddress,
  ipfsHash,
  price,
}: CreateRequestSubmissionProps): Promise<Contract> {
  const factoryContract = new Contract(factoryAddress, FixMyPicFactorySchema.abi, await _getSigner(account));

  const tx = await factoryContract.createRequestSubmission(requestAddress, ipfsHash, price);
  const receipt: ContractTransactionReceipt = await tx.wait();

  if (receipt.status !== 1) {
    throw new Error('Failed to create request submission');
  }

  const event = receipt.logs.find(
    (log: EventLog | Log) =>
      log.address === factoryAddress &&
      log.topics[0] === ethers.id('RequestSubmissionCreated(address,address,string,uint256,address,uint256)')
  );

  if (!event) {
    console.error('Event logs:', receipt.logs);
    throw new Error('RequestSubmissionCreated event not found. Missing event.');
  }

  const decodedEvent = factoryContract.interface.parseLog(event);
  const submissionAddress: string | null = decodedEvent?.args.submission;

  if (!submissionAddress) throw new Error('RequestSubmissionCreated address missing from event.');

  return ethers.getContractAt('RequestSubmission', submissionAddress);
}

export async function purchaseSubmission({}: PurchaseSubmissionProps): Promise<boolean> {
  return true;
}
