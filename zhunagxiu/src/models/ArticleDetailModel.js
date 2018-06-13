import http from '../lib/scripts/http';
import {Toast} from 'antd-mobile';
import back from '../lib/scripts/back';
import axios from 'axios'
import Host from '../lib/scripts/config_host'

let ArticleDetailModel = {

  //文章详情:文章id
  //http://api-jiazhuang.uat1.rs.com/c/article/detail/64
  ReceiveArticleInfo(articleId) {
    //const url = `/api-jiazhuang/c/hxapp/article`; //mock数据
    const url = `/api-jiazhuang/c/hxapp/article/detail/${articleId}`;

    return new Promise((resolve, reject) => {
      http.get(url).then((res) => {
        // if(res.code == 40007||res.code == 40003){
        //   // Toast.info(res.message, 2)
        //   (new Promise(function(){Toast.info(res.message, 2)})).then(setTimeout(function(){back()},2000))
        // }else {
        //   resolve(res);
        // }
        if(res&&res.code ==200){
          resolve(res);
        }else{
             Toast.info(res.message||'异常', 2)
        }
      })
    })

  },

  ReceiveViewTimes(articleId) {
    const url = `/api-bigdata/?owner=h5_app_c&operation=text_deco_lifestyle&datatypes=history&fields=pv&ids=${articleId}`;

    return new Promise((resolve, reject) => {
      http.get(url).then((res) => {
        resolve(res);
      })
    })
  },


  /*BigDataCommend(id,openId,uName) {
    openId = openId || 'a_' + Date.now() + '_' + (Math.random() * Math.random()).toString(15).substr(2, 32)
    uName = uName || `username`
    let path=`https://api-reco.mmall.com`
    if(Host.path=='http://jzwap.uat1.rs.com'){
      path=`http://reco.uat1.rs.com`
    }

    const url = `${path}?groupid=300100&username=${uName}&id=${id}&typeid=5&userid=${openId}`;
    // const url = `http://bigdata.uat1.rs.com/?groupid=300100&username=test&id=1&typeid=5&userid=1111`;
    encodeURIComponent(url)
    return  axios.get(url)
  },

  BigDataCommendList(ids){
    let idxs = []
    if(ids && !!ids.length){
      ids.map((v,k)=>{
        //推荐只要3个
        if(k>2){
          return
        }
        idxs += v.id+","
      })
      let path=`https://api-bigdata.mmall.com/bigdata/`
      if(Host.path=='http://jzwap.uat1.rs.com'){
        path=`http://bigdata.uat1.rs.com/bigdata/`
      }

      const url = `${path}?owner=text_deco_lifestyle&operation=text_deco_lifestyle&datatypes=history&fields=id,title,cover_img_url,category_tags,tags,content,sub_title,pv,review,liked&ids=${idxs.substr(0,idxs.length-1)}`;
      // const url = `http://172.16.112.211:8011/bigdata?owner=text_deco_lifestyle&operation=text_deco_lifestyle&datatypes=history&fields=id,title,cover_img_url,category_tags,tags,content,sub_title,pv,review,liked&ids=${idxs.substr(0,idxs.length-1)}`;
      encodeURIComponent(url)
      return axios.get(url)
    }
    return null

  }*/

  BigDataCommendList(articleId,mid,uid){

    let midd = mid && ('&mid=' + mid);
    let uidd = uid && ('&uid=' + uid);

    return new Promise((resolve, reject) => {
      http.get(`/api-search/query?bizId=900200&pageNo=1&pageSize=3&sourceId=4${uidd}${midd}&articleId=${articleId}`).then((res) => {
        resolve(res);
      })
    })
  },


 async getShopGoods(id) {
    const url = `/api-rtapi/shop/v1.0.0/item/getItemAndPromotionDetail/${id}`;

    return new Promise((resolve, reject) => {
      http.get(url).then((res) => {
        if(res&&res.code ==200){
          resolve(res);
        }else {
         Toast.info(res.message, 2)
        }
      }).catch((e)=>{
        console.log(e)
      })
    })

  },


}

export default ArticleDetailModel;
