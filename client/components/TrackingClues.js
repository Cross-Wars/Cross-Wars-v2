import React, { useEffect, useState } from "react"
import socket from "./socket"

export default function Clues() {
  const selectedPuzzle = JSON.parse(window.localStorage.getItem("puzzle"))
  const puzzleData = JSON.parse(selectedPuzzle.data)

  let acrossLength = Object.keys(puzzleData.across).length
  let downLength = Object.keys(puzzleData.down).length
  const [across, setAcross] = useState(acrossLength)
  const [down, setDown] = useState(downLength)

  useEffect(() => {
    socket.on("newWord", (payload) => {
      if (payload.direction === "across") {
        setAcross(across - 1)
      } else {
        setDown(down - 1)
      }
    })
  }, [
    socket.on("newWord", (payload) => {
      if (payload.direction === "across") {
        setAcross(across - 1)
      } else {
        setDown(down - 1)
      }
    }),
  ])

  return (
    <div>
      {/* <h2>Across :{across}</h2>
      <h2>Down :{down}</h2> */}
      <h2> Words Remaining:{across + down}</h2>
    </div>
  )
}
