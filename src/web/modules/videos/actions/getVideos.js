import axios from 'axios';
import { batchActions } from 'redux-batch-enhancer';
import { ActionTypes } from '../constants';
import { Urls } from '~/constants';
import shuffle from '~/helpers/shuffle';

import selectVideo from './selectVideo';

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

function getVideosSuccess(videos) {
  return {
    type: ActionTypes.GET_VIDEOS_SUCCESS,
    payload: { videos }
  };
}

export default (slug = null) => {
  return async (dispatch) => {
    dispatch(getVideosRequest());
    try {
      let { data: videos } = await axios.get(Urls.VIDEOS, {
        params: { channel: slug }
      });
      videos = shuffle(videos);
      dispatch(
        batchActions([
          getVideosSuccess(videos),
          selectVideo(videos[0])
        ])
      );
      return videos;
    } catch (e) {
      dispatch(getVideosFailure(e));
      throw e;
    }
  };
};