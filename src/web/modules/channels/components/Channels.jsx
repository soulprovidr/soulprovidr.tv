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
    isHidden: PropTypes.bool.isRequired,
    selectChannel: PropTypes.func.isRequired,
    selectedChannel: PropTypes.object,
  };

  static defaultProps = {
    selectedChannel: null
  };

  getContainerClassName = () => {
    const { isHidden } = this.props;
    return isHidden ? 'channels hidden' : 'channels';
  };

  getItemClassName = (channel) => {
    const { selectedChannel } = this.props;
    if (selectedChannel && channel.slug == selectedChannel.slug) {
      return 'selected';
    }
    return '';
  };

  sortItems = (a, b) => a.slug.localeCompare(b.slug);

  render() {
    const {
      channels,
      selectChannel
    } = this.props;
    const className = this.getContainerClassName();
    return (
      <ol className={className}>
        <li>
          <Logo />
        </li>
        {channels
          .sort(this.sortItems)
          .map((c, i) => (
            <li
              key={c.slug}
              onClick={() => selectChannel(c)}
              className={this.getItemClassName(c)}
            >
              <h5>{i+1}. {c.name}</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu sem venenatis, ultricies felis at, suscipit purus. Quisque id odio arcu. Praesent eget metus a dolor tempor vulputate.</p>
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