import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Video extends Component {

  static propTypes = {
    src: PropTypes.string
  };

  static defaultProps = {
    src: null
  }

  constructor() {
    super();

    this.ref = null;
  }

  componentDidUpdate(prevProps) {
    const { src } = this.props;
    if (src && src !== prevProps.src) {
      this.load(src);
    }
  }

  isPaused = () => this.ref.paused;

  pause = () => {
    this.ref.pause();
  };

  load = (src) => {
    this.ref.src = src;
    this.ref.load();
  };

  play = () => {
    this.ref.play();
  };

  render() {
    const { src, ...props } = this.props;
    return (
      <video
        {...props}
        ref={ref => this.ref = ref}
      />
    );
  }
}

export default Video;