import Http from '../lib/scripts/http';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';

let videoModel = {
  //获取设计师详情
  videoDetail(vId) {
    return new Promise((resolve, reject) => {
      const url = '/api-jiazhuang/c/hxapp/design/detail?id=' + vId;
      Http.get(url).then((res) => {
        if(res.code == 40007||res.code == 40003){
          (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        }else {
          resolve(res);
        }
      });
    })
  },




}
export default videoModel;
