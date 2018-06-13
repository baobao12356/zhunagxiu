import Env from 'rs-browser';
import QueryString from 'query-string';
import 'whatwg-fetch';
import { Toast } from 'antd-mobile';
// require('rs-hybrid-bs-http');
import back from './back';

/*使用文档参考whatwg-fetch
 *strData: post请求中是否将参数转换为json字符串，默认为true
 * */
const host = window.__config_env || {
  // path: !Env.rsApp ? '' : 'http://jzwap.dev.rs.com'
  path: !Env.rsApp ? '' : 'http://jzwap.uat1.rs.com'
  // path: !Env.rsApp ? '' : ''
  // path: !Env.rsApp ? '' : 'https://jzwap.mmall.com'
};

export default class Http {
  static send(url, option, resolve, reject, errorCallback, defaultHost = false) {
    const param = {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: null
    };
    Object.assign(param, option);

    let _url = url;

    if (param.body) {
      if (param.method == 'GET') {
        param.body = QueryString.stringify(param.body);
        _url += (_url.indexOf('?') > 0 ? `&${param.body}` : `?${param.body}`);
        param.body = null;
      } else if (param.method == 'POST') {
        if (param.headers['Content-Type'] === "application/json") {
          param.body = JSON.stringify(param.body);
        } else {
          param.body = QueryString.stringify(param.body);
        }
      }
    }

    let nowUrl;
    if (defaultHost) {
      nowUrl = host.path + _url;
    } else {
      nowUrl = _url;
    }

    fetch(nowUrl, param)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      })
      .then((res) => {
        res.json().then((data) => {
          resolve(data);
        }).catch(() => {
          reject(new Error('数据无法解析'));
        });
      })
      .catch((e) => {
        console.log(e);
        Toast.hide();
        if (errorCallback && typeof errorCallback == 'function') {
          console.log(e, ' errorCallback');
          errorCallback();
        }
      });
  }

  static get(url, option = {}, errorCallback) {
    return new Promise((resolve, reject) => {
      Http.send(url, option, resolve, reject, errorCallback);
    });
  }

  static post(url, option = {}, errorCallback) {
    Object.assign(option, {
      method: 'POST'
    });
    return new Promise((resolve, reject) => {
      Http.send(url, option, resolve, reject, errorCallback);
    });
  }
}
