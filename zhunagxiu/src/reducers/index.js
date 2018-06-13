import { combineReducers } from 'redux-immutable';

export default combineReducers({
  errors: require('./errors'),
  global: require('./global'),
  sample: require('./sample'),
  buildingSites: require('./building-sites'),
  order: require('./order'),
  routing: require('./redux-immutable'),
});
