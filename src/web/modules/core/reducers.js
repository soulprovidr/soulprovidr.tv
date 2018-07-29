import { SELECT_CHANNEL, TOGGLE_MENU } from './actions';

const INITIAL_STATE = {
  channel: null,
  showMenu: true
};

export default function core(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SELECT_CHANNEL:
    return Object.assign({}, {
      channel: action.channel,
      showMenu: false
    });
  case TOGGLE_MENU:
    return !state.showMenu;
  default:
    return state;
  }
}