import React, { useState, useEffect } from "react";
import $ from "jquery";
import "../css/field.css";

const BASE_IPFS_URL = "https://ipfs.ephere.io/ipfs/";

export default function Field(props) {
  const [strikers, setStrikers] = useState([]);
  const [midfielders, setMidfielders] = useState([]);
  const [defense, setDefense] = useState([]);
  const [goalKeeper, setGoalKepeer] = useState("");
  const [currentZone, setZone] = useState("");
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(0);
  const [attackScore, setAttackScore] = useState(0);
  const [defenseScore, setDefenseScore] = useState(0);
  const [passingScore, setPassingScore] = useState(0);
  const transparent = "transparent";
  const strikerColor = "rgba(255, 0, 0, 0.3)";
  const midColor = "rgba(133, 255, 133, 0.3)";
  const defenseColor = "rgba(255, 255, 0, 0.3)";
  const goalKeeperColor = "rgba(255, 166, 0, 0.3)";

  /**
   *  Recieves array of players cids from props and fetches its data to store ir in player array
   */
  useEffect(() => {
    if (props.players && players.length === 0) {
      for (let cid of props.players) {
        if(cid){

          fetch(BASE_IPFS_URL + cid)
            .then((res) => res.json())
            .then(
              (result) => {
                setPlayers((players) => players.concat(result));
              },
  
              (error) => {
                console.log(error);
              }
            );
        }
      }
    }
  }, [props.players]);

  /**
   * When players arrays updates, scores are updated as well
   */
  useEffect(() => {
    let attackSum = 0;
    let defenseSum = 0;
    let passingSum = 0;
    if (strikers.length > 0) {
      strikers.forEach((player) => {
        attackSum += player.attributes[38].value;
      });
      setAttackScore(attackSum / strikers.length);
    } else if (strikers.length == 0) {
      setAttackScore(0);
    }
    if (defense.length > 0) {
      defense.forEach((player) => {
        defenseSum += player.attributes[39].value;
      });
      setDefenseScore(defenseSum / defense.length);
    } else if (defense.length == 0) {
      setDefenseScore(0);
    }
    if (midfielders.length > 0) {
      midfielders.forEach((player) => {
        passingSum += player.attributes[40].value;
      });
      setPassingScore(passingSum / midfielders.length);
    } else if (midfielders.length == 0) {
      setPassingScore(0);
    }
  }, [players]);

  /**
   * Changes zones styles according to selected zone
   * @param zone Zone to add player
   */
  const selectZone = (zone) => {
    setZone(zone);
    if (zone === "striker") {
      document.getElementById("strikerZone").style.backgroundColor =
        strikerColor;
      document.getElementById("midZone").style.backgroundColor = transparent;
      document.getElementById("defenseZone").style.backgroundColor =
        transparent;
      document.getElementById("goalKeeperZone").style.backgroundColor =
        transparent;
    } else if (zone === "mid") {
      document.getElementById("strikerZone").style.backgroundColor =
        transparent;
      document.getElementById("midZone").style.backgroundColor = midColor;
      document.getElementById("defenseZone").style.backgroundColor =
        transparent;
      document.getElementById("goalKeeperZone").style.backgroundColor =
        transparent;
    } else if (zone === "defense") {
      document.getElementById("strikerZone").style.backgroundColor =
        transparent;
      document.getElementById("midZone").style.backgroundColor = transparent;
      document.getElementById("defenseZone").style.backgroundColor =
        defenseColor;
      document.getElementById("goalKeeperZone").style.backgroundColor =
        transparent;
    } else if (zone === "goalKeeper") {
      document.getElementById("strikerZone").style.backgroundColor =
        transparent;
      document.getElementById("midZone").style.backgroundColor = transparent;
      document.getElementById("defenseZone").style.backgroundColor =
        transparent;
      document.getElementById("goalKeeperZone").style.backgroundColor =
        goalKeeperColor;
    }
    if (selected < 11 && selected < props.players.length) {
      document.getElementById("select").style.visibility = "visible";
    } else {
      alert("You cannot add more players");
    }
  };

  /**
   * Gets selected value from select input and adds it to the position array
   */
  const addPlayer = () => {
    let player = JSON.parse($("#select :selected").val());
    if (currentZone === "striker") {
      setStrikers([...strikers, player]);
      setSelected(selected + 1);
    } else if (currentZone === "mid") {
      setMidfielders([...midfielders, player]);
      setSelected(selected + 1);
    } else if (currentZone === "defense") {
      setDefense([...defense, player]);
      setSelected(selected + 1);
    } else if (currentZone === "goalKeeper") {
      if (goalKeeper !== "") {
        let newPlayers = players;
        newPlayers.push(goalKeeper);
        setPlayers(newPlayers);
      } else {
        setSelected(selected + 1);
      }
      setGoalKepeer(player);
    }
    setPlayers(
      players.filter((arrayPlayer) => arrayPlayer.name !== player.name)
    );
    document.getElementById("select").selectedIndex = 0;

    $("#select").css("visibility", "hidden");
  };
  /**
   * Removes player from the position array and adds it to players array
   * @param position position of removed player
   */
  const removePlayer = (position) => {
    if (position === "striker" && strikers.length > 0) {
      let newPlayers = strikers;
      let player = newPlayers.pop();
      setStrikers(newPlayers);
      setPlayers([...players, player]);
    } else if (position === "midfielder" && midfielders.length > 0) {
      let newPlayers = midfielders;
      let player = newPlayers.pop();
      setMidfielders(newPlayers);
      setPlayers([...players, player]);
    } else if (position === "defense" && defense.length > 0) {
      let newPlayers = defense;
      let player = newPlayers.pop();
      setDefense(newPlayers);
      setPlayers([...players, player]);
    }

    setSelected(selected - 1);
  };
  return (
    <div className="container-fluid">
      <h1 className="title">EPHERE TEAM BUILDER</h1>
      <div className="row">
        <div className="col-7">
          <div className="bigContainer">
            <div className="">
              <div className="fieldContainer">
                <div
                  id="strikerZone"
                  className="strikerZone zone row"
                  style={{ backgroundColor: transparent }}
                >
                  {strikers.map((player, key) => (
                    <div key={key} className="col playerZone">
                      <button className="strikerIcon playerIcon">
                        {player.name.split(" ")[1]
                          ? player.name.split(" ")[1]
                          : player.name.split(" ")[0]}
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  id="midZone"
                  className="midfielderZone zone row"
                  style={{ backgroundColor: transparent }}
                >
                  {midfielders.map((player, key) => (
                    <div key={key} className="col playerZone">
                      <button className="midfielderIcon playerIcon">
                        {player.name.split(" ")[1]
                          ? player.name.split(" ")[1]
                          : player.name.split(" ")[0]}
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  id="defenseZone"
                  className="defenseZone zone row"
                  style={{ backgroundColor: transparent }}
                >
                  {defense.map((player, key) => (
                    <div key={key} className="col playerZone">
                      <button className="defenseIcon playerIcon">
                        {player.name.split(" ")[1]
                          ? player.name.split(" ")[1]
                          : player.name.split(" ")[0]}
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  id="goalKeeperZone"
                  className="goalkeeperZone zone row"
                  style={{ backgroundColor: transparent }}
                >
                  {goalKeeper !== "" ? (
                    <div className="col playerZone">
                      <button className="goalkeeperIcon playerIcon">
                        {goalKeeper.name.split(" ")[1]
                          ? goalKeeper.name.split(" ")[1]
                          : goalKeeper.name.split(" ")[0]}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="row btnContainer">
                <div className="col">
                  <i
                    className="strikerBtn teamButton fas fa-plus-circle"
                    onClick={() => {
                      selectZone("striker");
                    }}
                  ></i>
                </div>
                <div className="col">
                  {strikers.length > 0 ? (
                    <i
                      className="strikerBtn teamButton fas fa-minus-circle"
                      onClick={() => removePlayer("striker")}
                    ></i>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="row btnContainer">
                <div className="col">
                  <i
                    className="midBtn teamButton fas fa-plus-circle"
                    onClick={() => {
                      selectZone("mid");
                    }}
                  ></i>
                </div>
                <div className="col">
                  {midfielders.length > 0 ? (
                    <i
                      className="midBtn teamButton fas fa-minus-circle"
                      onClick={() => removePlayer("midfielder")}
                    ></i>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className=" row btnContainer">
                <div className="col">
                  <i
                    className="defenseBtn teamButton fas fa-plus-circle"
                    onClick={() => {
                      selectZone("defense");
                    }}
                  ></i>
                </div>
                <div className="col">
                  {defense.length > 0 ? (
                    <i
                      className="defenseBtn teamButton fas fa-minus-circle"
                      onClick={() => removePlayer("defense")}
                    ></i>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className=" row btnContainer">
                <div className="col">
                  <i
                    className="goalkeeperBtn teamButton fas fa-plus-circle"
                    onClick={() => {
                      selectZone("goalKeeper");
                    }}
                  ></i>
                </div>
                <div className="col"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-5">
          {players.length > 0 ? (
            <div className="selectContainer">
              <select
                id="select"
                defaultValue={"default"}
                className="custom-select"
                style={{ visibility: "hidden" }}
                onChange={addPlayer}
              >
                <option value="default" disabled disabled>
                  Select a player
                </option>
                {players.map((player, key) => (
                  <option key={key} value={JSON.stringify(player)}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            ""
          )}
          <h2> SCORE:</h2>
          <h5 className="score">
            ATTACK: <a className="bold">{attackScore.toFixed(2)}</a>
          </h5>
          <h5 className="score">
            DEFENSE: <a className="bold">{defenseScore.toFixed(2)}</a>
          </h5>
          <h5 className="score">
            PASSING: <a className="bold">{passingScore.toFixed(2)}</a>
          </h5>
        </div>
      </div>
    </div>
  );
}
