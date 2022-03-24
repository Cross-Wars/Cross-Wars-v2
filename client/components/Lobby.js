import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "./socket";
import { Link } from "react-router-dom";
import { fetchAllCrossword } from "../store/crossword";

export default function Lobby(props) {
  const crosswords = useSelector((state) => state.dataReducer.allCrossword);
  const dispatch = useDispatch();
  window.localStorage.setItem("puzzle", "{}");

  const [state, setState] = useState({
    players: [],
    host: "",
    selectedPuzzle: "2017-01-04",
  });

  useEffect(() => {
    dispatch(fetchAllCrossword());

    const room = window.localStorage.getItem("roomId"); //the roomId is passed to the lobby through localStorage
    socket.emit("get-host", room);

    loadUsers();
    socket.on("render-users", (playerInfo) => {
      setState({ ...state, players: playerInfo, host: playerInfo[0].nickname });
    });

    socket.on("update-users", () => {
      loadUsers();
    });

    socket.on("begin-session", (puzzle) => {
      const roomId = window.localStorage.getItem("roomId");
      window.localStorage.setItem("puzzle", JSON.stringify(puzzle));
      props.history.push(`/game/${roomId}`);
      // props.history.push(`/${puzzle}/${room}`);
    });
  }, []);

  function loadUsers() {
    const roomId = window.localStorage.getItem("roomId");
    socket.emit("load-users", roomId);
  }

  //function to change which puzzle is currently selected:
  function selectPuzzle(puzzle) {
    window.localStorage.setItem("puzzle", JSON.stringify(puzzle));
    setState({ ...state, selectedPuzzle: puzzle.date });
  }

  //handler function to push all players into a game room with the selected puzzle
  function startSession(puzzle) {
    const roomId = window.localStorage.getItem("roomId");
    selectPuzzle(puzzle);
    socket.emit("start-session", roomId, puzzle);
    props.history.push(`/game/${roomId}`);
    // props.history.push(`/${state.selectedPuzzle}/${roomId}`);
  }

  //handler function to add the URL with room id to the clipboard
  function handleClick() {
    const roomId = window.localStorage.getItem("roomId");
    navigator.clipboard.writeText(`${window.location.host}/?` + roomId);
    // alert("Link copied to clipboard!");
  }

  const isUserHost = window.localStorage.getItem("host");
  const room = window.localStorage.getItem("roomId");

  return (
    <div className="splash-container">
      <div className="splash">
        <h2>{`${state.host}'s Lobby`}</h2>
        <div>
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

        {crosswords.map((puzzle, ind) => {
          return (
            <div
              className="card"
              key={ind}
              style={{
                width: "18rem",
                height: "350px",
                alignItems: "center",
                justifyContent: "center",
                margin: "5px",
              }}
            >
              <div style={{ fontFamily: "Fuzzy Bubbles, cursive" }}>
                {puzzle.difficulty}
              </div>
              <div style={{ textAlign: "center" }}>{puzzle.name}</div>
              {isUserHost === "true" ? (
                // <Link to={`/${puzzle.date}/${room}`}>
                <Link to={`/game/${room}`}>
                  <button
                    type="submit"
                    value={puzzle.date}
                    onClick={() => {
                      startSession(puzzle);
                    }}
                  >
                    Start Puzzle
                  </button>
                </Link>
              ) : (
                <br />
              )}
            </div>
          );
        })}
        {/* <Link to="/game">
          <button
            className="button-success pure-button"
            type="button"
            onClick={() => startSession()}
          >
            Start Game
          </button>
        </Link> */}
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
