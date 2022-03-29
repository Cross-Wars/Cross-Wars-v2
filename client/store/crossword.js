import axios from 'axios';

//---------ACTION CONSTANTS
const GET_GUESS = 'GET_GUESS';
const GET_ALL_CROSSWORD = 'GET_ALL_CROSSWORD';
const GET_CROSSWORDS_BY_YEAR = 'GET_CROSSWORDS_BY_YEAR';

//---------ACTION CREATORS
export const getGuess = (row, col, char) => {
  return {
    type: GET_GUESS,
    row,
    col,
    char,
  };
};
export const getAllCrossword = (crosswords) => {
  return {
    type: GET_ALL_CROSSWORD,
    crosswords,
  };
};

export const getCrosswordsByYear = (crosswords) => {
  return {
    type: GET_CROSSWORDS_BY_YEAR,
    crosswords,
  };
};

//---------THUNKS
export const fetchAllCrossword = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('/api/crosswords');
      dispatch(getAllCrossword(data));
    } catch (err) {
      console.error(err);
    }
  };
};

export const fetchCrosswordsByYear = (year) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/crosswords/${year}`);
      dispatch(getCrosswordsByYear(data));
    } catch (err) {
      console.error(err);
    }
  };
};

//---------REDUCER

let initialState = {
  guess: '',
  allCrossword: [],
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GUESS:
      return { ...state, guess: `${action.row} ${action.col} ${action.char}` };
    case GET_ALL_CROSSWORD:
      return { ...state, allCrossword: action.crosswords };
    case GET_CROSSWORDS_BY_YEAR:
      return { ...state, allCrossword: action.crosswords };
    default:
      return state;
  }
};
