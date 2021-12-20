import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/EphereFootballerERC721.json";
import Header from "./components/Header.js";
import Field from "./components/TeamBuilder.js";
import PropagateLoader from "react-spinners/PropagateLoader";
import MyTeam from "./components/MyTeam";
import "./css/App.css";

const EPHERE_PLAYERS_SUPPLY = 50;
const json = require("./utils/Players.json");

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [players, setPlayers] = useState("");
  const [accountPlayers, setAccountPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#adf300");

  const contractAddress = "";
  const contractABI = abi.abi;

  /**
   * Checks if wallet is connected and checks if the wallet is able to mint. If it doesn´t have permission, it will excecute the setMinter function
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Make sure you have metamask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        await setCurrentAccount(account);
        let check = await checkMinter(account);
        !check && (await setMinter(account));
      } else {
        alert("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const disconnectWallet = () => {
    setCurrentAccount("");
  };

  /**
   * Connects wallet
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Mints a random Ephere player
   */
  const mint = async () => {
    const { ethereum } = window;
    if (!currentAccount) {
      alert("Please connect your metamask wallet");
    }
    try {
      if (ethereum) {
        let numberMinted = await getCounter();
        if (numberMinted.toNumber() >= EPHERE_PLAYERS_SUPPLY) {
          alert("There are no more Ephere players to mint");
          return;
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const EphereContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let found = false;
        let cid;
        let random;

        while (!found) {
          random = Math.floor(Math.random() * 50);
          let player = players[random];
          if (!player.selected) {
            found = true;
            cid = player.cid;
          }
        }

        const mintTxn = await EphereContract.mint(cid, currentAccount);
        setLoading(true);
        await mintTxn.wait();
        setLoading(false);
        players[random].selected = true;
        window.localStorage.setItem("players", JSON.stringify(players));
        let currentPlayers = await getCurrentCids();
        setAccountPlayers(currentPlayers);
        window.location.reload();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Gets array of cids from account´s players
   * @returns array of cids
   */
  const getCurrentCids = async () => {
    let cids = [];
    let tokensIds = await getTokenIds(currentAccount);
    if (tokensIds && tokensIds.length > 0) {
      for (let tokenid of tokensIds) {
        let cid = await getCid(tokenid);
        cids.push(cid);
      }
      return cids;
    }
  };

  /**
   * Gets cid according to token id
   * @param id tokenid
   * @returns corresponding cid to token id
   */
  const getCid = async (id) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const EphereContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let cid = await EphereContract.getCid(id);
        return cid;
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Checks for minter role in an address
   * @param address to check for minter
   * @returns true if address has minter role
   */
  const checkMinter = async (address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const EphereContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let check = await EphereContract.checkMinter(address);
        return check;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Sets minter role for an address
   * @param address to check for minter
   * @returns true if address has minter role now
   */
  const setMinter = async (address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const EphereContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        await EphereContract.setMinter(address);
        let check = checkMinter(address);
        return check;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * Returns ounter used to give token id in ERC 721 contract. Used to get the number of current minted ERC 721 tokens
   * @returns counter used to give token id in ERC 721 contract
   */
  const getCounter = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const EphereContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let counter = await EphereContract.getCounter();
        return counter;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Gets token ids and from address
   * @param address to get array of cids
   * @returns array of cids
   */
  const getTokenIds = async (address) => {
    try {
      const { ethereum } = window;
      if (ethereum && currentAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const EphereContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let tokenIds = await EphereContract.getTokenIdsFromAddress(address);
        let result = [];
        if (tokenIds) {
          for (let tokenid of tokenIds) {
            result.push(tokenid.toNumber());
          }
        }
        return result;
      } else {
        //console.log("Ethereum object doesn't exist! or account isnt loaded");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Sets localstorage json for players or fetchs and sets them if there is none in local storage
   */
  const getPlayers = async () => {
    let localPlayers = localStorage.getItem("players");
    if (!localPlayers) {
      localStorage.setItem("players", JSON.stringify(json));
      setPlayers(json);
    } else {
      localPlayers = JSON.parse(localPlayers);
      setPlayers(localPlayers);
    }
  };

  /**
   * Resets local storage if first use
   */
  useEffect(() => {
    async function checkInit() {
      let counter = await getCounter();
      counter = counter.toNumber();
      if (counter === 0) {
        localStorage.removeItem("players");
      }
    }
    checkInit();
    if (window.ethereum) {
      checkIfWalletIsConnected();
      getPlayers();
    }
  }, []);

  /**
   * Detects change in account and refreshes page
   */
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
        window.location.reload();
      });
    }
  });

  /**
   * Changes account players when account is changed
   */
  useEffect(() => {
    async function setCurrent() {
      let currentPlayers = await getCurrentCids();
      setAccountPlayers(currentPlayers);
    }
    setCurrent();
  }, [currentAccount]);

  return (
    <div className="App">
      <div id="toasterNetwork">
        Please switch to the Binance Smart Chain Testnet
      </div>
      <Header
        currentAccount={currentAccount}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
      <div className="divLoader">
        <PropagateLoader color={color} loading={loading} size={30} />
      </div>
      <MyTeam mint={mint} players={accountPlayers}></MyTeam>
      <Field players={accountPlayers}></Field>
    </div>
  );
}

export default App;
