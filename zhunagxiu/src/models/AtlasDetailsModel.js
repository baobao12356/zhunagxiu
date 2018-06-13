/**
 * Created by traven on 2017/8/15.
 */
import Http from '../lib/scripts/http'
import back from '../lib/scripts/back';
import {Toast} from 'antd-mobile';

let AtlasDetailsModel = {
  AtlasDetails(detailId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/atlas/imageInfo/${detailId}`).then((res) => {
        if(res.code == 40007||res.code == 40003){
          (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        }else {
          resolve(res);
        }
      });
    })
  },
};
export default AtlasDetailsModel;
