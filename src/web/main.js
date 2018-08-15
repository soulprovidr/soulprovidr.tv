import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import axios from 'axios';
import React from 'react';
import { render } from 'react-dom'; 
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import '@babel/polyfill';

import App from './modules/app/components/App';
import channels from '@/channels/reducer';

// Enable Redux DevTools.
let composeEnhancers = compose;
if (typeof window !== 'undefined') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

axios.defaults.headers.common['Content-Type'] = 'application/json';

const reducers = {
  channels
};

// Create store.
const store = createStore(
  combineReducers(reducers),
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

// Render app.
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);