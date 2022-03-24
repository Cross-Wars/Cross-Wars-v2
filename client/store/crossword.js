import axios from "axios"

const GET_GUESS = "GET_GUESS"
const GET_ALL_CROSSWORD = "GET_ALL_CROSSWORD"

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

export const fetchAllCrossword = (crossworrds) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/crosswords")
      dispatch(getAllCrossword(data))
    } catch (err) {
      console.error(err)
    }
  }
}

let initialState = {
  guess: "",
  allCrossword: {},
}

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GUESS:
      return { ...state, guess: `${action.row} ${action.col} ${action.char}` }

    case GET_ALL_CROSSWORD:
      return { ...state, allCrossword: action.crosswords }
    default:
      return state
  }
}
