import Http from '../lib/scripts/http';
import queryString from 'query-string'
import 'whatwg-fetch';
let CaseList = {
  GetCaseList(bizId=2001,PageNo = 1, designStyle='', houseCategory='',range='',sort='',companyId='') {

    //  designStyle?`designerStyle:${designStyle};`:"";
    //  houseCategory?`houseCategory:${houseCategory}`:"";

    //  const tags=designStyle+houseCategory;
     /*const tags=( companyId?(`city_code:${companyId};`):"")+( designStyle?(`designerStyle:${designStyle};`):"")+(houseCategory?(`houseCategory:${houseCategory}`):"");
     const sorts=sort?sort:('designerPrice:desc;weightValue:desc');
     const ranges=(`caseCount:3;`)+(range?(`designerPrice:${range}`):'');
     const not='level:7';*/

    return new Promise((resolve, reject) => {
      Http.get(`/api-search/query?bizId=${bizId}&pageNo=${PageNo}&pageSize=10&tags=serviceType:2or3`).then((res) => {
        resolve(res);
      });





    // fetch(`http://search.uat1.rs.com/query?bizId=${bizId}&pageNo=${PageNo}&pageSize=10&tags=${tags}&ranges=${ranges}&sort=${sorts}`,{
    //    method:'get',
    //    mode: 'cors',
    // }).then((res)=>{
    //         res.json()
    // }).then((value) => {
    //   console.log('value///////////////////////',value);
    //   resolve('value...........',value);
    // })



    })
  },

  getBabel(){
    return new Promise((resolve, reject) => {
        Http.get(`/api-jiazhuang/c/hxapp/data/getMany?typeIds=13%2C137`).then((res) => {

        console.log(res);
        resolve(res);
      });


    //   fetch(`http://api-jiazhuang.uat1.rs.com/c/hxapp/data/getMany?typeIds=13%2C137`,{
    //     method:'get',
    //  }).then((value) => {
    //    console.log(res);
    //    resolve(res);
    //  })


    })
  },
  getHxappCities() {
    return new Promise((resolve, reject) => {
      Http.get(`/api-jiazhuang/c/hxapp/hxCity/hxCityList`).then((data) => {
        resolve(data);//返回成功数据
        console.log(data)
      });
    })
  }
};
  export default CaseList;
