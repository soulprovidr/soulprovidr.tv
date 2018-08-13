import axios from 'axios';
import { Urls } from '~/constants';

export async function initialize() {
  const videos = await axios.get(Urls.VIDEOS);
  return videos;
}