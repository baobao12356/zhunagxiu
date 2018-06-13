import Http from '../lib/scripts/http'
let ActiveModel  = {
  ActiveJoin(phone,actId) {
    return new Promise((resolve, reject) => {
      Http.post(`/api-jiazhuang/c/activityUser/dRegistration`,{
        body:{
          "userName": "体验设计师报名活动",	//			(M)用户称呼
          "userMobile": phone,	//	(M)用户手机号
          "activityId": actId,					//(M)活动ID
          "sourceFrom": "25900",		//	(M)报名来源，用于区分渠道
          "applicationTerminal": 2,		//	(M)应用端(pc:1,app:2)
          "singupType": 1,				//	(M)报名类型；1活动报名，2定向报名
          "isGeneralActivity":"1"
        }
      }).then(data => {
        resolve(data);
      })
    });
  }
};
export default ActiveModel;
