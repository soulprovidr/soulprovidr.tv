import { SELECT_CHANNEL, TOGGLE_MENU } from './actions';

const initialState = {
  channel: null,
  showMenu: true
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SELECT_CHANNEL:
    return {
      ...state,
      channel: action.channel,
      showMenu: false
    };
  case TOGGLE_MENU:
    return !state.showMenu;
  default:
    return state;
  }
};