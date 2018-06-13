import Http from '../../lib/scripts/http'
import Host from '../../lib/scripts/config_host'

let praiseModal = {
  getPraiseNum(praiseData) {
    return new Promise((resolve, reject) => {
      const url = '/api-alibi/api/review/common/likedCount';
      Http.post(url, {
        body: {
          "id": praiseData.id,
          "type": praiseData.type,
          "userId": praiseData.userId,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        resolve(res);
      });
    })
  },

}
export default praiseModal;
