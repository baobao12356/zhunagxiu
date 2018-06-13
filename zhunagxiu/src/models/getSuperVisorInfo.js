import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';
import Http from '../lib/scripts/http'
import GetUserInfo from '../lib/scripts/getUserInfo';
import GetNativeInfo from '../lib/scripts/getNativeInfo';

const SuperVisorCompanyInfo = {


  getSuperVisorDetail(companyId) {
    return new Promise((resolve, reject) => {

      Http.get(`/api-jiazhuang/c/supervisor/company/info?companyId=${companyId||''}`).then((res) => {
        // if(res&&res.code ==200){
        //   resolve(res);//返回成功数据
        // }else{
        //   Toast.info('该监理公司已下线!', 2);
        // }

        // if(res&&(res.code == 40007||res.code == 40003)){
        //   Toast.info('该监理公司已下线!', 3);
        //   // (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        // }
        resolve(res);//返回成功数据
      }).catch((e)=>{
         console.log(e)
      });
    })
  },


  getCommentList(companyId,pageNo=1,pageSize=2000) {
    return new Promise((resolve, reject) => {

      Http.get(`/api-jiazhuang/c/supervisor/company/commentList?companyId=${companyId||''}&pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => {
        if(res.code ==200){
          resolve(res);//返回成功数据
        }else{
          // Toast.info(res.message||'异常', 2)
          console.log(res.message)
        }
      }).catch((e)=>{
         console.log(e)
      });
    })
  },


};
export default SuperVisorCompanyInfo;
