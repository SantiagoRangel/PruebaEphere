import React, { useEffect } from "react";
import PlayerCard from "./PlayerCard";
import "../css/myteam.css";
export default function MyTeam(props) {

  return (
    <div className="mainMyTeam">
      <div className="head container-fluid">
        <h1 className="title">MY TEAM</h1>
        <button className="mintButton" onClick={props.mint}>
          MINT PLAYER
        </button>
      </div>
      <div className="playerContainer container-fluid">
        <div className="row center-block ">
          {props.players ? (
            props.players.map((player) => (
              <div
                key={player}  
                className="col-sm-2 col-lg-3 d-flex justify-content-center text-center"
              >
                <PlayerCard cid={player} id={player}></PlayerCard>
              </div>
            ))
          ) : (
            <h5 className="noTeamMessage">
              You have no players yet. Mint some to get your team ready.
            </h5>
          )}
        </div>
      </div>
    </div>
  );
}
