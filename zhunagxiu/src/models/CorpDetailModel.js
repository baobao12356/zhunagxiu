import Http from '../lib/scripts/http';
import back from '../lib/scripts/back';
import {Toast} from 'antd-mobile';


let CorpDetailModel = {
  ReceiveCorpDetail(corpId,openid) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/decoration/detail?id=${corpId}`,{
        headers: {
          'x-auth-token':openid
        },
      }).then((data) => {
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

  ReceiveAboutUs(corpId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/decoration/introduce?companyId=${corpId}`).then((data) => {
          resolve(data);//返回成功数据
      });
    })
  },

  ReceiveGrade(corpId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/decoration/grade?companyId=${corpId}`).then((data) => {
        //if (data.code == 40007 || data.code == 40003) {
        //  (new Promise(function () {
        //    Toast.info(data.message, 2)
        //  })).then(setTimeout(function () {
        //    back()
        //  }, 2000))
        //} else {
        //  if (data.code == 200) {
            resolve(data);//返回成功数据
      //    }
      //  }
      });
    })
  },
  ReceiveActiveImg(activityId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/decoration/companyBanner?id=${activityId}`).then((data) => {
          resolve(data);//返回成功数据
      });
    })
  },
  //领券接口
  ReceiveCoupon(couponId, sessionId) {
    return new Promise((resolve, reject) => {
      Http.post(`/api-coupon/channel/20/name/1/subChannel/1/user/cupon/${couponId}`,{
        headers: {
          'x-auth-token':sessionId
        },
      }).then((data)=> {
        resolve(data);
      })
    })
  }
}
export default CorpDetailModel;
