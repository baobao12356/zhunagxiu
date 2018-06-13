import Http from '../lib/scripts/http';
import back from '../lib/scripts/back';
import {Toast} from 'antd-mobile';


let CaseDetailModel = {
  ReceiveCaseDetail(caseId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/case/detail?caseId=${caseId}`).then((data) => {
        if(data.code == 40007||data.code == 40003){
              (new Promise(function(){Toast.info(data.message, 2)})).then(setTimeout(function(){back()},2000))
          }else {
          if(data.code ==200){
            let desId = data.dataMap.designerId;
            this.ReceiveEvaluateDetail(desId);
            resolve(data);//返回成功数据
          }
        }
      });
    })
  },
  ReceiveEvaluateDetail(desginerId) {
    return new Promise((resolve, reject) => {
      Http.post(`/api-jiazhuang/c/case/designer/commentCount`,{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        requestSerializerType: '0',
        body:{
          designerId:desginerId
        }
      }).then(data => {
          if (data.code == 200) {
            window.localStorage.setItem('evaluateCounts',data.dataMap);
          }
        })
    })
  }
}
export default CaseDetailModel;


//export default class CaseDetailModel {
//  /**
//   * 转换数据
//   * @param data
//   * @returns {{}}
//   * @private
//   */
//  _convert(data) {
//    if (data) {
//      data._convert = true;
//      return data;
//    }
//  }
//
//  //案例详情:案例id
//  // http://api-cms.uat1.rs.com/cms-web/activity/cuponissue?couponId=2&openId=0
//  // ReceiveCaseDetail(caseId) {
//  //       const url = 'api-jiazhuang/c/case/detail/' + caseId;
//  //       return new Promise((resovle, reject)=> {
//  //           CommonModel.post(url, {data:{}})
//  //               .then(this._convert)
//  //               .then((data)=> {
//  //                   resovle(data);
//  //               })
//  //               .catch(reject);
//  //       });
//  //   }
//
//
//
//  ReceiveCaseDetail(caseId) {
//    const url = '/api-jiazhuang/c/case/detail/' + caseId;
//    const parameter = {
//      url: url,
//      method: 'post'
//    };
//    return new Promise((resolve, reject) => {
//      CommonFetch.fetch(parameter)
//        .then(response => {
//          return response.json()
//        })
//        .then(data => {
//          if (data.code == 200) {
//            let desId = data.dataMap.designerId;
//            this.ReceiveEvaluateDetail(desId);
//            resolve(data);//返回成功数据
//          } else {
//            if (data.code == 401) {
//              //失败后的一种状态
//            } else {
//              //失败的另一种状态
//            }
//            reject(data); //返回失败数据
//          }
//        })
//        .catch(error => {
//          //捕获异常
//          console.log(error.msg);
//          reject()
//        })
//    })
//  }
//
//  ReceiveEvaluateDetail(desginerId) {
//    const url = '/api-jiazhuang/c/case/designer/commentCount';
//    let formData=new FormData();
//    formData.append("designerId",desginerId);
//    const parameter = {
//      url: url,
//      method: 'post',
//      body:formData
//    };
//    return new Promise((resolve, reject) => {
//      CommonFetch.fetch(parameter)
//        .then(response => {
//          return response.json()
//        })
//        .then(data => {
//          if (data.code == 200) {
//            window.localStorage.setItem('evaluateCounts',data.dataMap);
//            // resolve(data)
//            //返回成功数据resolve(data);
//          } else {
//            if (data.code == 401) {
//              //失败后的一种状态
//            } else {
//              //失败的另一种状态
//            }
//            reject(data); //返回失败数据
//          }
//        })
//        .catch(error => {
//          //捕获异常
//          console.log(error.msg);
//          reject()
//        })
//    })
//  }
//
//
//
//
//
//}
