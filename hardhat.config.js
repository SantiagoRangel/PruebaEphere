require("@nomiclabs/hardhat-waffle");
let secret = require('./secret.json') ;
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
// In secret.json add the moralis node url to url  and your wallet private key to key
module.exports = {
  solidity: "0.8.0",
  networks: {
    testnet: {
      url: secret.url,
      accounts: [secret.key]
    }
  }
};
