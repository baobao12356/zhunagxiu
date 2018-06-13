import Env from 'rs-browser';
let appId = 'C1C50237';
if ( Env.web ) {
  appId = '313734E9';
} else if ( Env.android ) {
  appId = 'C7D84F4B';
}

const env = {
  appId,
  path:'https://jzwap.mklmall.com',
  host1:'mklmall.com',
  ptotocol:'https://',
  env : 'stg',
  hostname: 'https://mkl.mklmall.com'
};

window.__config_env = env;

export default env;
