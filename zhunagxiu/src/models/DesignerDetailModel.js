import Http from '../lib/scripts/http'
let  CaseDetailModel = {
  ReceiveDesignerDetail(designerId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/designer/info/v2/${designerId}`).then((res) => {
        resolve(res);
      });
    })
  },

  ReceiveActiveDetail() {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/activity/detail`).then((res) => {
        resolve(res);
      });
    })
  }
};
export default CaseDetailModel;
