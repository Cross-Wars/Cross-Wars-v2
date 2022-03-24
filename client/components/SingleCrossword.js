import React, { useRef, useCallback, useState, useEffect } from "react";
import { getGuess, fetchAllCrossword } from "../store/crossword";
import store from "../store";

import Crossword, {
  CrosswordImperative,
  CrosswordProvider,
} from "@jaredreisinger/react-crossword";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import socket from "./socket";
//import { RootState } from "../store"

// console.log(puzzleData)
//console.log(CrosswordProvider.defaultProps?.theme?.focusBackground)
// console.log(Crossword)
// console.log(puzzleData.across[1].answer)

// socket.on("connect", () => {
//   console.log("connected to server")
//   socket.on("crosswar", (payload) => {
//     store.dispatch(getGuess(payload.row, payload.col, payload.char))
//   })
// })

export default function MyPage() {
  const [time, setTime] = useState(600);
  const dispatch = useDispatch();
  const crosswords = useSelector((state) => state.dataReducer.allCrossword);

  //const crossword = useRef < CrosswordImperative > null
  const crossword = useRef(null);
  const selectedPuzzle = JSON.parse(window.localStorage.getItem("puzzle"));
  const puzzleData = JSON.parse(selectedPuzzle.data)


  useEffect(() => {
    if (time < 1) {
      console.log('GAME OVER');
    }
  }, [time]);

  useEffect(() => {
    dispatch(fetchAllCrossword());

    // socket.on('crosswar', (payload) => {
    //   store.dispatch(getGuess(payload.row, payload.col, payload.char));
    // });

    if (!window.localStorage.getItem('correctClues')) {
      window.localStorage.setItem('correctClues', '[]');
    }
    if (!window.localStorage.getItem('correctCells')) {
      window.localStorage.setItem('correctCells', '[]');
    }

    socket.emit('timer-start', 10);

    socket.on('tick', (payload) => {
      setTime(payload);
    });

    setInterval(() => {
      const corrects = JSON.parse(window.localStorage.getItem('correctClues'));
      console.log(
        corrects.length,
        ' vs ',
        [...Object.keys(puzzleData.across)].length +
          [...Object.keys(puzzleData.down)].length
      );
      if (
        corrects.length >=
        [...Object.keys(puzzleData.across)].length +
          [...Object.keys(puzzleData.down)].length
      ) {
        console.log('DONE');
      }
    }, 1000);

    socket.on("newWord", (payload) => {
      const corrects = JSON.parse(window.localStorage.getItem("correctClues"));
      const newCorrect = `${payload.number} ${payload.direction}`;
      const cells = JSON.parse(window.localStorage.getItem("correctCells"));
      if (!corrects.includes(newCorrect)) {
        corrects.push(newCorrect);
        window.localStorage.setItem("correctClues", JSON.stringify(corrects));
      }
      if (payload.direction === "across") {
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
      window.localStorage.setItem("correctCells", JSON.stringify(cells));
    });
  }, []);

  const onCellChange = (row, col, char) => {
    console.log(row, col, char);
    const cells = JSON.parse(window.localStorage.getItem("correctCells"));
    if (
      cells.some(
        (cell) => cell.split(", ").slice(0, 2).join(", ") === `${row}, ${col}`
      )
    ) {
      console.log("ALREADY CORRECT");
      const correctLetter = cells
        .find(
          (cell) => cell.split(", ").slice(0, 2).join(", ") === `${row}, ${col}`
        )
        .split(", ")
        .slice(2)
        .join("");
      console.log(correctLetter);
      if (char !== correctLetter) {
        setTimeout(() => {
          crossword.current?.setGuess(row, col, correctLetter);
        }, 10);
      }
    }
  };

  const onCorrect = (direction, number, answer) => {
    const corrects = JSON.parse(window.localStorage.getItem("correctClues"));
    const newCorrect = `${number} ${direction}`;
    if (!corrects.includes(newCorrect)) {
      console.log("CORRECT");
      socket.emit("correctWord", { direction, number, answer });
      corrects.push(newCorrect);
    }
    window.localStorage.setItem("correctClues", JSON.stringify(corrects));
    // for (let i = 0; i < answer.length; i++) {
    //   crossword.current?.setGuess(start[0], start[1], answer[i])
    //   start[1]++;
    // }
  };
  return (
    <div>
      <h2>
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
      </h2>
      <div style={{ height: 200, width: 400 }}>
        <Crossword
          onCorrect={onCorrect}
          onCellChange={onCellChange}
          ref={crossword}
          data={puzzleData}

          // useStorage={false}
        />
      </div>
    </div>
  );
}
