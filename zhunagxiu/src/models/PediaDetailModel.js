import http from '../lib/scripts/http';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';

let PediaDetailModel = {

  //百科详情:百科id
  //http://api-jiazhuang.uat1.rs.com/c/hxapp/encyclopedia/detail/
  ReceivePediaInfo(articleId) {
    const url = `/api-jiazhuang/c/hxapp/encyclopedia/detail/${articleId}`;

    return new Promise((resolve, reject) => {
      http.get(url).then((res) => {
        if(res.code == 40007||res.code == 40003){
          (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        }else {
          resolve(res);
        }
      })
    })

  },

  ReceiveViewTimes(articleId) {
    const url = `/api-bigdata/?owner=h5_app_c&operation=text_deco_lifestyle&datatypes=history&fields=pv&ids=${articleId}`;

    return new Promise((resolve, reject) => {
      http.get(url).then((res) => {
        resolve(res);
      })
    })
  }

}

export default PediaDetailModel;
