require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    baobab: {
      url: process.env.KLAYTN_URL,
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2]
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
