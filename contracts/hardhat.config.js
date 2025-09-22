require("@nomicfoundation/hardhat-toolbox");
const { url } = require("./localhost_url.json")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: url,
      chainId: 31337,
    },
  },
};