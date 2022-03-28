import React, { useEffect, useState } from 'react';
import socket from './socket';
import anime from 'animejs/lib/anime.es.js';

export default function Scores() {
  const [players, setPlayers] = useState([]);

  function loadUsers() {
    const roomId = window.localStorage.getItem('roomId');
    socket.emit('load-users', roomId);
  }

  useEffect(() => {
    loadUsers();

    socket.on('render-users', (playerInfo) => {
      setPlayers(playerInfo);
    });

    socket.on('newWord', (payload) => {
      loadUsers();
      const points = document.getElementsByClassName(
        `got-points ${payload.id}`
      );
      anime({
        targets: points,
        keyframes: [
          { opacity: '100%', duration: 1 },
          { translateY: -40, opacity: '0%', duration: 5998 },
          { translateY: 0, duration: 1 },
        ],
        duration: 6000,
      });
    });
  }, []);

  return (
    <div id="score-board">
      {players.map((player, i) => {
        return (
          <div key={i} className="score">
            <h4 style={{ color: player.color }}>
              {player.nickname}: {player.score}
            </h4>
            <h3
              className={`got-points ${player.id}`}
              style={{ color: player.color, fontFamily: 'Impact' }}
            >
              +100
            </h3>
            <hr />
          </div>
        );
      })}
    </div>
  );
}
