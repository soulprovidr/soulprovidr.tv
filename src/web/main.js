import { applyMiddleware, compose, createStore } from 'redux';
import React from 'react';
import { render } from 'react-dom'; 
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './modules/app/components/App';

// Enable Redux DevTools.
let composeEnhancers = compose;
if (typeof window !== 'undefined') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

// Create store.
const store = createStore(
  () => {},
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