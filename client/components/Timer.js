import React, { useEffect, useState } from 'react';
import socket from './socket';

export default function Timer() {
  const [time, setTime] = useState(600);
  const room = window.localStorage.getItem('roomId');
  let secondsPassed = 0;
  useEffect(() => {
    const losecheck = setInterval(() => {
      secondsPassed++;
      if (secondsPassed > 600) {
        console.log('GAME OVER');
        socket.emit('game-over', { roomId: room });
      }
      setTime(600 - secondsPassed);
    }, 1000);

    return function cleanup() {
      clearInterval(losecheck);
    };
  }, []);

  return (
    <div>
      <h2>
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
      </h2>
    </div>
  );
}
