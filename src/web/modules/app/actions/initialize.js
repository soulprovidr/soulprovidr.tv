import { ActionTypes } from '../constants';
import { batchActions } from 'redux-batch-enhancer';
import getChannels from '@/channels/actions/getChannels';
import selectChannel from '@/channels/actions/selectChannel';
import getVideos from '@/videos/actions/getVideos';

/**
 * Select a random channel.
 *
 * @export
 * @returns {Object}
 */
export default () => {
  return async (dispatch) => {
    const channels = await dispatch(getChannels());
    const randomChannel = channels[Math.round(Math.random() * channels.length)];
    await dispatch(getVideos(randomChannel.slug));
    return dispatch(
      batchActions([
        { type: ActionTypes.INITIALIZE },
        selectChannel(randomChannel)
      ])
    );
  };
};