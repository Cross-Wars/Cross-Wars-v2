import { Card } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Crossword from "@jaredreisinger/react-crossword"

import { fetchUserData } from "../store/crossword"

const UserProfile = () => {
  const userData = useSelector((state) => state.dataReducer.userProfile)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserData())
  }, [])

  console.log(userData)
  return (
    <div>
      <ol>
        {userData.map((game) => {
          return (
            <Card style={{ border: " solid", borderColor: "black" }}>
              <div key={game.id}>
                <h1>GameNo: {game.users[0].userGame.gameId}</h1>
                <h1>CrosswordName: {game.crossword.name}</h1>
                <h1>Difficulty: {game.crossword.difficulty}</h1>
                <h1>CrosswordAuthor: {game.crossword.author}</h1>
                <h1>Score:{game.users[0].userGame.score}</h1>
                {/* 
                <Crossword data={game.crossword.data} /> */}

                {/* <h1>{game.gameId}</h1>
              <h2>{game.score}</h2> */}
              </div>
            </Card>
          )
        })}
      </ol>
    </div>
  )
}

export default UserProfile
