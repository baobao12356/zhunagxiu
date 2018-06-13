import Http from '../../lib/scripts/http'
import Host from '../../lib/scripts/config_host'

let designerModel = {
  getUserAttentionInfo(openid,designerId) {
    return new Promise((resolve, reject) => {
      // const url = '/api-user/api/userAttention/IsItemUserAttention?appId='+Host.appId+'&sourceType=15&objectId='+designerId;
      const url = 'http://api-user.dev.rs.com/api/userAttention/IsItemUserAttention?appId='+Host.appId+'&sourceType=15&objectId='+designerId;
      Http.post(url,{
        headers: {
          'x-auth-token':openid
        },

      }).then((res) => {
        resolve(res);
      });
    })
  },
  addUserAttention(designerId) {
    return new Promise((resolve, reject) => {
      const url = '/api-user/api/userAttention/addUserAttention';
      const body = {
        "channel":"deco ",
        "sourceType":"15 ",
        "objectId":designerId,
      }
      Http.post(url,body).then((res) => {
        resolve(res);
      });
    })
  },
  cancelUserAttention(designerId) {
    return new Promise((resolve, reject) => {
      const url = '/api-user/api/userAttention/cancelUserAttention';
      const body = {
        "sourceType":"15 ",
        "objectId":designerId,
      }
      Http.post(url,body).then((res) => {
        resolve(res);
      });
    })
  },


}
export default designerModel;
