import React, { useEffect, useState } from 'react';
import socket from './socket';

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
  }, []);

  return (
    <div>
      {players.map((player, i) => {
        return (
          <div md={4} key={i}>
            <h4 style={{ height: '280px', color: player.color }}>
              {player.nickname}: {player.score}
            </h4>
          </div>
        );
      })}
    </div>
  );
}
