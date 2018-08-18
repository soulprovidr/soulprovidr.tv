import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import initialize from '../actions/initialize';

import Channels from '@/channels';
import Logo from '@/common/components/Logo';
import Player from '@/videos/components/Player';

import '../styles/app.css';

class App extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      isChannelsHidden: false
    };

    this.hideChannelsTimeout = null;
  }

  async componentDidMount() {
    await this.props.initialize();
    this.scheduleHideChannels();
  }

  scheduleHideChannels = (timeout = 2000) => {
    clearTimeout(this.hideChannelsTimeout);
    this.hideChannelsTimeout = setTimeout(() => this.setState({ isChannelsHidden: true }), timeout);
  };

  showChannels = () => {
    const { isChannelsHidden } = this.state;
    if (isChannelsHidden) {
      this.setState({ isChannelsHidden: !isChannelsHidden });
    }
    this.scheduleHideChannels(1500);
  }

  render() {
    const { isChannelsHidden } = this.state;
    return (
      <main onMouseMove={this.showChannels}>
        <Channels isHidden={isChannelsHidden} />
        <Player />
        <Logo />
      </main>
    );
  }
}

const mapDispatchToProps = {
  initialize
};

export default connect(
  null,
  mapDispatchToProps
)(App);