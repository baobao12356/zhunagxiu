import Cookies from 'js-cookie';
import Env from 'rs-browser';
import HybridUserInfo from 'rs-hybrid-user-info';

function getOpenId() {
  return Cookies.get('openid');
}

function getSessionId() {
  return Cookies.get('sessionid');
}

function isLogin() {
  return Cookies.get('is_login') ==1;
}

function saveUserInfo(sessionId, openId) {
  Cookies.set('SESSION.user', sessionId);
  Cookies.set('sessionid', sessionId);
  Cookies.set('openid', openId);
  Cookies.set('is_login', 1);
}

function clearUserInfo(sessionId, openId) {
  Cookies.remove('SESSION.user');
  Cookies.remove('sessionid');
  Cookies.remove('openid');
  Cookies.remove('is_login');
}

function syncAppUserInfo(cb) {
  if (Env.rsApp) {
    new HybridUserInfo().getUserInfo().then((res) => {
      if (res && res.sessionid && res.openid) {
        saveUserInfo(res.sessionid, res.openid);
      } else {
        clearUserInfo();
      }
      cb && cb();
    }).catch((e) => {
      console.log(e);
      cb && cb();
    });
  } else {
    cb && cb();
  }
}

export default {
  getOpenId,
  getSessionId,
  isLogin,
  syncAppUserInfo
}
