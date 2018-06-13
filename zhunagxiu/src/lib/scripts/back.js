/**
 * Created by chunhua.yang on 2017/7/6.
 */
import Env from 'rs-browser';
import HybridBack from 'rs-hybrid-back';
import Os from 'rs-os';
export default function back() {
  if (Env.rsApp) {
    if (Env.ios && parseInt(Os.version) > 8 && ((window.location.href.indexOf('back=h5') > -1 && window.location.protocol != 'file:') || (window.location.href.indexOf('back=file') > -1 && window.location.protocol == 'file:'))) {
      //app内,目标页为file协议，当前页为file协议
      window.history.go(-1);
    } else if ((Env.android || parseInt(Os.version) <= 8) && window.location.href.indexOf('back=') > -1) {
      window.history.go(-1);
    } else {
      new HybridBack().back();
    }
  } else {
    window.history.go(-1);
  }

  return false;
}


