import { ethers } from 'ethers';

import PriceOracleSchema from '@/public/artifacts/PriceOracle.json';

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
  } catch (error) {
    console.error('Failed to fetch ETH price:', error);
  }
}

export function getEthPrice() {
  return _ethPrice;
}

fetchEthUsdPrice();
setInterval(fetchEthUsdPrice, 60 * 1000);
