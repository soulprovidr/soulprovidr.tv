import { ActionTypes } from '../constants';
import { batchActions } from 'redux-batch-enhancer';
import getVideos from '@/videos/actions/getVideos';

export default (channel) => {
  return (dispatch) => {
    return dispatch(
      batchActions([
        {
          type: ActionTypes.SELECT_CHANNEL,
          payload: { channel }
        },
        getVideos(channel.slug)
      ])
    );
  };
};