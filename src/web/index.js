import React from 'react';
import { render } from 'react-dom'; 
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';

import core from './core/reducers';
import App from './App.js';

const app = combineReducers({
  core
});

const store = createStore(app);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);