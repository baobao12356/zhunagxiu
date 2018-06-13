//import {CommonModel} from '../core';
//import CommonFetch from './../common/CommonFetch';
import Http from '../lib/scripts/http'
import HybridUserInfo from 'rs-hybrid-user-info';





export default class BottomModel {


  /**
   * 获取点赞信息
   * @param id
   * @param likeType
   * @param userId
   */
  ReceiveLikedInfo(id,likeType,userId) {
    //http://m.uat1.rs.com/api/review/common/likedCount
    const url = '/api-alibi/api/review/common/likedCount';

    let body = {
      type: likeType,
      id: id,
      userId: userId
    };
  //  const parameter = {
  //    url: url,
  //    method: 'post',
  //    headers: {
  //      "Content-Type": "application/json"
  //    },
  //    body: JSON.stringify(body)
  //};
    return new Promise((resolve, reject) => {
      Http.post(`/api-alibi/api/review/common/likedCount`,{
          headers: {
            "Content-Type": "application/json"
          },
          body:{
            type: likeType,
            id: id,
            userId: userId
          }
        })
        .then(data => {
          if (data.code == 200) {
            resolve(data);
          } else {
            if (data.code == 401) {
              //失败后的一种状态
            } else {
              //失败的另一种状态
            }
            reject(data); //返回失败数据
          }
        })
        .catch(error => {
          //捕获异常
          console.log(error.msg);
          reject()
        })
    })
  }

  /**
   * 点赞
   * @param id
   * @param likeType
   * @param userId
   * @param likeAction
   * @param sessionId
   */
  ClickLike(id,likeType,likeAction,userId,sessionId) {

    //http://m.uat1.rs.com/api/review/common/likedCount
    const url = '/api-alibi/api/review/common/praise';
    let body = {
      objectType: likeType,
      id: id,
      userId: userId,
      type:likeAction
    };
    let parameter = {
      url: url,
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": sessionId
      }
    };
    return new Promise((resolve, reject) => {
      Http.post(`/api-alibi/api/review/common/praise`,{
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": sessionId
          },
          body:{
            objectType: likeType,
            id: id,
            userId: userId,
            type:likeAction
          }
        })
        .then(data => {
          if (data.code == 200) {
            resolve(data);
          } else {
            if (data.code == 401) {
              //失败后的一种状态
            } else {
              //失败的另一种状态
            }
            reject(data); //返回失败数据
          }
        })
        .catch(error => {
          //捕获异常
          console.log(error.msg);
          reject()
        })
    })

  }

  /**
   * 获取收藏信息
   * @param id
   * @param collectionType
   * @param sessionId
   */
  ReceiveCollectionInfo(id,collectionType,sessionId) {

    //http://api-user.uat1.rs.com/api/userCollection/IsItemCollectioned
    const url = '/api-user/api/userCollection/IsItemCollectioned?appId=c3&objectId='+id+'&sourceType='+collectionType;
    let parameter = {
      url: url,
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": sessionId
      }
    };
    return new Promise((resolve, reject) => {
      Http.post(`/api-user/api/userCollection/IsItemCollectioned?appId=c3&objectId=${id}&sourceType=${collectionType}`,{
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": sessionId
          },
        })
        .then(data => {
          if (data.code == 200) {
            resolve(data);
          } else {
            if (data.code == 401) {
              //失败后的一种状态
            } else {
              //失败的另一种状态
            }
            reject(data); //返回失败数据
          }
        })
        .catch(error => {
          //捕获异常
          console.log(error.msg);
          reject()
        })
    })
  }

  /**
   * 添加收藏
   * @param collectParams
   * @param sessionId
   * @returns {AddCollection}
   */
  AddCollection(collectParams,sessionId) {
    //http://api-user.uat1.rs.com/api/userCollection/addUserCollection
    const url = '/api-user/api/userCollection/addUserCollection?appId=c3&objectId='+collectParams.id+'&sourceType='+collectParams.collectionType
      + '&title='+collectParams.title+'&channel='+collectParams.channel+'&picture='+collectParams.cover;

    let parameter = {
      url: url,
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": sessionId
      }
    };
    return new Promise((resolve, reject) => {
      Http.post(`/api-user/api/userCollection/addUserCollection?appId=c3&objectId=${collectParams.id}&sourceType=${collectParams.collectionType}&title=${collectParams.title}&channel=${collectParams.channel}&picture=${collectParams.cover}`,{
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": sessionId
          }
        })
        .then(data => {
          if (data.code == 200) {
            resolve(data);
          } else {
            if (data.code == -401) {
              resolve(data);
            } else {
              reject(data); //返回失败数据
            }
          }
        })
        .catch(error => {
          //捕获异常
          console.log(error.msg);
          reject()
        })
    })
  }

  /**
   * 取消收藏
   * @param id
   * @param collectionType
   * @param sessionId
   * @returns {CancelCollection}
   */
  CancelCollection(id,collectionType,sessionId) {

    //http://api-user.uat1.rs.com/api/userCollection/cancelUserCollection
    const url = '/api-user/api/userCollection/cancelUserCollection?appId=c3&objectId='+id+'&sourceType='+collectionType;
    let parameter = {
      url: url,
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": sessionId
      }
    };
    return new Promise((resolve, reject) => {
      Http.post(`/api-user/api/userCollection/cancelUserCollection?appId=c3&objectId=${id}&sourceType=${collectionType}`,{
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": sessionId
          }
        })
        .then(data => {
          if (data.code == 200) {
            resolve(data);
          } else {
            if (data.code == 401) {
              //失败后的一种状态
            } else {
              //失败的另一种状态
            }
            reject(data); //返回失败数据
          }
        })
        .catch(error => {
          //捕获异常
          console.log(error.msg);
          reject()
        })
    })
  }

  /**
   * 获取评论数
   * @param id
   * @param commentType
   * @param tokenId
   * @returns {ReceiveCommentLength}
   */
  ReceiveCommentLength(id,commentType) {

    //http://m.uat1.rs.com/api/review/common/list
    const url = '/api-alibi/api/review/common/list';
    let parameter = {
      url: url,
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        id:id,
        type:commentType
      })
    };
    return new Promise((resolve, reject) => {
      Http.post(`/api-alibi/api/review/common/list`,{
          headers: {
            "Content-Type": "application/json"
          },
        body:{
          id:id,
          type:commentType
        }
        })
        .then(data => {
          if (data.code == 200) {
            resolve(data);
          } else {
            if (data.code == 401) {
              //失败后的一种状态
            } else {
              //失败的另一种状态
            }
            reject(data); //返回失败数据
          }
        })
        .catch(error => {
          //捕获异常
          console.log(error.msg);
          reject()
        })
    })
  }
}
