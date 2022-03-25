import React, { useEffect, useState } from 'react';
import socket from './socket';

export default function Timer() {
  const [time, setTime] = useState(60);
  const room = window.localStorage.getItem('roomId');
  let secondsPassed = 0;
  useEffect(() => {
    setInterval(() => {
      secondsPassed++;
      if (secondsPassed > 60) {
        console.log('GAME OVER');
        socket.emit('game-over', { roomId: room });
      }
      setTime(60 - secondsPassed);
    }, 1000);
  }, []);

  return (
    <div>
      <h2>
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
      </h2>
    </div>
  );
}
