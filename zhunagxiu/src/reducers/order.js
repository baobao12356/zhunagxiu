
import Immutable from 'immutable';
import { ACTION_TYPES } from '../actions';

const DEFAULT_STATE = Immutable.fromJS({
  //装修订单
  decoOrder: {}
});

function order(state = DEFAULT_STATE, action) {
  console.log('decoOrder state', state, action);
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.DECO_ORDER_FETCH_DETAIL:
      state = state.setIn(['decoOrder'], payload);
      break;
    default:
  }
  return state;
}

module.exports = order;
