import { createSelector } from 'reselect';
import { selectedChannelSelector } from '@/channels/selectors';

export const videosSelector = state => state.videos.items;

export const selectedChannelVideosSelector = createSelector(
  videosSelector,
  selectedChannelSelector,
  (videos, selectedChannel) => selectedChannel
    ? videos.filter(v => selectedChannel.videos.includes(v.id))
    : []
);

export const selectedVideoSelector = state => {
  if (state.videos.selectedVideo) {
    return state.videos.items.find(
      v => v.id == state.videos.selectedVideo
    ) || null;
  }
};

export const nextVideoSelector = state => {
  const { items, selectedVideo } = state.videos;
  if (!selectedVideo || !items.length) {
    return null;
  }
  const i = items.findIndex(v => v.id == selectedVideo);
  let nextIndex = 0;
  if (i < items.length - 1) {
    nextIndex = i + 1;
  }
  return items[nextIndex];
};