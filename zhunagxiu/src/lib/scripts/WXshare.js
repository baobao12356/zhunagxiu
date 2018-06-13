/**
 * Created by feifei on 2017/10/31.
 */
import Http from './http';


export default class WXshare {

  WXshareInfo(params) {
    const share = {
      title: params.title || '',
      des: params.text || '',
      logo: params.img || ''
    };
    Object.assign(share, params);

    try {
      let ua = navigator.userAgent.toLowerCase();
      let url = String(window.location);
      //判断是否在微信浏览器
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {

        Http.post('https://m-api-longguo.mmall.com/weixin/jssdkConfig', {
          body: {
            url: url
          }
        }, '', '', '', false).then((data) => {
          if (!!data && data.dataMap != '' && data.dataMap != 'undefined') {
            wx.config({
              debug: false,
              appId: data.dataMap.appId,
              timestamp: data.dataMap.timestamp,
              nonceStr: data.dataMap.nonceStr,
              signature: data.dataMap.signature,
              jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
              ]
            });
          }
        });
      }
    }
    catch (e) {
      console.log('请求微信配置接口不成功')
    }
    try {
      let url = String(window.location);

      wx.ready(function () {
        wx.onMenuShareAppMessage({    //分享给朋友
          title: share.title, desc: share.des, link: url, imgUrl: share.logo,
          success: function () { }
        });
        wx.onMenuShareTimeline({      //分享到朋友圈
          title: share.title, desc: share.des, link: url, imgUrl: share.logo,
          success: function () { }
        });
        wx.onMenuShareQQ({            //分享到qq
          title: share.title, desc: share.des, link: url, imgUrl: share.logo,
          success: function () { }
        });
        wx.onMenuShareWeibo({         //分享到微博
          title: share.title, desc: share.des, link: url, imgUrl: share.logo,
          success: function () { }
        });
        wx.onMenuShareQZone({         //分享到qq空间
          title: share.title, desc: share.des, link: url, imgUrl: share.logo,
          success: function () { }
        });
      });
      wx.error(function (res) {
        //alert(res.errMsg);  //打印错误消息。把debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
      });
    }
    catch (e) { }

  }
}

