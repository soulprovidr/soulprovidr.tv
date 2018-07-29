import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectChannel } from '~/actions';
import Channel from './channel/Channel';
import Menu from './menu/Menu';

import './app.css';

class App extends Component {
  render() {
    const { channel, onChannelSelect, showMenu } = this.props;
    return (
      <main>
        <Menu
          isOpen={showMenu}
          onSelect={onChannelSelect}
          selectedChannel={channel}
        />
        <Channel
          channel={channel}
          isOpen={!showMenu}
        />
      </main>
    );
  }
}

App.propTypes = {
  channel: PropTypes.object,
  onChannelSelect: PropTypes.func.isRequired,
  showMenu: PropTypes.bool.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChannelSelect: (channel) => dispatch(selectChannel(channel))
  };
};

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
    showMenu: state.showMenu
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);