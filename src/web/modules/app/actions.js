import axios from 'axios';
import { Urls } from '~/constants';
import { Action } from 'rxjs/scheduler/Action';

export const ActionTypes = {
  GET_CHANNELS_FAILURE: 'app/GET_CHANNELS_FAILURE',
  GET_CHANNELS_REQUEST: 'app/GET_CHANNELS_REQUEST',
  GET_CHANNELS_SUCCESS: 'app/GET_CHANNELS_SUCCESS'
};

function getChannelsRequest() {
  return {
    type: ActionTypes.GET_CHANNELS_REQUEST
  };
}

function getChannelsSuccess(channels) {
  return {
    type: Action.GET_CHANNELS_SUCCESS
  };
}

export async function initialize() {
  const videos = await axios.get(Urls.VIDEOS);
  return videos;
}