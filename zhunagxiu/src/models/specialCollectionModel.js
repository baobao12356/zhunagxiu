import Http from '../lib/scripts/http';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';

let specialCollectionModel = {
  getData(id) {
    const url = `/api-jiazhuang/c/hxapp/collection/detailV2?id=${id}`
    return new Promise((resolve, reject) => {
      console.log('geturl',url);
      Http.get(url).then((res) => {
        if(res.code == 40007||res.code == 40003){
          (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        }else {
          resolve(res);
        }
      });
    })
  }
}
export default specialCollectionModel;

