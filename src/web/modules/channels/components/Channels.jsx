import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  channelsSelector,
  isFetchingSelector,
  selectedChannelSelector
} from '@/channels/selectors';
import Logo from '@/common/components/Logo';
import selectChannel from '../actions/selectChannel';

import '../styles/channels.css';

class Channels extends Component {
  static propTypes = {
    channels: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    selectChannel: PropTypes.func.isRequired,
    selectedChannel: PropTypes.object,
  };

  static defaultProps = {
    selectedChannel: null
  };

  getItemClassName = (channel) => {
    const { selectedChannel } = this.props;
    if (selectedChannel && channel.slug == selectedChannel.slug) {
      return 'selected';
    }
    return '';
  }

  sort = (a, b) => a.slug.localeCompare(b.slug);

  render() {
    const {
      channels,
      selectChannel
    } = this.props;
    return (
      <ol className="channels">
        <Logo />
        <h5>Channel Guide</h5>
        {channels
          .sort(this.sort)
          .map(c => (
            <li
              key={c.slug}
              onClick={() => selectChannel(c)}
              className={this.getItemClassName(c)}
            >
              {c.name}
            </li>
          ))
        }
      </ol>
    );
  }
}


const mapStateToProps = state => ({
  channels: channelsSelector(state),
  isFetching: isFetchingSelector(state),
  selectedChannel: selectedChannelSelector(state)
});

const mapDispatchToProps = {
  selectChannel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels);