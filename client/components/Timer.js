import React, { useEffect, useContext } from 'react';
import { TimerContext, TimerContextProvider } from '../../context/TimerContext';
import socket from './socket';

export default function Timer() {
  const [time, setTime] = useContext(TimerContext);
  let secondsPassed = 0;
  const room = window.localStorage.getItem('roomId');
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
      if (secondsPassed >= time) {
        socket.emit('game-over', { roomId: room });
      }
      if (time - secondsPassed <= 10) {
        tick.play();
      }
      setTime(time - secondsPassed);
    }, 1000);

    return function cleanup() {
      tick.sound.remove();
      clearInterval(losecheck);
    };
  }, []);

  return (
    <TimerContextProvider>
      <div id="timer">
        <h2>
          {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
        </h2>
      </div>
    </TimerContextProvider>
  );
}
