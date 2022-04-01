import React, { useRef, useCallback, useState, useEffect } from 'react';
import { getGuess, fetchAllCrossword } from '../store/crossword';
import store from '../store';
import anime from 'animejs/lib/anime.es.js';

import Crossword, {
  Cell,
  CrosswordImperative,
  CrosswordProvider,
} from '@jaredreisinger/react-crossword';
import { useSelector, useDispatch } from 'react-redux';
import socket from './socket';
import Timer from './Timer';
import Scores from './Scores';
import Clues from './TrackingClues';
import { updateGameComplete } from '../store/crossword';

export default function MyPage(props) {
  const dispatch = useDispatch();
  const crosswords = useSelector((state) => state.dataReducer.allCrossword);
  let gameId = useSelector((state) => state.dataReducer.game.id);
  console.log(gameId);

  const gameIdLocalStorage = window.localStorage.setItem(
    'gameId',
    String(gameId)
  );
  const room = window.localStorage.getItem('roomId');

  if (gameId) {
    socket.emit('send-game-id', { gameId, room });
  }
  const crossword = useRef(null);

  const selectedPuzzle = JSON.parse(window.localStorage.getItem('puzzle'));
  const puzzleData = JSON.parse(selectedPuzzle.data);
  const playerColor = window.localStorage.getItem('color').split(' ');

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
    const ding = new sound('/ding.mp3');

    socket.on('broadcast-game-id', (payload) => {
      console.log('received: ', payload);
      gameId = payload;
      window.localStorage.setItem('gameId', String(payload));
    });

    window.localStorage.setItem('correctClues', '[]');
    window.localStorage.setItem('correctCells', '[]');
    window.localStorage.setItem('score', '0');
    let crosswordSvg = document.querySelector('div.crossword svg');

    const wincheck = setInterval(() => {
      const corrects = JSON.parse(window.localStorage.getItem('correctClues'));
      if (
        corrects.length >=
        [...Object.keys(puzzleData.across)].length +
          [...Object.keys(puzzleData.down)].length
      ) {
        socket.emit('game-over', { roomId: room });
      }
    }, 1000);

    socket.on('show-results', () => {
      let score = Number(window.localStorage.getItem('score'));
      let gameId = Number(window.localStorage.getItem('gameId'));
      dispatch(updateGameComplete(gameId, { score: score }));
      props.history.push(`/results/${room}`);
    });

    socket.on('newWord', (payload) => {
      ding.sound.currentTime = 0;
      ding.play();
      const corrects = JSON.parse(window.localStorage.getItem('correctClues'));
      const newCorrect = `${payload.number} ${payload.direction}`;
      const cells = JSON.parse(window.localStorage.getItem('correctCells'));
      if (!corrects.includes(newCorrect)) {
        corrects.push(newCorrect);
        window.localStorage.setItem('correctClues', JSON.stringify(corrects));
      }
      const start = [
        puzzleData[payload.direction][payload.number].row,
        puzzleData[payload.direction][payload.number].col,
      ];
      let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      let x1 = start[1] * 6.666 + 3.325;
      let y1 = start[0] * 6.666 + 3.425;
      const x2 =
        payload.direction === 'across'
          ? x1 + 6.666 * (payload.answer.length - 1)
          : x1;
      const y2 =
        payload.direction === 'down'
          ? y1 + 6.666 * (payload.answer.length - 1)
          : y1;
      line.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
      // line.setAttribute('x1', x1);
      // line.setAttribute('y1', y1);
      line.setAttribute('opacity', '0.25');
      line.setAttribute('stroke', payload.color);
      line.setAttribute('stroke-width', '5');
      line.setAttribute('stroke-linecap', 'round');
      anime({
        targets: line,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        duration: 500,
      });

      for (let i = 0; i < payload.answer.length; i++) {
        crossword.current?.setGuess(start[0], start[1], payload.answer[i]);
        cells.push(`${start[0]}, ${start[1]}, ${payload.answer[i]}`);
        if (i === payload.answer.length - 1) {
          // let x2 = start[1] * 6.666 + 3.325;
          // let y2 = start[0] * 6.666 + 3.325;
          // line.setAttribute('x2', x2);
          // line.setAttribute('y2', y2);
          crosswordSvg.appendChild(line);
        }
        if (payload.direction === 'across') {
          start[1]++;
        } else {
          start[0]++;
        }
      }
      window.localStorage.setItem('correctCells', JSON.stringify(cells));
    });

    return function cleanup() {
      ding.sound.remove();
      clearInterval(wincheck);
    };
  }, []);

  const theme = {
    gridBackground: playerColor[0],
    focusBackground: playerColor[1],
    highlightBackground: playerColor[1],
    numberColor: playerColor[0],
    textColor: playerColor[0],
    paddingTop: '1in',
  };

  const onCellChange = (row, col, char) => {
    const cells = JSON.parse(window.localStorage.getItem('correctCells'));
    if (
      cells.some(
        (cell) => cell.split(', ').slice(0, 2).join(', ') === `${row}, ${col}`
      )
    ) {
      const correctLetter = cells
        .find(
          (cell) => cell.split(', ').slice(0, 2).join(', ') === `${row}, ${col}`
        )
        .split(', ')
        .slice(2)
        .join('');
      if (char !== correctLetter) {
        setTimeout(() => {
          crossword.current?.setGuess(row, col, correctLetter);
        }, 10);
      }
    }
  };
  const grid = document.getElementsByClassName('grid').item(0);
  if (grid) {
    grid.addEventListener('click', function () {
      let selectedClue = document.getElementsByClassName('huuhng').item(0);
      selectedClue.scrollIntoView({ block: 'center' });
    });
  }
  const onCorrect = (direction, number, answer) => {
    const corrects = JSON.parse(window.localStorage.getItem('correctClues'));
    const newCorrect = `${number} ${direction}`;
    if (!corrects.includes(newCorrect)) {
      let score = Number(window.localStorage.getItem('score'));
      const newPoints = 100 + 10 * answer.length;
      score += 100 + 10 * answer.length;
      window.localStorage.setItem('score', String(score));
      socket.emit('correctWord', {
        direction,
        number,
        answer,
        roomId: room,
        id: socket.id,
        color: playerColor[0],
        score: score,
        newPoints,
      });
      corrects.push(newCorrect);
    }

    window.localStorage.setItem('correctClues', JSON.stringify(corrects));
  };
  return (
    <div className="game-board">
      <Timer />
      <Clues />
      <div>
        <h1>{selectedPuzzle.name}</h1>
        <h3>Difficulty: {selectedPuzzle.difficulty.toUpperCase()}</h3>
      </div>

      <div style={{ height: 500, width: 1400 }} className="game">
        <Crossword
          onCorrect={onCorrect}
          onCellChange={onCellChange}
          ref={crossword}
          data={puzzleData}
          useStorage={false}
          theme={theme}
        />
      </div>
      <Scores />
    </div>
  );
}
