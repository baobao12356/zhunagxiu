import Http from '../lib/scripts/http'
let HonorDetailModel = {
  HonorDetail(honorId) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/designer/honorDetail/${honorId}`).then((res) => {
        resolve(res);
      });
    })
  }
};
export default HonorDetailModel;
