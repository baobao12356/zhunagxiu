// import { Toast } from 'antd-mobile';
import { ACTION_TYPES } from '../actions';

function errors(state = {}, action) {
  let result = state;
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.SAMPLE_FETCH:
      console.log('SAMPLE_FETCH', payload);
      break;
    default:
      result = state;
  }
  return result;
}

module.exports = errors;
