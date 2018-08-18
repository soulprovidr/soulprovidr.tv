import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import initialize from '../actions/initialize';

import Channels from '@/channels';
import Logo from '@/common/components/Logo';
import Player from '@/videos/components/Player';

import '../styles/app.css';

class App extends Component {
  componentDidMount() {
    this.props.initialize();
  }

  render() {
    return (
      <main>
        <Channels />
        <Player />
        <Logo />
      </main>
    );
  }
}

App.propTypes = {
  initialize: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  initialize
};

export default connect(
  null,
  mapDispatchToProps
)(App);