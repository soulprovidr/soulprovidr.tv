import axios from 'axios';
import { Urls } from '~/constants';

export const ActionTypes = {
  GET_VIDEOS_FAILURE: 'app/GET_VIDEOS_FAILURE',
  GET_VIDEOS_REQUEST: 'app/GET_VIDEOS_REQUEST',
  GET_VIDEOS_SUCCESS: 'app/GET_VIDEOS_SUCCESS'
};

/*******************************************************************/

function getVideosFailure(e) {
  return {
    type: ActionTypes.GET_VIDEOS_FAILURE,
    payload: e
  };
}

function getVideosRequest() {
  return {
    type: ActionTypes.GET_VIDEOS_REQUEST
  };
}

function getVideosSuccess(channels) {
  return {
    type: ActionTypes.GET_VIDEOS_SUCCESS,
    payload: channels
  };
}


export function getVideos(slug = null) {
  return async (dispatch) => {
    dispatch(getVideosRequest());
    try {
      const { data } = await axios.get(Urls.VIDEOS, {
        params: { channel: slug }
      });
      dispatch(getVideosSuccess(data));
      return data;
    } catch (e) {
      dispatch(getVideosFailure(e));
      throw e;
    }
  };
}