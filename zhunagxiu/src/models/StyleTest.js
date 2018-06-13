/**
 * Created by traven on 2017/8/8.
 */
import Http from '../lib/scripts/http'
import GetUserInfo from '../lib/scripts/getUserInfo';
import GetNativeInfo from '../lib/scripts/getNativeInfo';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';


let StyleTest = {

  // 风格测试预约
  StyleRegistration(options) {
    return new Promise((resolve, reject) => {

      // Http.post(`/api-jiazhuang/c/activityUser/dRegistration`,{
      Http.post(`/api-jiazhuang/c/hxapp/activityForUser/dRegistration`,{
        headers: {
          "Content-Type": "application/json"
        },
        body:options
      }).then((res) => {
        if (res.code == 200) {
          resolve(res);
        } else {
          if (res.code == 401) {
            //失败后的一种状态
          } else {
            //失败的另一种状态
          }
          reject(res); //返回失败数据
        }
      }).catch(error => {
        //捕获异常
        console.log(error.msg);
        reject()
      });
    })
  },

  // 风格测试新增数据、获取推荐案例
  StyleAdd(cityCode, options) {
    return new Promise((resolve, reject) => {

      Http.post(`/api-jiazhuang/c/hxapp/style/styleAdd`,{
        headers: {
          "Content-Type": "application/json",
          "locationCode": cityCode
        },
        body:options
      }).then((res) => {
        if (res.code == 200) {
          resolve(res);
        } else {
          if (res.code == 401) {
            //失败后的一种状态
          } else {
            //失败的另一种状态
          }
          reject(res); //返回失败数据
        }
      }).catch(error => {
        //捕获异常
        console.log(error.msg);
        reject()
      });
    })
  }
};
export default StyleTest;
