import React, { useEffect, useState } from "react";
import socket from "./socket";
import { Link } from "react-router-dom";

export default function Lobby(props) {
  const [state, setState] = useState({
    players: [],
    host: "",
    // selectedPuzzle: "" (eventually this could be where we store which puzzle the players select? )
  });

  useEffect(() => {
    const room = window.localStorage.getItem("roomId"); //the roomId is passed to the lobby through localStorage
    socket.emit("get-host", room);

    loadUsers();
    socket.on("render-users", (playerInfo) => {
      setState({ players: playerInfo, host: playerInfo[0].nickname });
    });

    // socket.on("set-host", (host) => {
    //   setState({ ...state, host: host });
    //   console.log(state.host);
    // });

    socket.on("update-users", () => {
      loadUsers();
    });

    socket.on("begin-session", (mode) => {
      props.history.push(`/${mode}/${room}`);
    });
  }, []);

  function loadUsers() {
    const roomId = window.localStorage.getItem("roomId");
    socket.emit("load-users", roomId);
  }

  function handleClick() {
    const roomId = window.localStorage.getItem("roomId");
    navigator.clipboard.writeText(`${window.location.host}/?` + roomId);
    // alert("Link copied to clipboard!");
  }
  return (
    <div className="splash-container">
      <div className="splash">
        <h2
        // style={{
        //   textAlign: "center",
        //   marginTop: "9px",
        // }}
        >{`${state.host}'s Lobby`}</h2>
        <div
        // style={{
        //   flexWrap: "nowrap",
        //   width: "430px",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        //   alignContent: "center",
        //   textAlign: "center",
        //   height: "260px",
        // }}
        >
          {state.players.map((player, i) => {
            return (
              <div md={4} key={i}>
                <h4 style={{ height: "280px", color: player.color }}>
                  {player.nickname}
                </h4>
              </div>
            );
          })}
        </div>
        <Link to="/game">
          <button className="button-success pure-button">Start Game</button>
        </Link>
        <div style={{ marginTop: "130px" }}>
          <button
            className="button-success pure-button"
            type="button"
            onClick={() => handleClick()}
          >
            Copy Invite Link
          </button>
        </div>
      </div>
    </div>
  );
}
