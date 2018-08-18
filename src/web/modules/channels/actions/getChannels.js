import axios from 'axios';
import { Urls } from '~/constants';

import { ActionTypes } from '../constants';

function getChannelsFailure(e) {
  return {
    type: ActionTypes.GET_CHANNELS_FAILURE,
    payload: e
  };
}

function getChannelsRequest() {
  return {
    type: ActionTypes.GET_CHANNELS_REQUEST
  };
}

function getChannelsSuccess(channels) {
  return {
    type: ActionTypes.GET_CHANNELS_SUCCESS,
    payload: { channels }
  };
}

export default () => {
  return async (dispatch) => {
    dispatch(getChannelsRequest());
    try {
      const { data } = await axios.get(Urls.CHANNELS);
      dispatch(getChannelsSuccess(data));
      return data;
    } catch (e) {
      dispatch(getChannelsFailure(e));
      throw e;
    }
  };
};