import { Toast } from 'antd-mobile';
import { ACTION_TYPES } from '../actions';

function errors(state = {}, action = {}) {
  let result = state;
  const { type, payload = {} } = action;
  const { message = '' } = payload;
  switch (type) {
    case ACTION_TYPES.ERROR_500:
      Toast.fail(<div>系统出现错误<br/>请联系客服解决</div>, 2, null, false);
      console.error(message);
      break;
    case ACTION_TYPES.ERROR_401:
      Toast.fail(<div>用户未登录<br/>请登录后再试</div>, 2, null, false);
      break;
    default:
      result = state;
  }
  return result;
}

module.exports = errors;
