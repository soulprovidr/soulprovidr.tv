import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import MenuItem from './MenuItem';

import './menu.css';

class Menu extends Component {

  constructor() {
    super();

    this.state = {
      channels: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.getChannels().then(channels => (
      this.setState({
        channels,
        isLoading: false
      })
    ));
  }

  getChannels() {
    return new Promise((resolve) => {
      const channels = [];
      setTimeout(() => resolve(channels), 500);
    });
  }

  render() {
    const { onSelect, selectedChannel } = this.props;
    const { channels, isLoading } = this.state;
    const _channels = [].concat(channels, channels, channels);
    return (
      <div className="menu">
        {isLoading && <p className="text-white m-0 d-inline-block mx-auto">
          {isLoading ? 'Loading channels...' : ''}
        </p>}
        <div className="d-flex h-100">
          {_channels.map((c, i) => (
            <MenuItem
              active={(c == selectedChannel) || (!selectedChannel && (i == 0))}
              key={c.title}
              channel={c}
              index={i}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedChannel: PropTypes.object
};

export default Menu;