import Http from '../lib/scripts/http';

let caseListModel = {
  caseList(pageNo, companyId) {
    return new Promise((resolve) => {
      const url = `/api-jiazhuang/c/supervisor/company/caseList?pageNo=${pageNo}&pageSize=10&companyId=${companyId}`;
      Http.get(url).then((res) => {
        console.log(res);
        resolve(res);
      });
    });
  }
};
export default caseListModel;
