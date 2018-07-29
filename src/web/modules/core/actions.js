export const SELECT_CHANNEL = 'SELECT_CHANNEL';
export const TOGGLE_MENU = 'TOGGLE_MENU';

export function selectChannel(channel) {
  return { type: SELECT_CHANNEL, channel };
}

export function toggleMenu() {
  return { type: TOGGLE_MENU };
}