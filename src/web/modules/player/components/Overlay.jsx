import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Overlay = ({ channel, onClick, onMouseMove, visible }) => {
  return (
    <div
      className="channel__overlay overlay"
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      <div className={
        classnames({
          overlay__metadata: true,
          hidden: !visible
        })
      }>
        <span style={{
          display: 'block'
        }}>
          <strong>{channel.metadata.artist} - {channel.metadata.title}</strong>
        </span>
        <span style={{
          display: 'inline',
          fontSize: '18px',
          padding: '3px'
        }}>
          <i>
            <i className="icon">&#xe054;</i>
            {' '}
            {channel.title}
          </i>
        </span>
      </div>
    </div>
  );
};

Overlay.propTypes = {
  channel: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
};

export default Overlay;