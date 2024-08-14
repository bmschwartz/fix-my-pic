import { ContractTransactionReceipt, ethers } from 'ethers';
import { BrowserProvider, Contract, Signer } from 'zksync-ethers';

import FixMyPicFactorySchema from '@/public/artifacts/FixMyPicFactory.json';
import RequestSubmissionSchema from '@/public/artifacts/RequestSubmission.json';
import { convertUsdCentsToWei, getEthPrice } from '@/utils/currency';
import { getUnixTimestampOneYearFromNow } from '@/utils/datetime';
import { getLogger } from '@/utils/logging';

export interface WalletParams {
  account: string;
  provider: ethers.Eip1193Provider;
}

export interface CreatePictureRequestParams extends WalletParams {
  budget: number;
  expiresAt?: number;
  ipfsHash: string;
}

export interface CreateRequestSubmissionParams extends WalletParams {
  price: number;
  ipfsHash: string;
  requestAddress: string;
}

export interface PurchaseSubmissionParams extends WalletParams {
  address: string;
}

export interface CreateRequestCommentParams extends WalletParams {
  requestAddress: string;
  ipfsHash: string;
}

export interface FixMyPicContractService {
  createPictureRequest(params: CreatePictureRequestParams): Promise<string | null>;
  createRequestComment(params: CreateRequestCommentParams): Promise<string | null>;
  createRequestSubmission(params: CreateRequestSubmissionParams): Promise<string | null>;

  purchaseSubmission(params: PurchaseSubmissionParams): Promise<boolean>;
}

const logger = getLogger('services/contractService');

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || '';
const FIX_MY_PIC_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FIX_MY_PIC_FACTORY_ADDRESS || '';

if (!RPC_URL) {
  process.exit(1);
}
if (!FIX_MY_PIC_FACTORY_ADDRESS) {
  process.exit(1);
}

async function createFixMyPicContractService(factoryAddress: string): Promise<FixMyPicContractService> {
  const _getSigner = (walletProvider: ethers.Eip1193Provider, account: string): Promise<Signer> => {
    const provider = new BrowserProvider(walletProvider);
    return provider.getSigner(account);
  };

  const createPictureRequest = async ({
    ipfsHash,
    budget,
    expiresAt,
    provider,
    account,
  }: CreatePictureRequestParams): Promise<string | null> => {
    const fixMyPicFactory = new Contract(
      factoryAddress,
      FixMyPicFactorySchema.abi,
      await _getSigner(provider, account)
    );

    const tx = await fixMyPicFactory.createPictureRequest(
      ipfsHash,
      budget * 100, // convert to cents
      expiresAt || getUnixTimestampOneYearFromNow()
    );
    const receipt: ContractTransactionReceipt = await tx.wait();

    if (receipt.status !== 1) {
      logger.error('Failed to create image request', receipt);
      throw new Error('Failed to create image request');
    }

    const event = receipt.logs.find(
      (log) =>
        log.address === factoryAddress &&
        log.topics[0] === ethers.id('PictureRequestCreated(address,string,uint256,address,uint256,uint256)')
    );

    if (!event) {
      logger.error('PictureRequestCreated event not found', receipt);
      return null;
    }

    const decodedEvent = fixMyPicFactory.interface.parseLog(event);
    if (!decodedEvent) {
      logger.error('Failed to decode PictureRequestCreated event', receipt);
      return null;
    }

    return decodedEvent.args.request;
  };

  const createRequestSubmission = async ({
    price,
    account,
    provider,
    ipfsHash,
    requestAddress,
  }: CreateRequestSubmissionParams): Promise<string | null> => {
    const fixMyPicFactory = new Contract(
      factoryAddress,
      FixMyPicFactorySchema.abi,
      await _getSigner(provider, account)
    );

    const tx = await fixMyPicFactory.createRequestSubmission(
      requestAddress,
      ipfsHash,
      (price || 0) * 100 // convert to cents
    );
    const receipt: ContractTransactionReceipt = await tx.wait();

    if (receipt.status !== 1 || !receipt.contractAddress) {
      logger.error('Failed to create submission', receipt);
      throw new Error(`Failed to create submission on picture request ${requestAddress}`);
    }

    const event = receipt.logs.find(
      (log) =>
        log.address === factoryAddress &&
        log.topics[0] === ethers.id('RequestSubmissionCreated(address,address,string,uint256,address,uint256)')
    );

    if (!event) {
      logger.error('RequestSubmissionCreated event not found', receipt);
      return null;
    }

    const decodedEvent = fixMyPicFactory.interface.parseLog(event);

    if (!decodedEvent) {
      logger.error('Failed to decode RequestSubmissionCreated event', receipt);
      return null;
    }

    return decodedEvent.args.submission;
  };

  const purchaseSubmission = async ({
    address: submissionAddress,
    provider,
    account,
  }: PurchaseSubmissionParams): Promise<boolean> => {
    const submissionContract = new ethers.Contract(
      submissionAddress,
      RequestSubmissionSchema.abi,
      await _getSigner(provider, account)
    );
    const priceInCents = await submissionContract.price();
    const ethPrice = await getEthPrice();
    const priceInWei = convertUsdCentsToWei(priceInCents, ethPrice);

    const fixMyPicFactory = new Contract(
      factoryAddress,
      FixMyPicFactorySchema.abi,
      await _getSigner(provider, account)
    );

    const tx = await fixMyPicFactory.purchaseSubmission(submissionAddress, { value: priceInWei });
    const receipt: ContractTransactionReceipt = await tx.wait();

    const event = receipt.logs
      .map((log) => fixMyPicFactory.interface.parseLog(log))
      .find((log) => log && log.name === 'SubmissionPurchased');

    if (!event) {
      logger.error('SubmissionPurchased event not found', receipt, submissionAddress, account);
      throw new Error('SubmissionPurchased event not found');
    }

    return true;
  };

  const createRequestComment = async ({
    account,
    provider,
    ipfsHash,
    requestAddress,
  }: CreateRequestCommentParams): Promise<string | null> => {
    const fixMyPicFactory = new ethers.Contract(
      factoryAddress,
      FixMyPicFactorySchema.abi,
      await _getSigner(provider, account)
    );

    const tx = await fixMyPicFactory.createRequestComment(requestAddress, ipfsHash);
    const receipt: ContractTransactionReceipt = await tx.wait();

    if (receipt.status !== 1) {
      logger.error('Failed to create comment', receipt, requestAddress, account);
      throw new Error('Failed to create a comment');
    }

    const event = receipt.logs.find(
      (log) =>
        log.address === factoryAddress &&
        log.topics[0] === ethers.id('RequestCommentCreated(address,address,string,address,uint256)')
    );

    if (!event) {
      logger.error('RequestCommentCreated event not found', receipt);
      return null;
    }

    const decodedEvent = fixMyPicFactory.interface.parseLog(event);
    if (!decodedEvent) {
      logger.error('Failed to decode RequestCommentCreated event', receipt);
      return null;
    }

    return decodedEvent?.args.comment;
  };

  return { createPictureRequest, createRequestSubmission, purchaseSubmission, createRequestComment };
}

let contractServicePromise: Promise<FixMyPicContractService> | null = null;

const getFixMyPicContractService = async (): Promise<FixMyPicContractService> => {
  if (!contractServicePromise) {
    contractServicePromise = createFixMyPicContractService(FIX_MY_PIC_FACTORY_ADDRESS);
  }
  return contractServicePromise;
};

export { getFixMyPicContractService };
