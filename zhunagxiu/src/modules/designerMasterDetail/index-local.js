require('../../lib/scripts/flexible');
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router/router';
import Main from './main';
import Env from 'rs-browser';
import '../../lib/scripts/aureuma.data.min';


window.__native_init = function(){
  ReactDOM.render(<Main/>, document.getElementById('application'));
};

if ( !Env.rsApp ) {
  window.__native_init();
}

