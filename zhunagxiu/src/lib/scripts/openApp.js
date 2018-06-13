import Env from 'rs-browser';
import QueryString from 'query-string';
import OS from 'rs-os';
import onfire from 'onfire.js';
import config from './config_host';

export default class OpenApp {

  static iphoneSchema = 'com.redstar.HXMain://';
  static androidSchema = 'app://com.redstar.mainapp?source=html';
  static iphoneDownUrl = 'https://itunes.apple.com/us/app/hong-xing-mei-kai-long-man/id1149794926?l=zh&ls=1&mt=8';
  static androidDownUrl = 'http://shouji.baidu.com/software/10228254.html';

  constructor(selector = '#btnOpenApp') {

    this.loadData = OpenApp.loadData();

    this.appLink = OpenApp.splitParam();

    this.mParams = this.mLinkParams(selector);

    if (!this.mParams.length) {
      if (location.href.indexOf('localhost:') >= 0) {
        //alert('没有查找到元素');
      }
      return;
    }

    OpenApp.loadData().then(() => {
      this.open();
    });
  }

  static loadData() {
    return new Promise((resolve, reject) => {
      if (!window.Mlink || !(Env.ios && parseInt(OS.version) > 8)) {
        const headObj = document.querySelector('head');
        const scriptObj = document.createElement('script');
        scriptObj.onload = () => {
          resolve();
        };
        scriptObj.onerror = () => {
          reject(new Error('mlink.js加载失败'));
        };
        scriptObj.src = 'https://static.mlinks.cc/scripts/dist/mlink.min.js';
        headObj.appendChild(scriptObj);
      } else {
        resolve();
      }
    });
  }

  static splitParam() {
    let temp = '?&source=html&HXTargetPage=';
    let locUrl = window.location.href.toString();
    //h5页面
    if (locUrl.indexOf('mainapp') > -1) {
      temp += `Html5Page&Html5PageUrl=${encodeURIComponent(locUrl)}`;

      //native页面
    } else if (locUrl.indexOf('orderForm') > -1) {
      temp += 'OrderListPage';
    } else if (locUrl.indexOf('orderObligation') > -1) {
      let urlParam = QueryString.parse(locUrl.split('?')[1]);
      temp += 'OrderDetailPage&detailId=' + urlParam.id + '&orderType=' + urlParam.type;

      //首页
    } else {
      if (Env.ios) {
        temp = '';
      } else {
        temp = '?&source=html';
      }
    }
    console.log(temp)
    return temp;
  }

  mLinkParams(selector) {
    let openEles = document.querySelectorAll(selector);
    let params = [];
    let len = openEles.length;
    let i = 0;
    let mlinkUrl = 'AKgp' + this.appLink;
    console.log(mlinkUrl)
    for (; i < len; i++) {
      if (openEles[i].tagName.toLowerCase() != 'a') {
        if (location.href.indexOf('localhost:') >= 0) {
          //alert('仅支持使用a标签打开app');
        }
        continue;
      }
      params.push({
        mlink: mlinkUrl,
        button: openEles[i]
      });
    }
    return params;
  }

  open() {
    for (let param of this.mParams) {
      //ios >= 9 微信浏览器
      if (Env.ios && parseInt(OS.version) >= 9 && Env.weiXin) {
        this.loadData.then(() => {
          param.button.addEventListener('touchstart', () => {
            let openLink = window.location.href;
            window.location.href = `https://wap.mmall.com/QR_code?version=30015&channel=66554&source=html&HXTargetPage=Html5Page&Html5PageUrl=${openLink}`;
          }, false);
        });

      } else {
        param.button.addEventListener('touchstart', () => {
          //android 微信 + 微博
          if (Env.weixin || Env.weiboApp || Env.qqApp) {
            onfire.fire('appDownloadWxTipShow');

            //ios
          } else if (Env.ios) {
            try {
              let openLink = window.location.href;
              window.location.href = `https://wap.mmall.com/QR_code?version=30015&channel=66554&source=html&HXTargetPage=Html5Page&Html5PageUrl=${openLink}`;
            } catch (e) { }
            const loadDateTime = new Date();
            window.setTimeout(function () {
              const timeOutDateTime = new Date();
              if (timeOutDateTime - loadDateTime < 4000 && location.href.indexOf(OpenApp.iphoneSchema) == -1) {
                window.location.href = `${config.hostname}/QR_code?version=30015&channel=30002&share=app`;
              } else {
                window.close();
              }
            }, 2000);

            //安卓
          } else {
            try {
              //alert(OpenApp.androidSchema + this.appLink)
              let openLink = window.location.href;
              window.location.href = `${OpenApp.androidSchema}&HXTargetPage=Html5Page&Html5PageUrl=${openLink}`;
              setTimeout(function () {
                window.location.href = `${config.hostname}/QR_code?version=30015&channel=30002&share=app`;
              }, 2500);
            } catch (e) { }
          }
        }, false);
      }
    }
  }
}
