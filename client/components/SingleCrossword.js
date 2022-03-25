import React, { useRef, useCallback, useState, useEffect } from 'react';
import { getGuess, fetchAllCrossword } from '../store/crossword';
import store from '../store';

import Crossword, {
  CrosswordImperative,
  CrosswordProvider,
} from '@jaredreisinger/react-crossword';
import { useSelector, useDispatch } from 'react-redux';
import socket from './socket';
import Timer from './Timer';
import Scores from './Scores';

export default function MyPage() {
  const dispatch = useDispatch();
  const crosswords = useSelector((state) => state.dataReducer.allCrossword);
  const room = window.localStorage.getItem('roomId');

  const crossword = useRef(null);

  const selectedPuzzle = JSON.parse(window.localStorage.getItem('puzzle'));
  const puzzleData = JSON.parse(selectedPuzzle.data);


  useEffect(() => {
    dispatch(fetchAllCrossword());


    window.localStorage.setItem('correctClues', '[]');
    window.localStorage.setItem('correctCells', '[]');


    setInterval(() => {
      const corrects = JSON.parse(window.localStorage.getItem("correctClues"));
      console.log(
        corrects.length,
        " vs ",
        [...Object.keys(puzzleData.across)].length +
          [...Object.keys(puzzleData.down)].length
      );
      if (
        corrects.length >=
        [...Object.keys(puzzleData.across)].length +
          [...Object.keys(puzzleData.down)].length
      ) {

        console.log('DONE');
        socket.emit('game-over', { roomId: room });

      }
    }, 1000);

    socket.on('newWord', (payload) => {
      const corrects = JSON.parse(window.localStorage.getItem('correctClues'));
      const newCorrect = `${payload.number} ${payload.direction}`;
      const cells = JSON.parse(window.localStorage.getItem('correctCells'));
      if (!corrects.includes(newCorrect)) {
        corrects.push(newCorrect);
        window.localStorage.setItem('correctClues', JSON.stringify(corrects));
      }
      if (payload.direction === 'across') {
        const start = [
          puzzleData.across[payload.number].row,
          puzzleData.across[payload.number].col,
        ];
        for (let i = 0; i < payload.answer.length; i++) {
          crossword.current?.setGuess(start[0], start[1], payload.answer[i]);
          cells.push(`${start[0]}, ${start[1]}, ${payload.answer[i]}`);
          start[1]++;
        }
      } else {
        const start = [
          puzzleData.down[payload.number].row,
          puzzleData.down[payload.number].col,
        ];
        for (let i = 0; i < payload.answer.length; i++) {
          crossword.current?.setGuess(start[0], start[1], payload.answer[i]);
          cells.push(`${start[0]}, ${start[1]}, ${payload.answer[i]}`);
          start[0]++;
        }
      }
      window.localStorage.setItem('correctCells', JSON.stringify(cells));
    });
  }, []);

  const onCellChange = (row, col, char) => {
    console.log(row, col, char);
    const cells = JSON.parse(window.localStorage.getItem('correctCells'));
    if (
      cells.some(
        (cell) => cell.split(', ').slice(0, 2).join(', ') === `${row}, ${col}`
      )
    ) {
      console.log('ALREADY CORRECT');
      const correctLetter = cells
        .find(
          (cell) => cell.split(', ').slice(0, 2).join(', ') === `${row}, ${col}`
        )
        .split(', ')
        .slice(2)
        .join('');
      console.log(correctLetter);
      if (char !== correctLetter) {
        setTimeout(() => {
          crossword.current?.setGuess(row, col, correctLetter);
        }, 10);
      }
    }
  };

  const onCorrect = (direction, number, answer) => {
    const corrects = JSON.parse(window.localStorage.getItem('correctClues'));
    const newCorrect = `${number} ${direction}`;
    if (!corrects.includes(newCorrect)) {
      console.log('CORRECT');
      socket.emit('correctWord', { direction, number, answer, roomId: room });
      corrects.push(newCorrect);
    }
    window.localStorage.setItem('correctClues', JSON.stringify(corrects));
  };
  return (
    <div>

      <Timer />
      <div style={{ height: 200, width: 400 }}>

        <Crossword
          onCorrect={onCorrect}
          onCellChange={onCellChange}
          ref={crossword}
          data={puzzleData}
          useStorage={false}
        />
      </div>
      <Scores />
    </div>
  );
}
