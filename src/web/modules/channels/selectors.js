export const channelsSelector = state => state.channels.items;
export const isFetchingSelector = state => state.channels.isFetching;
export const selectedChannelSelector = state => (
  state.channels.items.find(
    c => c.slug == state.channels.selectedChannel
  ) || null
);