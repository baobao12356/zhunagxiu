import Http from '../lib/scripts/http';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';

let softTrimModel = {
  //获取设计师详情
  softTrimDetail(caseId) {
    return new Promise((resolve, reject) => {
      const url = '/api-jiazhuang/c/hxapp/soft/softDetail?caseId=' + caseId;
      Http.get(url).then((res) => {
        if(res.code == 40007||res.code == 40003){
          (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        }else {
          resolve(res);
        }
      });
    })
  },

  //获取评论
  getDesignerEvaluate(designerId,pageSize=50,page=1) {
    return new Promise((resolve, reject) => {
      const url = '/api-alibi/api/review/common/list',
        body = {
          body:{
            // "extendColumnOne":"74474eee-c0f7-4aac-8f53-278cfa0c33ce",
            "extendColumnOne":designerId,
            "type":"booking_designer",
            "pageSize":pageSize,
            "page":page
          }
        };

      Http.post(url,body).then((res) => {
        resolve(res);
      });
    })
  },


}
export default softTrimModel;
