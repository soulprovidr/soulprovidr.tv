import { ActionTypes } from './constants';

const initialState = {
  initialized: false
};

export default (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case ActionTypes.INITIALIZE:
      return {
        ...state,
        initialized: true
      };
    default:
      return state;
  }
};