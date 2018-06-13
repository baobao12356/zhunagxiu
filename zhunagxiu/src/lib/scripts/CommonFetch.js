import Hybrid from './../lib/scripts/hybrid';
import queryString from 'query-string';
import Version from 'rs-browser'


const ENV = window.__config_env || {
  path:'http://jzwap.uat1.rs.com',
};

if(!Version.rsApp){
  ENV.path= '';
}


const CommonFetch = {
  fetch(parameter){
    if(typeof(parameter) === 'string'){
      parameter = JSON.parse(parameter);
    }
    let url = parameter.url;
    const method = parameter.method;
    if(Hybrid.isApp){
      url = ENV.path+ url;
    }
    const fetchPara = {
      method:method
    };
    if(parameter.body){
      fetchPara.body = parameter.body;
    }
    if(parameter.headers){
      fetchPara.headers = parameter.headers;
    }
    if (parameter.requestSerializerType) {
      fetchPara.requestSerializerType = parameter.requestSerializerType;
    }
    return fetch(url,fetchPara).then(xhr => xhr);
  }
};

export default CommonFetch;
