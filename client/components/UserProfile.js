import { Card } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Crossword from '@jaredreisinger/react-crossword';

import { fetchUserData } from '../store/crossword';
import GameOver from './GameOver';

const UserProfile = () => {
  const userData = useSelector((state) => state.dataReducer.userProfile);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  console.log(userData);
  return (
    <div>
      <ul>
        {userData.map((game) => {
          return (
            <Card
              key={game.id}
              style={{ border: ' solid', borderColor: 'black' }}
            >
              <div className="user-game">
                <div className="game-stats">
                  <h1>Puzzle: {game.crossword.name}</h1>
                  <h1>Author: {game.crossword.author}</h1>
                  <h1>Difficulty: {game.crossword.difficulty}</h1>
                  <h1>Score: {game.users[0].userGame.score}</h1>
                </div>
                <GameOver
                  data={game.crossword}
                  size={'30vw'}
                  showAnswers={false}
                />
              </div>
            </Card>
          );
        })}
      </ul>
    </div>
  );
};

export default UserProfile;
