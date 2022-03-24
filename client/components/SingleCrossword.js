import React, { useRef, useCallback, useState, useEffect } from 'react';
import { crossBoard1 } from './crossWord';
import { getGuess } from '../store/crossword';
import store from '../store';

import Crossword, {
  CrosswordImperative,
  CrosswordProvider,
} from '@jaredreisinger/react-crossword';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import socket from './socket';
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
  const guess = useSelector((state) => state.dataReducer);

  //const crossword = useRef < CrosswordImperative > null
  const crossword = useRef(null);

  useEffect(() => {
    // socket.on('crosswar', (payload) => {
    //   store.dispatch(getGuess(payload.row, payload.col, payload.char));
    // });

    socket.on('newWord', (payload) => {
      if (payload.direction === 'across') {
        const start = [
          crossBoard1.across[payload.number].row,
          crossBoard1.across[payload.number].col,
        ];
        for (let i = 0; i < payload.answer.length; i++) {
          crossword.current?.setGuess(start[0], start[1], payload.answer[i]);
          start[1]++;
        }
      } else {
        const start = [
          crossBoard1.down[payload.number].row,
          crossBoard1.down[payload.number].col,
        ];
        for (let i = 0; i < payload.answer.length; i++) {
          crossword.current?.setGuess(start[0], start[1], payload.answer[i]);
          start[0]++;
        }
      }
    });
  }, []);

  useEffect(() => {
    if (guess === '') {
      return;
    }
    let arr = guess.split(' ');

    const [row, col, char] = arr;
    crossword.current?.setGuess(+row, +col, char);
  }, [guess]);

  const onCellChange = (row, col, char) => {
    socket.emit('guess', { row, col, char });
    console.log(row, col, char);
  };

  const onCorrect = (direction, number, answer) => {
    console.log('CORRECT');
    socket.emit('correctWord', { direction, number, answer });
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
  );
}
