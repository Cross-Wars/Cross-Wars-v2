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
  const guess = useSelector((state) => state.dataReducer.guess)
  const crosswords = useSelector((state) => state.dataReducer.allCrossword)

  //const crossword = useRef < CrosswordImperative > null
  const crossword = useRef(null)

  useEffect(() => {
    dispatch(fetchAllCrossword())
    socket.on("crosswar", (payload) => {
      store.dispatch(getGuess(payload.row, payload.col, payload.char))
    })
  }, [])

  console.log(crosswords)

  useEffect(() => {
    if (guess === "") {
      return
    }
    let arr = guess.split(" ")

    const [row, col, char] = arr
    crossword.current?.setGuess(+row, +col, char)
  }, [guess])

  const onCellChange = (row, col, char) => {
    socket.emit("guess", { row, col, char })
    console.log(row, col, char)
  }

  return (
    <div style={{ height: 200, width: 400 }}>
      <Crossword
        onCellChange={onCellChange}
        ref={crossword}
        data={crossBoard1}

        // useStorage={false}
      />
    </div>
  )
}
