import React, { useEffect, useState } from 'react';
import socket from './socket';
import Confetti from 'react-confetti';

export default function Results() {
  const [players, setPlayers] = useState([]);
  const [pieces, setPieces] = useState(500);

  function loadUsers() {
    const roomId = window.localStorage.getItem('roomId');
    socket.emit('load-users', roomId);
  }

  useEffect(() => {
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
  }, []);

  return (
    <div>
      <Confetti numberOfPieces={pieces} />
      <h1>THE WINNER:</h1>
      {players.map((player, i) => {
        return (
          <div key={i}>
            <h4 style={{ height: '280px', color: player.color }}>
              {player.nickname}: {player.score}
            </h4>
          </div>
        );
      })}
    </div>
  );
}
