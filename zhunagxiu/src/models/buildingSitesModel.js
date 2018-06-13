import Http from '../lib/scripts/http';

let buildingSitesModel = {
  //获取施工中节点数据
  getConstructItemFirst(constructId) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/hxapp/construct/itemFirst/${constructId}`;
      Http.get(url).then((res) => {
        console.log(res);
        resolve(res);
      });
    });
  },
  //获取施工中节点支付状态
  myHomeFetchConstructionAgreePay(constructId) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/hxapp/construct/payment`;
      Http.get(url).then((res) => {
        console.log(res);
        resolve(res);
      });
    });
  },

  myhomeFetchStatusById(id) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/hxapp/construct/status`;
      Http.get(url).then(res => {
        resolve(res);
      })
    })
  },

  //工地详情基本信息
  myHomeFetchConstructionById(constructId) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/hxapp/construct/info/${constructId}`;
      Http.get(url).then(res => {
        resolve(res);
      })
    })
  }
};
export default buildingSitesModel;
