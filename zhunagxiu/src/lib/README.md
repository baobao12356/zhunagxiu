p-aurora-component用于h5公用组件开发
scripts存放公用方法
components存放组件，零售部分所有组件都可放在该目录下，修改已有组件的需兼容已调用过的地方
library存放第三方组件

scripts中包含以下方法：
back.js -- 兼容浏览器和app的返回方法
           使用方法：
           import Back from 'path/back';
           Back();

bigData.js -- app端埋点方法，之后会做浏览器端兼容
		   使用方法：
           import BigData from 'path/BigData';
           let point = new BigData();
           point.pz(params);  //埋p点+z点
           point.p(params);  //埋p点
           point.z(params);  //埋z点
           point.f(params);  //埋f点

config_host.js -- 全局变量
		   使用方法：
           import Config from 'path/config_host';

flexible.js -- 适配方案

getNativeInfo.js --从app中拿静态数据的方法(app版本、设备序列号等)
		   使用方法：
           import GetNativeInfo from 'path/getNativeInfo';
           GetNativeInfo.then((res) => {
               ...
           }).catch((e) => {
           	   ...
           });

getUserInfo.js -- 从app中拿用户信息的方法，之后会做浏览器端兼容
		   使用方法：
           import GetUserInfo from 'path/getUserInfo';
           GetUserInfo.then((res) => {
               ...
           }).catch((e) => {
           	   ...
           });

http.js -- 兼容app和浏览器的fetch方法，目前仅支持get和post请求
		   使用方法：
           import Http from 'path/http';
           Http.get(url[, params], errorCallback); 
           Http.post(url, params, errorCallback); 
           url 必填，string
           params 可选，object，参考whatwg-fetch官方文档，Content-Type默认为application/json
           errorCallback 可选，function，接口报错的回调

login.js -- app中跳转登录页的方法，之后会做浏览器端兼容
			使用方法：
            import Login from 'path/login';

resizeImg.js -- 图片裁切方法，从接口拿到的图片都要进行裁切（富文本中的图片除外）
			使用方法：
            import ResizeImg from 'path/resizeImg';
            ResizeImg(src, width, height, mark, pos);
            src string，必填
            width string，必填
            height string，必填
            mark ''/'!'，选填，默认为空字符串，图片是否带水印
            pos 'x'/'@'，选填，默认为x，规定图片裁切起点
            返回进过处理的图片地址

iscroll_up_down -- 基于iscroll-probe封装的上拉加载，下拉刷新方法






components中包含以下组件：

artCommentList -- 推荐文章列表
collect -- 收藏
defaultImg -- 理论上页面中要显示图片的地方都要设置默认图占位，该组件提供此功能
defaultUser -- 理论上页面中要显示人物图片的地方都要设置默认图占位，该组件提供此功能
footer -- 通用页面底部bar
goodsList -- 商品列表
like -- 点赞
loopBanner -- 对antd-designer轮播图的二次封装
nav -- 通用nav
pageView -- 文章/图集等浏览量
recoArt -- 推荐文章
richText -- 富文本内容展示组件
tags -- 展示按钮形状的标签列表
videoContent -- 展示播放video的组件，因video标签有兼容问题，建议使用此组件
comment -- 评论

组件的具体使用在代码中均有详细注释，可参考






library中包含以下组件/方法：
imgGallery -- 图片缩放功能，支持传入自定义dom结构
pullDownUp -- 简单的上拉加载，下拉刷新组件

具体使用在代码中均有详细注释，可参考
           

