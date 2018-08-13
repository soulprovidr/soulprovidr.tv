import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ onClick }) => {
  return (
    <img
      className="player__logo"
      onClick={onClick}
      src="/img/soulprovidr-tv.png"
    />
  );
};

Logo.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default Logo;