import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import Env from 'rs-browser';
import Os from 'rs-os';
import { pointConnect } from 'rs-point';
import 'babel-polyfill';
import { syncAppUserInfo } from './AuthUtil';
import { tongjiConfig } from '../common/config';
import store from '../store';

function bootstrap(elem, extTongjiConfig = {}) {
  const pageName = window.location.pathname.replace(/.*(\/)|(\.html)/g, '');
  const currentConfig = Object.assign({}, tongjiConfig.datas[pageName] || {}, extTongjiConfig);
  if (currentConfig.tag && currentConfig.p_action_id) {
    const tmpActionId = currentConfig.p_action_id.replace(/contentid=?/, '');
    currentConfig.p_action_id = `tag=${currentConfig.tag}&contentid=${tmpActionId}`;
    delete currentConfig.tag;
  }

  const pointClass = pointConnect({
    ...currentConfig
  })(elem);

  const pointElem = (
    <Provider store={store}>
      {React.createElement(pointClass, { store })}
    </Provider>
  );
  window.didAppear = () => {
    syncAppUserInfo();
  };

  window.__native_init = () => {
    if (Env.rsApp) {
      syncAppUserInfo(() => {
        ReactDom.render(pointElem, document.getElementById('application'));
      });
    } else {
      ReactDom.render(pointElem, document.getElementById('application'));
    }
  };

  if (Env.rsApp) {
    if (parseInt(Os.version, 10) <= 8) {
      setTimeout(() => {
        window.__native_init();
      }, 300);
    }
  } else {
    window.__native_init();
  }
}

export default {
  bootstrap
};
