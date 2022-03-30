import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from './socket';
import { Link } from 'react-router-dom';
import { fetchCrosswordsByYear } from '../store/crossword';
import { Button } from '@material-ui/core';

export default function Lobby(props) {
  let crosswords = useSelector((state) => state.dataReducer.allCrossword);
  const dispatch = useDispatch();

  window.localStorage.setItem('puzzle', '{}');

  const [state, setState] = useState({
    players: [],
    host: '',
    selectedPuzzle: '2017-01-04',
    difficulty: 'All',
    year: 2017,
  });

  useEffect(() => {
    dispatch(fetchCrosswordsByYear(state.year));

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
    });
  }, []);

  function loadUsers() {
    const roomId = window.localStorage.getItem('roomId');
    socket.emit('load-users', roomId);
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
    const roomId = window.localStorage.getItem('roomId');
    navigator.clipboard.writeText(`${window.location.host}/?` + roomId);
  }

  function filterDifficulty(crosswords) {
    let filterCrosswords = [...crosswords];
    switch (state.difficulty) {
      case 'easy':
        filterCrosswords = filterCrosswords.filter(
          (crossword) => crossword.difficulty === 'easy'
        );
        break;
      case 'medium':
        filterCrosswords = filterCrosswords.filter(
          (crossword) => crossword.difficulty === 'medium'
        );
        break;
      case 'hard':
        filterCrosswords = filterCrosswords.filter(
          (crossword) => crossword.difficulty === 'hard'
        );
        break;
      default:
        break;
    }
    return filterCrosswords;
  }

  const isUserHost = window.localStorage.getItem('host');
  const room = window.localStorage.getItem('roomId');
  const filterCrosswords = filterDifficulty(crosswords);

  return (
    <div>
      <div className="lobby-header">
        <h2>{`${state.host}'s Lobby`}</h2>

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
          );
        })}
      </div>
      {isUserHost === 'true' ? (
        <h3>Choose a Puzzle!</h3>
      ) : (
        <h3>Your Host Will Choose A Puzzle!</h3>
      )}

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
      <select
        value={state.year}
        onChange={(event) => {
          setState({ ...state, year: parseInt(event.target.value) });
          dispatch(fetchCrosswordsByYear(event.target.value));
        }}
      >
        <option value="2017">2017</option>
        <option value="2016">2016</option>
        <option value="2015">2015</option>
        <option value="2014">2014</option>
      </select>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          let randomIndex = Math.floor(Math.random() * filterCrosswords.length);
          const randomPuzzle = filterCrosswords[randomIndex];
          startSession(randomPuzzle);
        }}
      >
        Choose Random Puzzle
      </Button>
      <div className="card-container">
        {filterCrosswords.map((puzzle, ind) => {
          return (
            <div className="card" key={ind}>
              <div className="puzzle-logo">
                <h1>{puzzle.difficulty[0].toUpperCase()}</h1>
                <p>{ind + 1}</p>
              </div>
              <br />
              <div>
                {puzzle.difficulty[0].toUpperCase() +
                  puzzle.difficulty.slice(1)}
              </div>
              <div>{puzzle.name}</div>
              {isUserHost === 'true' ? (
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
      </div>
    </div>
  );
}
