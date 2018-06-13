import Immutable from 'immutable';
import { routerReducer, LOCATION_CHANGE } from 'react-router-redux';
const initialState = Immutable.fromJS({
  locationBeforeTransitions: null
});
const immuReducer = (state = initialState, action) => {
  if (action.type === LOCATION_CHANGE) {console.log('action', action)
    return state.set('locationBeforeTransitions', action.payload);
  }
  return state;
};
module.exports = immuReducer;
