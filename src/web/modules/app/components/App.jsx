import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getChannels, previewChannel } from '@/channels/actions';
import { getVideos } from '@/videos/actions';

import Logo from './Logo';
import Player from '@/player';

import '../app.css';

class App extends Component {
  componentDidMount() {
    this.initialize();
  }

  /**
   * Fetch list of channels + choose a random one to preview,
   * TODO: Allow linking to channels directly.
   *
   * @memberof App
   */
  async initialize() {
    const channels = await this.props.getChannels();
    const r = Math.round(Math.random() * channels.length);
    await this.props.getVideos(channels[r].slug);
    this.props.previewChannel(channels[r]);
  }

  render() {
    return (
      <main>
        <Player />
        <Logo />
      </main>
    );
  }
}

App.propTypes = {
  getChannels: PropTypes.func.isRequired,
  getVideos: PropTypes.func.isRequired,
  previewChannel: PropTypes.func.isRequired
};

export default connect(null, {
  getChannels,
  getVideos,
  previewChannel
})(App);