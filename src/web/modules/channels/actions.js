import axios from 'axios';
import { Urls } from '~/constants';

export const ActionTypes = {
  GET_CHANNELS_FAILURE: 'app/GET_CHANNELS_FAILURE',
  GET_CHANNELS_REQUEST: 'app/GET_CHANNELS_REQUEST',
  GET_CHANNELS_SUCCESS: 'app/GET_CHANNELS_SUCCESS',
  PREVIEW_CHANNEL: 'app/PREVIEW_CHANNEL',
  SELECT_CHANNEL: 'app/SELECT_CHANNEL'
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

/*******************************************************************/

export function previewChannel(channel) {
  return {
    type: ActionTypes.PREVIEW_CHANNEL,
    payload: channel
  };
}

/*******************************************************************/

export function selectChannel(channel) {
  return {
    type: ActionTypes.SELECT_CHANNEL,
    payload: channel
  };
}