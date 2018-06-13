"use strict";
import 'whatwg-fetch';
import _ from 'lodash';
import onfire from 'onfire.js';
import Consts from './Consts';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
function parseJSON(response) {
  return response.json()
}

export const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const CONTENT_TYPE = {
  'x-www-form-urlencoded': 'application/x-www-form-urlencoded',
  'json': 'application/json',
}

export default class Http {

  static upload(url, options, resolve, reject) {

  }

  /**
   *
   * @param url
   * @param options
   *    emulateJSON: ''
   * @param resolve
   * @param reject
   * @returns {Promise.<TResult>}
   */
  static send(url, options, resolve, reject) {
    let _options = {
      method: 'GET',
      credentials: "same-origin",
      headers: {},
      emulateJSON: false,
    };
    _.extend(_options, options);
    if (!_options.headers["Content-Type"]) {
      if (options.emulateJSON) {
        _options.headers["Content-Type"] = CONTENT_TYPE['x-www-form-urlencoded'];
      } else if (_options.method == METHOD.POST ||
        _options.method == METHOD.PUT ||
        _options.method == METHOD.DELETE) {
        _options.headers["Content-Type"] = CONTENT_TYPE['json'];
        if (_options.data) {
          _options.body = JSON.stringify(options.data);
          delete _options.data;
        }
      }
    }
    let path = Consts.SERVICE_ROOT + '/' + url;
    path = path.replace(/\/{2}/g, '/');
    console.log(path)
    return fetch(path, _options)
      .then(checkStatus)
      // .then(parseJSON)
      .then((xhr) => {
        let responseData = xhr.json();
        responseData.then((data)=> {
          if (data.code != 200) {
            onfire.fire(Consts.EVENT_KEY.NET_COMMUNICATION.BUSINESS_ERROR.NOT_200, {
              code: data.code,
              message: data.message || '业务错误请再试试!'
            });
          } else {
            resolve(data.dataMap, data, xhr);
          }
        });
      })
      .catch((error) => {
        if (error.response) {
          onfire.fire(Consts.EVENT_KEY.NET_COMMUNICATION.NORMAL_ERROR.ERROR_500);
        }
        reject(error);
      });
  }

  static get(url, params = {}) {
    let param = [];
    _.keys(params).forEach((key) => {
      param.push(`${key}=${params[key]}`)
    });
    let options = {
      method: METHOD.GET,
    }
    return new Promise((resolve, reject)=> {
      Http.send(`${url}?${param.join('&')}`, options, resolve, reject);
    })

  }

  static post(url, options = {}) {
    let _options = {
      method: METHOD.POST,
    };
    Object.assign(_options, options);
    return new Promise((resolve, reject)=> {
      Http.send(url, _options, resolve, reject);
    });
  }

  static put(url, options = {}) {
    let _options = {
      method: METHOD.PUT,
    };
    Object.assign(_options, options);
    return new Promise((resolve, reject)=> {
      Http.send(url, _options, resolve, reject);
    });
  }

  static delete(url, options = {}) {
    let _options = {
      method: METHOD.DELETE,
    };
    return new Promise((resolve, reject)=> {
      Http.send(url, _options, resolve, reject);
    });
  }
}
