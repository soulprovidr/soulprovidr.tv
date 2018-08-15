import { ActionTypes } from './actions';

const initialState = [];

export default (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.GET_VIDEOS_SUCCESS:
      return {
        ...state,
        items: [...state.items, payload]
      };
    default:
      return state;
  }
};