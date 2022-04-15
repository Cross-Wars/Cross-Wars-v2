import React, { useEffect, useState } from 'react';
import socket from './socket';
import Confetti from 'react-confetti';
import GameOver from './GameOver';

export default function Results(props) {
  const [players, setPlayers] = useState([]);
  const [pieces, setPieces] = useState(500);
  const puzzle = JSON.parse(window.localStorage.getItem('puzzle'));

  function loadUsers() {
    const roomId = window.localStorage.getItem('roomId');
    socket.emit('load-users', roomId);
  }

  function handleClick() {
    const roomId = window.localStorage.getItem('roomId');
    socket.emit('return-to-lobby', roomId);
    props.history.push(`/lobby/${roomId}`);
  }

  useEffect(() => {
    socket.on('returning-to-lobby', () => {
      const roomId = window.localStorage.getItem('roomId');
      props.history.push(`/lobby/${roomId}`);
    });

    function sound(src) {
      this.sound = document.createElement('audio');
      this.sound.volume = 0.4;
      this.sound.src = src;
      this.sound.setAttribute('preload', 'auto');
      this.sound.setAttribute('controls', 'none');
      this.sound.style.display = 'none';
      document.body.appendChild(this.sound);
      this.play = function () {
        this.sound.play();
      };
      this.stop = function () {
        this.sound.pause();
      };
    }
    const fanfare = new sound('/fanfare.mp3');
    fanfare.play();
    let resultsSet = false;
    loadUsers();
    socket.on('render-users', (playerInfo) => {
      if (!resultsSet) {
        setPlayers(playerInfo.sort((a, b) => b.score - a.score));
      }
      resultsSet = true;
    });

    setTimeout(() => {
      setPieces(0);
    }, 10000);

    return function cleanup() {
      fanfare.sound.remove();
    };
  }, []);

  const isUserHost = window.localStorage.getItem('host');

  return (
    <div className="results-container">
      <Confetti numberOfPieces={pieces} />
      <h1>THE WINNER: {players[0] ? `${players[0].nickname}` : ''}</h1>
      {players.map((player, i) => {
        return (
          <div key={i}>
            <h4 style={{ height: '20px', color: player.color }}>
              {player.nickname}: {player.score}
            </h4>
          </div>
        );
      })}
      {isUserHost === 'true' ? (
        <button onClick={handleClick}>Return to Lobby</button>
      ) : (
        <br></br>
      )}

      <GameOver data={puzzle} showAnswers={true} size={'50vw'} />
    </div>
  );
}
