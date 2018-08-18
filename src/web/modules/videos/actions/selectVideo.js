import { ActionTypes } from '../constants';

export default (video) => {
  return {
    type: ActionTypes.SELECT_VIDEO,
    payload: { video }
  };
};