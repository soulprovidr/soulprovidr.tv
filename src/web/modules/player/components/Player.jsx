import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 

import Logo from './Logo';

import '../player.css';

class Channel extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
    };

    this.video = null;

    this.onClick = this.onClick.bind(this);
  }

  componentDidUpdate(prevProps) {
  }

  /**
   * Begin playing the specified channel.
   *
   * @param {*} channel
   * @memberof Channel
   */
  loadChannel(channel) {
  }

  /**
   * Display the overlay after the channel starts playing.
   *
   * @memberof Channel
   */
  onLoad() {

  }

  onClick() {
    if (this.video && this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  /**
   * Display the overlay & schedule its removal.
   *
   * @memberof Channel
   */
  showOverlay() {
    if (!this.state.overlay) {
      this.setState({ overlay: true });
    }
    clearTimeout(this.overlayTimeout);
    this.overlayTimeout = setTimeout(() => this.setState({ overlay: false }), 3000);
  }

  render() {
    const { isLoading, overlay } = this.state;
    return (
      <div className="player">

        <Logo />

        {/* <video
          className="channel__video"
          key="video"
          playsInline
          autoPlay
          loop
          onLoadedData={this.onLoad}
          ref={(video) => this.video = video}
        /> */}


      </div>
    );
  }
}

Channel.propTypes = {
  channel: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClickLogo: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return null;
};

export default connect(
  mapDispatchToProps
)(Channel);