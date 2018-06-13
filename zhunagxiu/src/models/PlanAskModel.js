/**
 * Created by traven on 2017/8/8.
 */
import Http from '../lib/scripts/http'
import GetUserInfo from '../lib/scripts/getUserInfo';
import GetNativeInfo from '../lib/scripts/getNativeInfo';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';


let PlanAskModel = {
  // 方案点评类型,1.户型问诊 2.方案点评

  AskingDetail(askId,askingType) {
    return new Promise((resolve, reject) => {

      Http.get(`/api-jiazhuang/c/hxapp/knowledge/askingDetail?askId=${askId}&askingType=${askingType}`).then((res) => {
        if(res.code == 40007||res.code == 40003){
          (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        }else {
          resolve(res);
        }
      });
    })
  },

  AnswerList(askId,pageNo,pageSize) {
    return new Promise((resolve, reject) => {
      GetUserInfo().then((res) => {
        console.log('2',res);
        Http.get(`/api-jiazhuang/c/hxapp/knowledge/answerList?askId=${askId}&pageNo=${pageNo}&pageSize=${pageSize}&openId=${res.openid}`).then((res) => {
          console.log('res2',res);
          resolve(res);
        });
      }).catch((e) => {
        console.log(e);
        GetNativeInfo().then((res) => {
          console.log('1',res);
          if (res.hxiphoneUUID) {
            Http.get(`/api-jiazhuang/c/hxapp/knowledge/answerList?askId=${askId}&pageNo=${pageNo}&pageSize=${pageSize}&openId=${res.hxiphoneUUID}`).then((res) => {
              console.log('res1',res);
              resolve(res);
            });
          } else {
            throw new Error('like-未返回设备序列号');
          }
        }).catch((error) => {
          console.log(error);
        });
      });
    })
  },

  DesignerAnswerList(askId,designerId,pageNo,pageSize) {
    return new Promise((resolve, reject) => {
      GetUserInfo().then((res) => {
        console.log('2',res);
        Http.get(`/api-jiazhuang/c/hxapp/knowledge/answerList?askId=${askId}&designerId=${designerId}&pageNo=${pageNo}&pageSize=${pageSize}&openId=${res.openid}`).then((res) => {
          console.log('res2',res);
          resolve(res);
        });
      }).catch((e) => {
        console.log(e);
        GetNativeInfo().then((res) => {
          console.log('1',res);
          if (res.hxiphoneUUID) {
            Http.get(`/api-jiazhuang/c/hxapp/knowledge/answerList?askId=${askId}&designerId=${designerId}&pageNo=${pageNo}&pageSize=${pageSize}&openId=${res.hxiphoneUUID}`).then((res) => {
              console.log('res1',res);
              resolve(res);
            });
          } else {
            throw new Error('like-未返回设备序列号');
          }
        }).catch((error) => {
          console.log(error);
        });
      });
    })
  }
};
export default PlanAskModel;
