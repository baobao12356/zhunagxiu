require('../../lib/scripts/flexible');
import React from 'react';
import ReactDOM from 'react-dom';
import Details from './details/index';
import Env from 'rs-browser';
import '../../lib/scripts/aureuma.data.min';


window.__native_init = function(){
	ReactDOM.render(<Details/>, document.getElementById('application'));
}

if ( !Env.rsApp ) {
  window.__native_init();
}

