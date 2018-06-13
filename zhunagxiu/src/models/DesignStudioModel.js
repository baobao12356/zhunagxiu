import Http from '../lib/scripts/http';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';

let designStudioModel = {
  //获取设计师详情
  getDesignStudioInfo(designerId) {
    return new Promise((resolve, reject) => {
      const url = '/api-jiazhuang/c/hxapp/company/studioDetail?id=' + designerId;
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


  //获取案例列表
  getDesignerCases(designerId,page) {
    return new Promise((resolve, reject) => {
      const url = '/api-jiazhuang/c/hxapp/case/byStyleList?designerId='+designerId+'&pageNo='+page;
      Http.get(url).then((res) => {
        resolve(res);
      });
    })
  },


  //获取问答列表
  getDesignerAsk(designerId,page) {
    return new Promise((resolve, reject) => {
      const url = '/api-jiazhuang/c/hxapp/knowledge/askingList?designerId='+designerId+'&pageNo='+page;
      Http.get(url).then((res) => {
        resolve(res);
      });
    })
  },

  //获取视频列表
  getDesignerVideo(designerId,page) {
    return new Promise((resolve, reject) => {
      const url = '/api-jiazhuang/c/hxapp/design/designerVideoList?keyWords='+designerId+'&pageNo='+page;
      Http.get(url).then((res) => {
        resolve(res);
      });
    })
  }





}
export default designStudioModel;
