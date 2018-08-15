import { getChannels } from '@/channels/actions';
import { getVideos } from '@/videos/actions';

export const ActionTypes = {
  INITIALIZE: 'app/INITIALIZE',
  PREVIEW_CHANNEL: 'app/PREVIEW_CHANNEL',
  SELECT_CHANNEL: 'app/SELECT_CHANNEL'
};

/**
 * Fetch list of channels, then fetch videos for a random one.
 *
 * @export
 * @returns
 */
export function initialize() {
  return async (dispatch) => {
    const channels = await dispatch(getChannels());
    const r = Math.round(Math.random() * channels.length);
    await dispatch(getVideos(channels[r].slug));
    return { type: ActionTypes.INITIALIZE };
  };
}

/*******************************************************************/

export function previewChannel(slug) {
  return {
    type: ActionTypes.PREVIEW_CHANNEL,
    payload: slug
  };
}

/*******************************************************************/

export function selectChannel(slug) {
  return {
    type: ActionTypes.SELECT_CHANNEL,
    payload: slug
  };
}