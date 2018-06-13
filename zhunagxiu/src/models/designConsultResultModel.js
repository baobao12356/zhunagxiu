import Http from '../lib/scripts/http';

let consultRecommendModel ={
  fetchVideoList(pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/video/list?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => {
        resolve(res);
      });
    })
  },
  fetchDiaryList(pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/owner/list?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => {
        resolve(res);
      });
    })
  },
  fetchArticleList(pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/article/pageList?pageNum=${pageNo}&pageSize=${pageSize}`).then((res) => {
        resolve(res);
      });
    })
  },
  fetchEncyclopediaList(pageNo, pageSize) {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/encyclopedia/pageList?pageNum=${pageNo}&pageSize=${pageSize}`).then((res) => {
        resolve(res);
      });
    })
  },
  consultOrder(consultData) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/hxapp/activityForUser/dRegistration`;
      Http.post(url, {
        body: {
          "userName": consultData.userName,
          "userMobile": consultData.userMobile,
          "activityId": 29,
          "sourceFrom": consultData.sourceFrom,
          "applicationTerminal": 2,
          "singupType": 1,
          "isGeneralActivity": "1",
          "pageFrom": consultData.pageFrom,
          "cityCode": consultData.cityCode,
          "houseArea": consultData.houseArea,
          "buildTime": consultData.visitDate,
          "styleNames":consultData.styleNames,
          "fromTitle": consultData.fromTitle,
          "fromTags": consultData.fromTags,
          "clientBudget":consultData.clientBudget
        }
      }).then((res) => {
        console.log(res);
        resolve(res);
      });
    });
  },
};
 export default consultRecommendModel;
