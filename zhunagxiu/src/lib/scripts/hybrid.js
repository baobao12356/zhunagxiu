/**
 * Created by lenovo on 2017/5/25.
 */


var ua = navigator.userAgent;
var isApp = false;
if (ua.match(/chinaredstar/ig)) {
  isApp = true;
}
var os = {
  android: false,
  ios: true,
  appId: 'C1C50237' //'c3'
};
if (ua.match(/android/ig)) {
  os = {
    android: true,
    ios: false,
    appId: 'C7D84F4B'
  }
}
if (!window._app_callback) {
  window._app_callback = (uuid, res) => {
    if (res === '') {
      res = '{}';
    }
    if(typeof(res) === 'string'){
      res = JSON.parse(res);
    }
    let promiseFunc = promisesMap.get(uuid);
    if (promiseFunc) {
      delete promisesMap[uuid];
      promiseFunc.resolve(res);
    } else {
      promiseFunc && promiseFunc.reject(new Error('no method defined.'))
    }
  }

}
var _appCall = (uuid, action, parameter) => {
  if (!!!uuid) {
    alert('uuid缺失');
    return;
  }
  if (!isApp) {
    return;
  }
  if (os.android) {
    window.hybrid._app_call(uuid, action, JSON.stringify(parameter));
  } else if (os.ios) {
    _app_call(uuid, action, JSON.stringify(parameter));
  }
  /*else {
   _app_call(uuid, action, JSON.stringify(parameter));
   }*/
};
var promisesMap = new Map();
var Hybrid = {
  callHybridMethod(uuid, action, parameter) {
    return new Promise((resolve, reject) => {
      promisesMap.set(uuid, {
        resolve,
        reject
      });
      _appCall(uuid, action, parameter);
    })
  },
  callHybridBasicInfo (uuid, action, param = {}, needCallback = true) {
    return new Promise((resolve, reject) => {
      needCallback && promisesMap.set(uuid, {
        resolve,
        reject
      });
      if ( !uuid ) {
        reject(new Error('uuid缺失'));
        return;
      }
      if ( !isApp ) {
        reject(new Error('_app_call只能在app中调用'));
        return;
      }
      if ( window._app_call ) {
        _app_call(uuid, action, JSON.stringify(param));
      } else if ( window.hybrid && window.hybrid._app_call ) {
        window.hybrid._app_call(uuid, action, JSON.stringify(param));
      }
    })
  },
  /*是否在native*/
  isApp: isApp,
  os: os
};
export default Hybrid;
