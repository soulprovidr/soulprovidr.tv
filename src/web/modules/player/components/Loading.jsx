import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ visible }) => {
  return visible ? (
    <div className="channel__loading">
      <span>BUFFERING...</span>
    </div>
  ) : null;
};

Loading.propTypes = {
  visible: PropTypes.bool.isRequired
};

export default Loading;