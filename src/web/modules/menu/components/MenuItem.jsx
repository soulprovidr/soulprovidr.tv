import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({ active, channel, index, onSelect }) => {
  let className = 'menu__item col-lg-4 col-md-6 col-12 p-0 d-flex flex-column h-100 justify-content-end';
  if (active) {
    className += ' active';
  }
  return (
    <div
      className={className}
      onClick={() => onSelect(channel)}
      style={{ backgroundImage: `url(${channel.image})` }}
    >
      <div className="d-flex justify-content-between bg-white p-3" style={{ borderRight: '1px solid #ddd' }}>
        <div className="flex-grow-1 ">
          <h4 className="card-title font-weight-bold m-0">
            {index + 1}. {channel.title}
          </h4>
          <small className="text-muted">
            {channel.tags.join(', ')}
          </small>
          <p className="card-text flex-grow-1">
            {channel.description}
          </p>
        </div>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default MenuItem;