import React, { Component } from 'react';
import Env from 'rs-browser';
import back from '../../lib/scripts/back';
import Share from 'rs-hybrid-share';
import queryString from 'query-string';
import cs from 'classnames';
import { Toast } from 'antd-mobile';
import HybridBridge from 'rs-hybrid-bridge';
import Cookies from 'js-cookie';
import BigData from '../../lib/scripts/bigData';
// import 'video.js/dist/video.js'
// import 'video.js/dist/video-js.min.css'
import Footer from '../../lib/components/footer';
import { videoDetail } from '../../models/videoDetail';
import Concern from '../../lib/components/concern';
import Host from '../../lib/scripts/config_host';
import { formatTimes } from '../../lib/scripts/dateFormat';
import { playCounts, secondToDate } from '../../lib/scripts/commonFuns';
import AppDownloadTip from '../../lib/components/appDownloadTip';
import GetNativeInfo from '../../lib/scripts/getNativeInfo';

import style from './style.scss';
export default class Main extends Component {
  constructor(props) {
    super(props)
    this.point = new BigData()
    this.hybridBridge = new HybridBridge(window);
    this.handleBack = this.handleBack.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.concernBigData = this.concernBigData.bind(this);
    this.forwardConsultPage = this.forwardConsultPage.bind(this);
    this.getMid = this.getMid.bind(this);
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.state = {
      videoData: {
        cover: "",
        content: "",
        tags: "",
        createDate: "",
        videoUrl: "",
      },
      designerId: "",
      designerData: "",
      recommendsData: "",
      isPlay: false,
      mId: "",
    }

  }

  componentWillMount() {
    //PZ点家装设计师详情p
    //    this.point.p('110.300.49.58.68.78.33', 'deco', 'p_designBanner_video', 'p_designBanner_video', this.detailId);
    //    this.point.z('110.300.49.58.68.78.35', 'deco', 'p_design_video_info', 'p_design_video_info', this.detailId);
    this.loadingToast();
    videoDetail(this.detailId).then((res) => {
      this.setState({
        videoData: res.dataMap,
        designerData: res.dataMap.videoDesignerVo || "",
        recommendsData: res.dataMap.videoRecommendVos || "",
        initCollectData: true,
        designerId: res.dataMap.designerId,
        //收藏
        collect: {
          title: res.dataMap.title,
          sourceType: '31',
          channel: 'deco',
          picture: res.dataMap.cover
        },
      });
      Toast.hide();
      if (Env.rsApp) {
        const params =
          {
            tag: 66,
            "title": res.dataMap.title,
            "text": "",
            "image": res.dataMap.cover,
            "link": window.location.href,
            "videoID": this.detailId, //视频详情页id
            "videoUrl": res.dataMap.videoUrl,//视频播放地址
            "videoSize": res.dataMap.videoSize,
            "callType": 2//tag调用场景 0跳通用界面 1跳视频详情页 2传参调用
          }
        this.hybridBridge.hybrid('call_native', params)
      }
      this.share = {
        record: 'true',
        objectId: this.detailId,
        objectType: 'share_video',
        title: res.dataMap.title,
        img: res.dataMap.cover,
        link: window.location.href,
        text: "",
        record: true,
      }
    })
    this.getMid();
  }



  handleBack() {
    back();
  }

  loadingToast() {
    Toast.loading('加载中...', 10000, () => {
      console.log('加载完成!!!');
    });
  }

  toDesignerVideo(vid) {
    //PZ点家装设计师详情
    //this.point.f('110.300.49.58.68.78.81', 'deco', 'p_design_video_info', 'p_design_video_info', '', '', '', '', '', vid);
    if (Env.rsApp) {
      const paramNative = {
        tag: 66,
        "title": "",
        "text": "",
        "image": "",
        "link": `${Host.path}/mainapp/videoDetail.html?detailId=${vid}`,
        // "link":  `http://192.168.221.163:9000/videoDetail.html?detailId=${vid}`,
        "videoID": "", //视频详情页id
        "videoUrl": "",//视频播放地址
        "videoSize": "",
        "callType": 1//tag调用场景 0跳通用界面 1跳视频详情页 2传参调用
      }
      this.hybridBridge.hybrid('call_native', paramNative)
    } else {
      window.location = `${Host.path}/mainapp/videoDetail.html?detailId=${vid}`
    }

  }

  toDesignerDetail(dId) {
    //f点家装设计师详情
    this.point.f('110.300.49.58.68.78.82', 'deco', 'p_design_video_info', 'p_design_video_info', "", "", "", "", "", dId);

    if (Env.rsApp) {
      const paramter = {
        tag: 66,
        "title": "",
        "text": "",
        "image": "",
        "link": `${Host.path}/mainapp/designerNormalDetail.html?detailId=${dId}`,
        "videoID": "", //视频详情页id
        "videoUrl": "",//视频播放地址
        "videoSize": "",
        "callType": 0//tag调用场景 0跳通用界面 1跳视频详情页 2传参调用
      }
      this.hybridBridge.hybrid('call_native', paramter)
    } else {
      window.location = `${Host.path}/mainapp/designerNormalDetail.html?detailId=${dId}`
    }

  }

  handleShare() {
    const { headerPic, title, text, img, link, record, objectId, objectType } = this.share;
    new Share().open(title, text, img, link, record, objectId, objectType);
  }

  concernBigData() {
    this.point.f('110.300.49.58.68.78.86', 'deco', 'p_design_video_info', 'p_design_video_info', "", "", "", "", "", this.detailId, "");
  }

  playPause() {
    this.setState({
      isPlay: !this.state.isPlay
    })
    var video = document.getElementsByTagName('video')[0];
    if (video.paused) {
      video.play();
    }
    else {
      video.pause();
    }

    var that = this
    video.onended = function () {
      that.setState({
        isPlay: !that.state.isPlay
      })
    }
    this.point.f('110.300.49.58.68.78.42', 'deco', 'p_design_video_info', 'p_design_video_info', "", "", "", "", "", this.detailId, "");
  }

  getMid() {
    GetNativeInfo().then((nativeInfoRes) => {
      this.setState({
        mId: nativeInfoRes.hxiphoneUUID,
      })
    }).catch((e) => {
      console.log(e);
    });
  }

  forwardConsultPage() {
    console.log('ABtest');
    const { videoData, mId } = this.state;
    const labelPartVos = videoData.labelPartVos || [];
    let fromTags = [];
    if (labelPartVos.length > 0) {
      labelPartVos.map((item, index) => {
        if (index < 3) {
          return fromTags[index] = item.labelName;
        }
      })
    }
    //console.log('fromTags', fromTags.join(','));
    // Cookies.set('fromTitle', videoData.title);
    // Cookies.set('fromTags', fromTags.join(','));
    localStorage.setItem('fromTitle', videoData.title);
    localStorage.setItem('fromTags', fromTags.join(','));
    //跳入ABtest链接
    location.assign(`/api-jiazhuang/c/hxapp/style/styleTest?source=4_27008_app-spxqy-10001&mid=${mId}&back=h5&open=1`);
    // if (Host.path.indexOf('uat1') > -1) {
    //   location.href = `http://api-jiazhuang.uat1.rs.com/c/hxapp/style/styleTest?source=4_27008_app-spxqy-10001&mid=${mId}&back=h5&open=1`;
    // } else if(Host.path.indexOf('mklmall') > -1) {
    //   location.href = `https://api-jiazhuang.mklmall.com/c/hxapp/style/styleTest?source=4_27008_app-spxqy-10001&mid=${mId}&back=h5&open=1`;
    // } else if(Host.path.indexOf('mmall') > -1) {
    //   location.href = `https://api-jiazhuang.mmall.com/c/hxapp/style/styleTest?source=4_27008_app-spxqy-10001&mid=${mId}&back=h5&open=1`;
    // }
  }

  render() {
    const { cover, content, tags, createDate, title, videoUrl, lableIds, playCount, likeCount, labelPartVos } = this.state.videoData
    const { designerImg, designerName, designerId, workingHours, budget } = this.state.designerData
    const contentFilter = content.replace(/\.jpg/g, '.jpg.750x750.jpg');
    const labels = lableIds && labelPartVos.map((label, index) => {
      if (index > 2) {
        return;
      }
      return (
        <span className="label">
          <span className="text">{label.labelName}</span> <span className="cut">|</span>
        </span>
      )
    });
    let recommends
    console.log('data', this.state);
    console.log('label', labels);
    recommends = this.state.recommendsData && this.state.recommendsData.map((val, idx) => {
      return (
        <div className="recommendItem" key={idx} onClick={this.toDesignerVideo.bind(this, val.id)}>
          <div className="recommendPic" style={{ background: `url(${val.cover}.300x200.jpg)` }}>
            <div className="playTime">{secondToDate(val.videoTime)}</div>

          </div>
          <div className="recommendTitle">{val.title}</div>
        </div>
      )
    })
    return (
      <div className="img-center">
        <div className="wxPic"><img src={cover} alt="" /></div>
        {
          !Env.rsApp &&
          <AppDownloadTip />
        }
        <div className="wrapper">
          <div className={cs({
            "rsApp": Env.rsApp,
            "videoBox": true
          })}
          >
            {
              !Env.rsApp &&
              <video src={videoUrl}
                controls="controls"
                poster={cover}
                playsInline="true"
                ref={node => { this.videos = node }}
              >
              </video>
            }
            <div className={cs({ "playOpacity": this.state.isPlay, "playPause": true })}
              style={{ background: `url(${cover}) no-repeat` }}
              onClick={this.playPause.bind(this)}
            >
              <div className="playBtn"></div>
            </div>
          </div>

          <div className="contentBox">
            <div className="contentDesc">
              <div className="contentTitle">{title}</div>
              <div className="contentInfo">
                <div className="tags">
                  {labels}
                </div>
                <div className="contentTime">{formatTimes(createDate, 2)}</div>
                <div className="videoCount">
                  <div>{playCount && playCounts(playCount) || 0}</div>
                  <div>{likeCount && playCounts(likeCount) || 0}</div>
                </div>
              </div>
            </div>


            <div className={this.state.designerData ? "designerInfo" : "dis"}>
              <div className="designerPic" style={{ background: `url(${designerImg})` }} onClick={this.toDesignerDetail.bind(this, designerId)}></div>
              <div className="designerInfos" onClick={this.toDesignerDetail.bind(this, designerId)}>
                <div>{designerName}</div>
                <div>
                  <span>从业{workingHours}</span>
                  <span>{budget}元/m²</span>
                </div>
              </div>
              <div className="designerBtn" >
                {
                  Env.rsApp &&
                  <Concern id={this.state.designerId} initConcernData={true} concernBigData={this.concernBigData} />
                }
              </div>
            </div>

            <div className="content com-rich-text" dangerouslySetInnerHTML={{ __html: contentFilter }}>

            </div>
          </div>

          <div className={!!recommends ? "recommend" : "dis"}>
            <div className="recommendWords">
              相关视频
            </div>
            <div className="recommendBox">
              {recommends}
            </div>
          </div>

        </div>
        {
          Env.rsApp &&
          <Footer type="review_designer_video"
            id={this.detailId}
            collect={this.state.collect}
            f={this.props.f}
            initCollectData={this.state.initCollectData}
            likeType="designer_video_liked"
            forwardConsultPage={this.forwardConsultPage}
          />
        }

      </div>
    )
  }
}



