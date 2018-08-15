import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { initialize } from '../actions';

import Logo from './Logo';
import Player from '@/player';

import '../app.css';

class App extends Component {
  componentDidMount() {
    this.props.initialize();
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
  initialize: PropTypes.func.isRequired
};

export default connect(null, {
  initialize
})(App);