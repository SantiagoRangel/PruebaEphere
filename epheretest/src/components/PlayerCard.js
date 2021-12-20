import React, { useEffect, useState } from "react";
import "../css/playercard.css";

const BASE_IPFS_URL = "https://ipfs.ephere.io/ipfs/";

export default function PlayerCard(props) {
  const [playerData, setPlayerData] = useState("");
  const [attributes, setAttributes] = useState("");

  /**
   * Fetchs player data from DB using cid from props
   */
  useEffect(() => {
    if(props.cid){

      fetch(BASE_IPFS_URL + props.cid)
        .then((res) => res.json())
        .then(
          (result) => {
            setPlayerData(result);
            setAttributes(result.attributes);
          },
  
          (error) => {
          }
        );
    }
  }, []);

  return (
    <div>
      {playerData != "" ? (
        <div>
          <div
            className="playerCard "
            style={{ backgroundColor: playerData.background_color }}
          >
            <img
              className="portrait"
              data-bs-toggle="modal"
              data-bs-target={"#playerModal" + props.id}
              src={playerData.image}
            />{" "}
          </div>
          <button
            className="playerName purpleButton"
            type="button"
            data-bs-toggle="modal"
            data-bs-target={"#playerModal" + props.id}
          >
            {playerData.name}
          </button>
        </div>
      ) : (
        ""
      )}

      <div
        className="modal fade"
        id={"playerModal" + props.id}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLongTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="row">
            <div className="col-7 ">
              <h6 className="playerCardName">{playerData.name}</h6>
              <div className="row">
                {" "}
                {attributes != ""
                  ? attributes.map((attribute, key) => (
                      <div className="col-6" key={key}>
                        <p className="attribute">
                          {attribute.trait_type.replace("_", " ")}{" "}
                          <a className="attributeValue">{attribute.value}</a>{" "}
                        </p>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
            <div className="col-5">
              <img
                className="playerImage"
                src={playerData.image_full_body}
              ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
