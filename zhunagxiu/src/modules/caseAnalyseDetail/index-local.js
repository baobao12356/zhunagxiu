require('../../lib/scripts/flexible');
import React from 'react';
import ReactDom from 'react-dom';
import Details from './details';
import Env from 'rs-browser';
import '../../lib/scripts/aureuma.data.min';

window.__native_init = function(){
  ReactDom.render(
    <Details />,
    document.getElementById('application')
  );
};

if ( !Env.rsApp ) {
  window.__native_init();
}






