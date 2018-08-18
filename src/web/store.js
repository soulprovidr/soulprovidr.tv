import {
  applyMiddleware,
  compose,
  createStore,
  combineReducers
} from 'redux';
import { batchStoreEnhancer, batchMiddleware } from 'redux-batch-enhancer'; 
import thunk from 'redux-thunk';

// Enable Redux DevTools.
const composeEnhancers = typeof window !== 'undefined'
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

import app from '@/app/reducer';
import channels from '@/channels/reducer';
import videos from '@/videos/reducer';

export default createStore(
  combineReducers({
    app,
    channels,
    videos
  }),
  composeEnhancers(
    applyMiddleware(batchMiddleware, thunk),
    batchStoreEnhancer
  )
);