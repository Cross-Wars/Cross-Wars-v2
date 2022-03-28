import React, { useEffect, useState } from "react"
import socket from "./socket"

export default function Clues() {
  const selectedPuzzle = JSON.parse(window.localStorage.getItem("puzzle"))
  const puzzleData = JSON.parse(selectedPuzzle.data)

  let acrossLength = Object.keys(puzzleData.across).length
  let downLength = Object.keys(puzzleData.down).length

  const [across, setAcross] = useState(acrossLength)
  const [down, setDown] = useState(downLength)
  const [clues, setClues] = useState(acrossLength + downLength)
  let count = 0

  useEffect(() => {
    socket.on("newWord", (payload) => {
      count++
      setClues(clues - count)
    })
  }, [])

  return (
    <div>
      <h2> Words Remaining:{clues}</h2>
    </div>
  )
}
