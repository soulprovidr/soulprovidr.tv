import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ onClick }) => {
  return (
    <img
      className="logo"
      onClick={onClick}
      src="/img/soulprovidr-tv.png"
    />
  );
};

Logo.propTypes = {
  onClick: PropTypes.func
};

export default Logo;