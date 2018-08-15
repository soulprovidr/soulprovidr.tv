import { ActionTypes } from './actions';

const initialState = {
  initialized: false
};

export default (state = initialState, action) => {
  const { payload, type } = action;
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