import HybridBridge from 'rs-hybrid-bridge';
import Env from 'rs-browser';
import Config from './config_host';
import Cookies from 'js-cookie';

export default function login() {

  if (Env.rsApp) {
    new HybridBridge(window).hybrid('call_native', {
      tag: '2'
    }).then((data) => {
      if (data && data.sessionid && data.openid) {
        Cookies.set('SESSION.user', data.sessionid);
        Cookies.set('sessionid', data.sessionid);
        Cookies.set('openid', data.openid);
        sessionStorage.userInfo = JSON.stringify(data);
        Cookies.set('is_login', 1);
      }
    }).catch((e) => {
      console.log(e);
    });

  } else {
    //window.location.href = `${Config.hostname}/login`
  }
}
