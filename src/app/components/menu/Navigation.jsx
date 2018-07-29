import React from 'react';

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light py-4 px-1 container">
      <div className="d-flex align-items-center">
        <img
          className="navbar__logo rounded-circle mr-3"
          src="/img/logo.svg"
        />
        <span className="navbar-brand h1 font-weight-bold m-0">
          SOUL PROVIDER
        </span>
      </div>

      <div className="collapse navbar-collapse justify-content-end" id="navbarText">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Channel Listing
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;