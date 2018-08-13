import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Player from '@/player';

import '../app.css';

class App extends Component {
  render() {
    return (
      <main>
        <Player />
      </main>
    );
  }
}

App.propTypes = {};

const mapDispatchToProps = (dispatch) => {
  return null;
};

const mapStateToProps = (state) => {
  return null;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);