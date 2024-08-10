# Fix My Pic

Fix My Pic is a decentralized application (dApp) that allows users to submit photo editing requests and have them fulfilled by other users. The project leverages Ethereum smart contracts, IPFS for decentralized storage, and The Graph for querying blockchain data.

## Setup

Compile the smart contracts:
> pnpm run compile

Compile the GraphQL files:
> pnpm run compile-gql

Deploy the PriceOracle contract:

> FEED_ADDRESS=0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF
npx hardhat run scripts/deployPriceOracle.ts --network zkSyncTestnet

Copy the contract proxy address and plug it in below as `PRICE_ORACLE`

Deploy the FixMyPicFactory contract:
> PRICE_ORACLE=0x5fE58d975604E6aF62328d9E505181B94Fc0718C npx hardhat run scripts/deployFixMyPicFactory.ts --network zkSyncTestnet

### ETH price feeds on Chainstack for zkSync
`CHAINSTACK_ZK_MAINNET_FEED: 0x6D41d1dc818112880b40e26BD6FD347E41008eDA`
`CHAINSTACK_ZK_SEPOLIA_FEED: 0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF`