import { useEffect, useState } from "react";
import React from "react";
import logo from "../images/logo.png";
import $ from 'jquery';
import "../css/header.css";
export default function Header(props) {

  const [address, setAddress] = useState("");
  /**
   * Recieves current account and sets to state
   */
  useEffect(() => {
   setAddress(props.currentAccount)
  }, );

  /**
   * Fades in connected to toaster
   */
  const fadeToaster = () =>{
    $("#toaster").fadeIn().delay(1000).fadeOut("slow");
    
  }

  
  return (
    <header className="container-fluid">
      <img className="logo" src={logo} />
      <div id="toaster">
            Connected to: {address}
      </div>
      {props.currentAccount === ""? (
          <button className="connectButton" onClick={()=>{props.connectWallet(); fadeToaster()}}>
            Connect Wallet
          </button>
        ) : <button className="disconnectButton" onClick={props.disconnectWallet}>
        Disconnect
      </button>}
    </header>
  );
}
