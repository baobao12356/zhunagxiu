/**
 * Created by feifei on 2017/9/17.
 */
import Http from '../lib/scripts/http';


let styleInfoModel = {
  StyleInfo() {
    return new Promise((resolve) => {
      const url = '/api-jiazhuang/c/hxapp/style/info';
      Http.get(url).then((res) => {
        console.log(res)
        resolve(res);
      });
    });
  }
};
export default styleInfoModel;

