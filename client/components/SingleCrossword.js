import React, { useRef, useCallback, useState, useEffect } from "react"
import { crossBoard1 } from "./crossWord"
import { getGuess, fetchAllCrossword } from "../store/crossword"
import store from "../store"

import Crossword, {
  CrosswordImperative,
  CrosswordProvider,
} from "@jaredreisinger/react-crossword"
import io from "socket.io-client"
import { useSelector, useDispatch } from "react-redux"
import socket from "./socket"
//import { RootState } from "../store"

// console.log(crossBoard1)
//console.log(CrosswordProvider.defaultProps?.theme?.focusBackground)
// console.log(Crossword)
// console.log(crossBoard1.across[1].answer)

// socket.on("connect", () => {
//   console.log("connected to server")
//   socket.on("crosswar", (payload) => {
//     store.dispatch(getGuess(payload.row, payload.col, payload.char))
//   })
// })

export default function MyPage() {

  const dispatch = useDispatch()
  const crosswords = useSelector((state) => state.dataReducer.allCrossword)

  //const crossword = useRef < CrosswordImperative > null
  const crossword = useRef(null)

  useEffect(() => {
    // socket.on('crosswar', (payload) => {
    //   store.dispatch(getGuess(payload.row, payload.col, payload.char));
    // });

    window.localStorage.setItem('correctClues', '[]');
    window.localStorage.setItem('correctCells', '[]');

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
          crossBoard1.across[payload.number].row,
          crossBoard1.across[payload.number].col,
        ];
        for (let i = 0; i < payload.answer.length; i++) {
          crossword.current?.setGuess(start[0], start[1], payload.answer[i]);
          cells.push(`${start[0]}, ${start[1]}, ${payload.answer[i]}`);
          start[1]++;
        }
      } else {
        const start = [
          crossBoard1.down[payload.number].row,
          crossBoard1.down[payload.number].col,
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
      socket.emit('correctWord', { direction, number, answer });
      corrects.push(newCorrect);
    }
    window.localStorage.setItem('correctClues', JSON.stringify(corrects));
    // for (let i = 0; i < answer.length; i++) {
    //   crossword.current?.setGuess(start[0], start[1], answer[i])
    //   start[1]++;
    // }
  };

  return (
    <div style={{ height: 200, width: 400 }}>
      <Crossword
        onCorrect={onCorrect}
        onCellChange={onCellChange}
        ref={crossword}
        data={crossBoard1}

        // useStorage={false}
      />
    </div>
  )
}
