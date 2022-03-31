import axios from "axios"
import history from "../history"

const GET_GUESS = "GET_GUESS"
const GET_ALL_CROSSWORD = "GET_ALL_CROSSWORD"
const UPDATE_GAME = "UPDATE_GAME"
const COMPLETE_GAME = "COMPLETE_GAME"
const GET_USERPROFILE = "GET_USERPROFILE"

export const getGuess = (row, col, char) => {
  return {
    type: GET_GUESS,
    row,
    col,
    char,
  }
}
export const getAllCrossword = (crosswords) => {
  return {
    type: GET_ALL_CROSSWORD,
    crosswords,
  }
}

export const updateGame = (game) => {
  return {
    type: UPDATE_GAME,
    game,
  }
}

export const completeGame = (game) => {
  return {
    type: COMPLETE_GAME,
    game,
  }
}

export const getUserData = (userData) => {
  return {
    type: GET_USERPROFILE,
    userData,
  }
}

export const fetchAllCrossword = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/crosswords")
      dispatch(getAllCrossword(data))
    } catch (err) {
      console.error(err)
    }
  }
}

export const createGame = (crosswordId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`/api/game/${crosswordId}`)
      dispatch(updateGame(data))
    } catch (err) {
      console.error(err)
    }
  }
}

export const updateGameComplete = (gameId, score) => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem("token")
      if (token) {
        const { data } = await axios.put(`/api/game/${gameId}`, score, {
          headers: {
            authorization: token,
          },
        })
        dispatch(completeGame(data))
      }
    } catch (err) {
      console.log(err)
    }
  }
}
export const fetchUserData = () => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem("token")
      if (token) {
        const { data } = await axios.get("/api/game/userprofile", {
          headers: {
            authorization: token,
          },
        })
        dispatch(getUserData(data))
      }
    } catch (err) {
      console.error(err)
    }
  }
}

let initialState = {
  guess: "",
  allCrossword: [],
  game: {},
  userGame: {},
  userProfile: [],
}

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GUESS:
      return { ...state, guess: `${action.row} ${action.col} ${action.char}` }

    case GET_ALL_CROSSWORD:
      return { ...state, allCrossword: action.crosswords }

    case UPDATE_GAME:
      return { ...state, game: action.game }

    case COMPLETE_GAME:
      return { ...state, userGame: action.game }
    case GET_USERPROFILE:
      return { ...state, userProfile: action.userData }
    default:
      return state
  }
}
