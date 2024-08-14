# Test token project

Test project to deploy my token on testnet


## Overview
This project contains a set of smart contracts and deployment scripts for deploying an ERC20 token (TestToken) and a staking contract (TestStaking) to the Klaytn Baobab test network. Additionally, it includes a script for deploying these contracts using Hardhat.

## Contracts

This project contains 3 contracts : `TestToken.sol`, `TestUSDCToken.sol`, `TestStaking.sol`.
All three are located below `./contracts`.

`TestToken` is an ERC20 token and use as main token so that user can stake them.
`TestUSDC` is also an ERC20 token and use as reward token.
`TestStaking` is a staking contract that allows users to stake and claim for rewards.


## Setup

Clone this repository to your local machine:

```
git clone https://github.com/yourusername/testtoken-project.git
cd testtoken-project
```


Install the necessary dependencies:

```
npm install
```

Configure your environment variables in a .env file:

```
ROPSTEN_URL=<Your_Infura_Or_Alchemy_URL>
PRIVATE_KEY=<Your_Private_Key>
ETHERSCAN_API_KEY=<Your_Etherscan_API_Key>
```

To compile and deploy the contracts, run
```
npx hardhat compile
npx hardhat run scripts/deploy.js --network baobab
```


To interact with the deployed contracts on console, run
```
npx hardhat console --network baobab
```


To run tests, run
```
npx hardhat test --network baobab
```
