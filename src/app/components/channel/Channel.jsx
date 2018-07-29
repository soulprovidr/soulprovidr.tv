import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import classnames from 'classnames';

import { toggleMenu } from '~/actions';

import Loading from './Loading';
import Logo from './Logo';
import Overlay from './Overlay';

import './channel.css';

class Channel extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      overlay: false
    };

    this.overlayTimeout = null;
    this.video = null;

    this.loadChannel = this.loadChannel.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.showOverlay = this.showOverlay.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Load new channel data
    if (prevProps.channel !== this.props.channel) {
      this.loadChannel(this.props.channel);
    }

    if (prevProps.isOpen !== this.props.isOpen && !!prevProps.channel) {
      this.showOverlay(5000);
    }
  }

  /**
   * Begin playing the specified channel.
   *
   * @param {*} channel
   * @memberof Channel
   */
  loadChannel(channel) {
    this.setState({
      isLoading: true,
      overlay: false
    });
    this.video.src = '';
    this.video.load();
    setTimeout(() => {
      this.video.src = channel.metadata.src;
      this.video.load();
    }, 1000);
  }

  /**
   * Display the overlay after the channel starts playing.
   *
   * @memberof Channel
   */
  onLoad() {
    this.setState({ isLoading: false }, () => this.showOverlay(5000));
  }

  onClick() {
    if (this.video.paused) {
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
    const { channel, isOpen, onClickLogo } = this.props;
    const { isLoading, overlay } = this.state;
    return (
      <div className={classnames({
        channel: true,
        'is-open': isOpen
      })}>

        <Logo
          key="logo"
          onClickLogo={onClickLogo}
        />

        {channel && [

          <Loading
            key="loading"
            visible={isLoading}
          />,

          <Overlay
            channel={channel}
            key="overlay"
            onClick={this.onClick}
            onMouseMove={this.showOverlay}
            visible={overlay}
          />,

          <video
            className="channel__video"
            key="video"
            playsInline
            autoPlay
            loop
            onLoadedData={this.onLoad}
            ref={(video) => this.video = video}
          />

        ]}

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
  return {
    onClickLogo: () => dispatch(toggleMenu())
  };
};

export default connect(
  mapDispatchToProps
)(Channel);