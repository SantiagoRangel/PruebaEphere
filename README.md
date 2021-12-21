# PruebaEphere


## To run project follow the instructions:
1. Clone project
2. Run command on root directory
```sh
npm install
```
3. Go to your metamask and save momentarily your private key. Its located in account details.
3. Go to https://moralis.io/. Create a new account. Then go to speedy nodes, select BSC Network Endpoints. Copy the testnet url and save it momentarily. 
4. Go to secret.json and add your private key to key as well your moralis node url in url. Both inside ""
5. Add BSC testnet to your Metamask wallet https://academy.binance.com/es/articles/connecting-metamask-to-binance-smart-chain
6. Go to https://testnet.binance.org/faucet-smart to claim 1 BSC testnet BNB
7. Run this command on root directory 
```sh
npx hardhat run .\scripts\sample-script.js --network testnet
```
8. Save the address shown in you command prompt
9. Go to the folder called epheretest and run
```sh
npm install
```
10. Go to the epheretest\src folder and open App.js. Modify the contractAddress constant with the address saved from step 8
11. Run 
```sh
npm start
```
