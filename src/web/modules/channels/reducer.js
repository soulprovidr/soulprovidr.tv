import { ActionTypes } from './actions';

const initialState = {
  isFetching: false,
  items: []
};

export default (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.GET_CHANNELS_LIST_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case ActionTypes.GET_CHANNELS_LIST_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ActionTypes.GET_CHANNELS_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: payload
      };
    default:
      return state;
  }
};