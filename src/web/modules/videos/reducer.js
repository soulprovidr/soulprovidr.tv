import { ActionTypes } from './constants';

const initialState = {
  items: [],
  selectedVideo: null
};

export default (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.GET_VIDEOS_SUCCESS:
      return {
        ...state,
        items: payload.videos
      };
    case ActionTypes.SELECT_VIDEO:
      return {
        ...state,
        selectedVideo: payload.video.id
      };
    default:
      return state;
  }
};