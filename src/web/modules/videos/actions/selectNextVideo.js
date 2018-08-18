import { nextVideoSelector } from '../selectors';
import selectVideo from './selectVideo';

export default function selectNextVideo() {
  return (dispatch, getState) => {
    const nextVideo = nextVideoSelector(getState());
    return nextVideo
      ? dispatch(selectVideo(nextVideo))
      : false;
  };
}