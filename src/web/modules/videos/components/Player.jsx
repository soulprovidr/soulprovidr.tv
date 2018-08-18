import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { __VIDEOS_URL__ } from '~/constants';
import { selectedChannelSelector } from '@/channels/selectors';
import {
  nextVideoSelector,
  selectedChannelVideosSelector,
  selectedVideoSelector
} from '../selectors';

import selectNextVideo from '../actions/selectNextVideo';

import Video from './Video';

import '../styles/player.css';

class Player extends Component {
  static propTypes = {
    nextVideo: PropTypes.object,
    selectedChannel: PropTypes.object,
    selectedChannelVideos: PropTypes.array.isRequired,
    selectedVideo: PropTypes.object,
    selectNextVideo: PropTypes.func.isRequired
  };

  static defaultProps = {
    nextVideo: null,
    selectedChannel: null,
    selectedVideo: null
  };

  constructor() {
    super();

    this.state = {
      isLoading: false
    };

    this.video = null;
  }

  getSelectedVideoSrc = () => {
    const { selectedVideo } = this.props;
    if (selectedVideo) {
      return `${__VIDEOS_URL__}/${selectedVideo.id}.mp4`;
    }
  };

  /**
   * Play the next video when this one ends.
   *
   * @memberof Player
   */
  onEnded = () => {
    const { selectNextVideo } = this.props;
    selectNextVideo();
  };

  onLoadedData = () => {
    this.setState({ isLoading: false });
  };

  onVideoClick = () => {
    if (this.video && this.video.isPaused()) {
      this.video.play();
    } else {
      this.video.pause();
    }
  };

  render() {
    const videoSrc = this.getSelectedVideoSrc();
    return (
      <div className="player">
        <Video
          className="player__video"
          playsInline
          autoPlay
          loop
          onClick={this.onVideoClick}
          onLoadedData={this.onLoadedData}
          ref={ref => this.video = ref}
          src={videoSrc}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  nextVideo: nextVideoSelector(state),
  selectedChannel: selectedChannelSelector(state),
  selectedChannelVideos: selectedChannelVideosSelector(state),
  selectedVideo: selectedVideoSelector(state)
});

const mapDispatchToProps = {
  selectNextVideo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);