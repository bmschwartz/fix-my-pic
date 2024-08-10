import { ethers } from 'ethers';

import PriceOracleSchema from '@/public/artifacts/PriceOracle.json';
import { getLogger } from '@/utils/logging';

const logger = getLogger('priceService');

const PRICE_ORACLE_ADDRESS = process.env.NEXT_PUBLIC_PRICE_ORACLE_ADDRESS;
if (!PRICE_ORACLE_ADDRESS) {
  console.error('Price Oracle address not found in environment variables');
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const priceOracleContract = new ethers.Contract(PRICE_ORACLE_ADDRESS!, PriceOracleSchema.abi, provider);

let _ethPrice: bigint = 0n;

async function fetchEthUsdPrice() {
  try {
    _ethPrice = await priceOracleContract.getLatestETHPrice();

    logger.debug('ETH/USD Price:', _ethPrice.toString());
  } catch (error) {
    logger.error('Error fetching ETH/USD price:', error);
  }
}

export function getEthPrice() {
  return _ethPrice;
}

fetchEthUsdPrice();
setInterval(fetchEthUsdPrice, 60 * 1000);
