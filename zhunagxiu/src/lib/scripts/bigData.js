import Env from 'rs-browser';
import QueryString from 'query-string';
import Host from './config_host';
import GetUserInfo from './getUserInfo';
import GetNativeInfo from './getNativeInfo';


export default class BigData {
  constructor() {
    console.log('bigData');
    this.loadData = BigData.loadData();
    this.params = BigData.param();
    this.id = QueryString.parse(location.href.split('?')[1]).id || QueryString.parse(location.href.split('?')[1]).detailId || QueryString.parse(location.href.split('?')[1]).listId
  }

  static loadData() {
    return new Promise((resolve, reject) => {
      if (!window.data) {
        const headObj = document.querySelector('head');
        const scriptObj = document.createElement('script');
        scriptObj.onload = () => {
          resolve();
        };
        scriptObj.onerror = () => {
          reject(new Error('大数据方法加载失败'));
        };
        scriptObj.src = `${Host.path.replace(/:\/\/\w+./, '://aureuma.')}/js/aureuma.data.min.js`;
        headObj.appendChild(scriptObj);
      } else {
        resolve();
      }
    });
  }

  static param() {
    return new Promise((resolve, reject) => {
      //p z f 点公用参数
      const param = {
        p_url: location.href,
        u_id: '',
        u_guid: '',
        app_v: '',
        u_mid: ''
      };

      GetUserInfo().catch((e) => {
        console.log(e);
      }).then((res) => {
        GetNativeInfo().catch((e) => {
          console.log(e);
        }).then((data) => {
          //native数据
          if (data) {
            if ( data.ShowCityName ) {
              param.u_city = data.ShowCityName;
            }
            if (data.hxiphoneUUID) {
              param.u_guid = param.u_mid = data.hxiphoneUUID;
            }
            if (data.version) {
              param.app_v = data.version;
            }
            if (data.appFrom) {
              param.app_b = data.appFrom;
            }
            if (!Env.rsApp) {
              param.r_url = sessionStorage.h5_rurl ? sessionStorage.h5_rurl : location.href;
            } else {
              param.r_url = data.nativeRUrl;
            }
          }

          //用户信息
          if (res && res.openid) {
            param.u_guid = param.u_id = res.openid;
          }
          resolve(param);
        });
      }).catch((e) => {
        console.log(e);
        reject();
      });
    });
  }

  p(page, channel, type, title = '', id = this.id, domain = 'mmall.com') {
    const _this = this;
    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        page:page,
        service: 'h5.pvuv'
      };
      Object.assign(temp, params);
      window.data.pageAndUserView(temp);
      console.log('p', temp);
    }).catch((e) => {
      console.log(e);
    }).then(() => {
      sessionStorage.h5_rurl = location.href;
    });
  }

  z(page, channel, type, title = '', id = this.id, domain = 'mmall.com') {
    console.log('enter z');
    const _this = this;
    const start = Date.now();

    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        page,
        service: 'h5.staytime'
      };
      Object.assign(temp, params);

      function viewTime() {
        temp.p_stay_time = Date.now() - start;
        window.data.pageViewTime(temp);
        console.log('z', temp);
      }

      if (/\.html\//.test(location.href) && location.href.indexOf('?') > 0 && !location.search) {
        window.onpopstate = viewTime;
      } else {
        window.onunload = viewTime;
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  pz(page, channel, type, title, id, domain) {
    this.p(page, channel, type, title, id, domain);
    this.z(page, channel, type, title, id, domain);
  }

  f(page, channel, type, title, item, actionId = '', action = '', actionPos = '', actionTol = '', id = this.id, domain = 'mmall.com') {
    const _this = this;
    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        page,
        p_item: item,
        p_action_id: actionId,
        p_action: action,
        p_action_pos: actionPos,
        p_action_total: actionTol,
        service: 'h5.click'
      };
      Object.assign(temp, params);
      window.data.clickEvent(temp);
      console.log('f', temp);
    }).catch((e) => {
      console.log(e);
    });
  }

  s(page, channel, type, title = '', id = this.id, domain = 'mmall.com'){
    console.log('enter s');
    const _this = this;
    let maxScrollTop = 0;
    window.addEventListener('scroll', function () {
      if (maxScrollTop < document.body.scrollTop) {
        maxScrollTop = document.body.scrollTop
      }
    });

    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        d_prixel_x:window.screen.width,
        d_prixel_y:window.screen.height,
        page,
        service: 'h5.s'
      };
      Object.assign(temp, params);

      function maxScrollTopFn() {
        temp.p_length = maxScrollTop;
        temp.p_scene_nb = maxScrollTop/(screen.availHeight);
        window.data.viewScreenNumber();
        console.log('s', temp);
        console.log('前序页面最大滚动距离' + maxScrollTop);

      }

      if (/\.html\//.test(location.href) && location.href.indexOf('?') > 0 && !location.search) {
        window.onpopstate = maxScrollTopFn;
      } else {
        window.onunload = maxScrollTopFn;
    }
    }).catch((e) => {
      console.log(e);
    })

  }

  pzs(pageP, pageZ, pageS, channel, type, title, id, domain='mmall.com') {
    const _this = this;
    console.log('enter pzs');
    const start = Date.now();

    _this.p(pageP, channel, type, title, id, domain);

    let maxScrollTop = 0;
    window.addEventListener('scroll', function () {
      if (maxScrollTop < document.body.scrollTop) {
        maxScrollTop = document.body.scrollTop
      }
    });

    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp1 = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        d_prixel_x:window.screen.width,
        d_prixel_y:window.screen.height,
        page: pageS,
        service: 'h5.s'
      };
      Object.assign(temp1, params);

      function maxScrollTopFn() {
        temp1.p_length = maxScrollTop;
        temp1.p_scene_nb = maxScrollTop/(screen.availHeight);
        window.data.viewScreenNumber(temp1);
        console.log('s', temp1);
        console.log('前序页面最大滚动距离' + maxScrollTop);
      }

      const temp2 = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        page: pageZ,
        service: 'h5.staytime'
      };
      Object.assign(temp2, params);

      function viewTime() {
        temp2.p_stay_time = Date.now() - start;
        window.data.pageViewTime(temp2);
        console.log('z', temp2);
      }

      if (/\.html\//.test(location.href) && location.href.indexOf('?') > 0 && !location.search) {
        window.onpopstate = function(){
          maxScrollTopFn();viewTime();
        }
      } else {
        window.onunload = function(){
          maxScrollTopFn();viewTime();
        }
      }
    }).catch((e) => {
      console.log(e);
    })

  }



}
