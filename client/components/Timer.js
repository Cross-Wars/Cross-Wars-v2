import React, { useEffect, useState } from 'react';
import socket from './socket';

export default function Timer() {
  const startTime = 600;
  const [time, setTime] = useState(startTime);
  const room = window.localStorage.getItem('roomId');
  let secondsPassed = 0;
  useEffect(() => {
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
    const tick = new sound('/tick.mp3');
    const losecheck = setInterval(() => {
      secondsPassed++;
      if (secondsPassed > startTime) {
        socket.emit('game-over', { roomId: room });
      }
      if (startTime - secondsPassed < 5) {
        tick.play();
      }
      setTime(startTime - secondsPassed);
    }, 1000);

    return function cleanup() {
      tick.sound.remove();
      clearInterval(losecheck);
    };
  }, []);

  return (
    <div id="timer">
      <h2>
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
      </h2>
    </div>
  );
}
