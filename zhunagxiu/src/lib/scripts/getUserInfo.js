import HybridUserInfo from 'rs-hybrid-user-info';
import Env from 'rs-browser';

export default function getUserInfo() {
  return new Promise((resolve, reject) => {
    console.log('get user info');
    if (Env.rsApp) {
      if (sessionStorage.userInfo && sessionStorage.userInfo != '') {
        resolve(JSON.parse(sessionStorage.userInfo));
      } else {
        new HybridUserInfo().getUserInfo().then((res) => {
          if (res && res.sessionid && res.openid) {
            sessionStorage.userInfo = JSON.stringify(res);
            resolve(res);
          } else {
            reject(new Error('app-未返回用户信息'));
          }
          return res;
        }).catch((error) => {
          console.log(error);
          reject(new Error('调native失败.....'));

        });
      }
    } else {
      if (localStorage.userInfo && sessionStorage.userInfo != '') {
        resolve(JSON.parse(sessionStorage.userInfo));
      } else {
        reject(new Error('用户未登录'));
      }
    }
  })/*.catch((e) => {
   console.log(e);
   })*/;
}
