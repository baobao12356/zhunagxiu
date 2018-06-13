import Http from '../lib/scripts/http';

let supervisionOrderModel = {
  supervisionOrder(userName, userMobile, cityCode) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/hxapp/activityForUser/dRegistration`;
      Http.post(url, {
        body: {
          "userName": userName,
          "userMobile": userMobile,
          "activityId": 29,
          "sourceFrom": "25009",
          "applicationTerminal": 2,
          "singupType": 1,
          "isGeneralActivity": "1",
          "pageFrom": "app-dsfjl-10001",
          "cityCode": cityCode
        }
      }).then((res) => {
        console.log(res);
        resolve(res);
      });
    });
  },
  cityList() {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/hxapp/hxCity/v3/hxCityList`;
      Http.get(url).then((res)=> {
        console.log(res);
        resolve(res);
      })
    })
  },
  companyList(locationCode) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/supervisor/company/list?locationCode=${locationCode}&pageNo=1&pageSize=50`;
      Http.get(url).then((res) => {
        console.log(res);
        resolve(res);
      });
    });
  }
};
export default supervisionOrderModel;
