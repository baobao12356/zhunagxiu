import { Toast } from 'antd-mobile';
import { ACTION_TYPES } from '../actions';

function global(state = {}, action = {}) {
  const { type } = action;
  switch (type) {
    case ACTION_TYPES.GLOBAL_LOADING_START:
      Toast.loading("加载中...", 0);
      break;
    case ACTION_TYPES.GLOBAL_LOADING_END:
      Toast.hide();
      break;
  }
  return state;
}

module.exports = global;
