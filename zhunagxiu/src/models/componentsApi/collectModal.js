import Http from '../../lib/scripts/http'
import Host from '../../lib/scripts/config_host'

let collectModal = {
  getCollectNum(collectData) {
    //console.log('ffffffffffff', JSON.stringify(collectData));
    return new Promise((resolve, reject) => {
      const url = `/api-user/api/userCollection/getItemCollectionCount`;
      Http.post(url,{
        body: {
          appId: Host.appId,
          "objectId": collectData.objectId,
          "sourceType": collectData.sourceType,
          // "switchServer": 'jz'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
      ).then((res) => {
        resolve(res);
      });
    })
  },

}
export default collectModal;
