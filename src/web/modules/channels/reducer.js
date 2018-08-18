import { ActionTypes } from './constants';

const initialState = {
  isFetching: false,
  items: [],
  selectedChannel: null
};

export default (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.GET_CHANNELS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case ActionTypes.GET_CHANNELS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ActionTypes.GET_CHANNELS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: payload.channels
      };
    case ActionTypes.SELECT_CHANNEL:
      return {
        ...state,
        selectedChannel: payload.channel.slug
      };
    default:
      return state;
  }
};