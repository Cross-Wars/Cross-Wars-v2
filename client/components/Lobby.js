
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import socket from "./socket"
import { Link } from "react-router-dom"
import { fetchAllCrossword } from "../store/crossword"
import { Button } from "@material-ui/core"

export default function Lobby(props) {
  const crosswords = useSelector((state) => state.dataReducer.allCrossword)
  const dispatch = useDispatch()

  window.localStorage.setItem("puzzle", "{}")

  const [state, setState] = useState({
    players: [],
    host: "",
    selectedPuzzle: "2017-01-04",
    difficulty: "All",
  })


  useEffect(() => {
    dispatch(fetchAllCrossword())


    const room = window.localStorage.getItem('roomId'); //the roomId is passed to the lobby through localStorage
    socket.emit('get-host', room);

    loadUsers();
    socket.on('render-users', (playerInfo) => {
      setState({ ...state, players: playerInfo, host: playerInfo[0].nickname });
    });

    socket.on('update-users', () => {
      loadUsers();
    });

    socket.on('begin-session', (puzzle) => {
      const roomId = window.localStorage.getItem('roomId');
      window.localStorage.setItem('puzzle', JSON.stringify(puzzle));
      props.history.push(`/game/${roomId}`);
    })
  }, [])

  function loadUsers() {
    const roomId = window.localStorage.getItem("roomId")
    socket.emit("load-users", roomId)

  }

  //function to change which puzzle is currently selected:
  function selectPuzzle(puzzle) {
    window.localStorage.setItem('puzzle', JSON.stringify(puzzle));
    setState({ ...state, selectedPuzzle: puzzle.date });

  }

  //handler function to push all players into a game room with the selected puzzle
  function startSession(puzzle) {
    const roomId = window.localStorage.getItem('roomId');
    selectPuzzle(puzzle);
    socket.emit('start-session', roomId, puzzle);
    props.history.push(`/game/${roomId}`);
  }

  //handler function to add the URL with room id to the clipboard
  function handleClick() {

    const roomId = window.localStorage.getItem("roomId")
    navigator.clipboard.writeText(`${window.location.host}/?` + roomId)
    // alert("Link copied to clipboard!");
  }

  function filterDifficulty(crosswords) {
    let filterCrosswords = [...crosswords]
    switch (state.difficulty) {
      case "easy":
        filterCrosswords = filterCrosswords.filter(
          (crossword) => crossword.difficulty === "easy"
        )
        break
      case "medium":
        filterCrosswords = filterCrosswords.filter(
          (crossword) => crossword.difficulty === "medium"
        )
        break
      case "hard":
        filterCrosswords = filterCrosswords.filter(
          (crossword) => crossword.difficulty === "hard"
        )
        break
      default:
        break
    }
    return filterCrosswords
  }

  const isUserHost = window.localStorage.getItem("host")
  const room = window.localStorage.getItem("roomId")
  const filterCrosswords = filterDifficulty(crosswords)

  return (
    <div className="splash-container">
      <div className="splash">
        <div className="lobby-header">
          <h2>{`${state.host}'s Lobby`}</h2>
          {/* <button
            className="button-success pure-button"
            type="button"
            onClick={() => handleClick()}
          >
            Copy Invite Link
          </button> */}

          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleClick()}
          >
            Copy Invite Link
          </Button>
        </div>

        <h3>PLAYERS:</h3>
        <div className="card-container">
          {state.players.map((player, i) => {
            return (
              <div className="card" key={i}>
                <h4 style={{ color: player.color }}>{player.nickname}</h4>
              </div>
            )
          })}
        </div>
        <h3>Choose a Puzzle!</h3>
        <select
          value={state.difficulty}
          onChange={(event) =>
            setState({ ...state, difficulty: event.target.value })
          }
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div className="card-container">
          {filterCrosswords.map((puzzle, ind) => {
            return (
              <div className="card" key={ind}>
                <div className="puzzle-logo">
                  <h1>{puzzle.difficulty[0].toUpperCase()}</h1>
                  <p>{ind + 1}</p>
                </div>
                <div>{puzzle.difficulty}</div>
                <div>{puzzle.name}</div>
                {isUserHost === 'true' ? (
                  <Link to={`/game/${room}`}>
                    <button
                      type="submit"
                      value={puzzle.date}
                      onClick={() => {
                        startSession(puzzle)
                      }}
                    >
                      Start Puzzle
                    </button>
                  </Link>
                ) : (
                  <br />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
