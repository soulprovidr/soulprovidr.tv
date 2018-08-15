import axios from 'axios';
import { Urls } from '~/constants';

export const ActionTypes = {
  GET_CHANNELS_FAILURE: 'channels/GET_CHANNELS_FAILURE',
  GET_CHANNELS_REQUEST: 'channels/GET_CHANNELS_REQUEST',
  GET_CHANNELS_SUCCESS: 'channels/GET_CHANNELS_SUCCESS'
};

/*******************************************************************/

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
    payload: channels
  };
}

export function getChannels() {
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
}