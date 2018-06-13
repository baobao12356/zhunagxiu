import Http from '../lib/scripts/http';
import back from '../lib/scripts/back';
import {Toast} from 'antd-mobile';


let decoDiaryDetailModel = {
  ReceiveDiaryDetail(detailId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/owner/detail?id=${detailId}`).then((data) => {
        if (data.code == 40007 || data.code == 40003) {
          (new Promise(function () {
            Toast.info(data.message, 2)
          })).then(setTimeout(function () {
            back()
          }, 2000))
        } else {
          if (data.code == 200) {
            resolve(data);//返回成功数据
          }
        }
      });
    })
  },
}
export default decoDiaryDetailModel;
