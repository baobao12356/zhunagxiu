import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import queryString from 'query-string';
import HybridBridge from 'rs-hybrid-bridge';
import Nav from '../../lib/components/nav';
import VideoContent from '../../lib/components/videoContent';
import DefaultUser from '../../lib/components/defaultUser';
import Host from '../../lib/scripts/config_host';
import GetNativeInfo from '../../lib/scripts/getNativeInfo';
import { judgeVersion } from '../../lib/scripts/judgeVersion';
import ResizeImg from '../../lib/scripts/resizeImg';
import {playCounts} from '../../lib/scripts/commonFuns';
import { fetchVideoList, fetchDiaryList, fetchArticleList, fetchEncyclopediaList } from '../../models/designConsultResultModel';
import './style.scss';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.source = params.source;
    this.fetchVideoList = this.fetchVideoList.bind(this);
    this.fetchDiaryList = this.fetchDiaryList.bind(this);
    this.fetchArticleList = this.fetchArticleList.bind(this);
    this.fetchEncyclopediaList = this.fetchEncyclopediaList.bind(this);
    this.fetchRecommendData = this.fetchRecommendData.bind(this);
    this.displayRecommend = this.displayRecommend.bind(this);
    this.forwardPage = this.forwardPage.bind(this);
    this.goToNativePage = this.goToNativePage.bind(this);
    this.getAppVersion = this.getAppVersion.bind(this);
    this.hybridBridge = new HybridBridge(window);
    this.state = {
      recommendData: [],
      version: true
    }
  }

  componentDidMount() {
    this.fetchRecommendData();
    this.getAppVersion();

  }

  getAppVersion() {
    if (Env.rsApp) {
      GetNativeInfo().then((data) => {
        if (data && data.version) {
          if (!judgeVersion(data.version, '3.4.0')) { //版本小于3.4.0，不显示更多按钮
            this.setState({
              version: false
            });
          }
        }
      });
    }
  }

  fetchRecommendData() {
    if (this.source == 1) { //百科
      this.fetchEncyclopediaList();
    } else if (this.source == 2) { //文章
      this.fetchArticleList();
    } else if (this.source == 3) { //业主日记
      this.fetchDiaryList();
    } else if (this.source == 4) { //视频
      this.fetchVideoList();
    }
  }
  //获取推荐视频列表
  fetchVideoList() {
    fetchVideoList(1, 4).then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          recommendData: res.dataMap.records
        });
      }
    })
  }
  //获取推荐业主日记列表
  fetchDiaryList() {
    fetchDiaryList(1, 4).then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          recommendData: res.dataMap.records
        });
      }
    })
  }
  //获取推荐文章列表
  fetchArticleList() {
    fetchArticleList(1, 4).then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          recommendData: res.dataMap.records
        });
      }
    })
  }
  //获取推荐百科列表
  fetchEncyclopediaList() {
    fetchEncyclopediaList(1, 4).then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          recommendData: res.dataMap.records
        });
      }
    })
  }

  forwardPage(id) {
    if (this.source == 1) {
      window.location = `${Host.path}/mainapp/pediaDetail.html?detailId=${id}&back=h5&__open=1`;
    } else if (this.source == 2) {
      window.location = `${Host.path}/mainapp/articleDetail.html?detailId=${id}&back=h5&__open=1`;
    } else if (this.source == 3) {
      window.location = `${Host.path}/mainapp/decoDiaryDetails.html?detailId=${id}&back=h5&__open=1`;
    } else if (this.source == 4) {
      if (Env.rsApp) {
        const paramNative = {
          tag: 66,
          "title": "",
          "text": "",
          "image": "",
          "link": `${Host.path}/mainapp/videoDetail.html?detailId=${id}&__open=1`,
          "videoID": "", //视频详情页id
          "videoUrl": "",//视频播放地址
          "videoSize": "",
          "callType": 1//tag调用场景 0跳通用界面 1跳视频详情页 2传参调用
        }
        this.hybridBridge.hybrid('call_native', paramNative)
      } else {
        window.location = `${Host.path}/mainapp/videoDetail.html?detailId=${id}&back=h5&__open=1`;
      }
    }
  }

  //跳到native页面
  goToNativePage(type) {
    let dataNative = {};
    if (type == 1) { //我的预约
      dataNative = {
        tag: '81',
      };
    } else if (type == 2 && this.source == 1) { //百科列表
      dataNative = {
        tag: '80',
      };
    } else if (type == 2 && this.source == 2) { //美文列表
      dataNative = {
        tag: '79',
      };
    } else if (type == 2 && this.source == 4) { //视频列表
      dataNative = {
        tag: '78',
      };
    } else if (type == 2 && this.source == 3) { //业主日记列表
      dataNative = {
        tag: '71',
      };
    }
    //console.log(JSON.stringify(dataNative));
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  //展示推荐内容
  displayRecommend() {
    const { recommendData } = this.state;
    let recommendContent = '';
    if (this.source == 1) { //百科
      recommendContent = recommendData.map((item, index) => {
        return (
          <div className="encyItem" key={index} onClick={() => { this.forwardPage(item.id) }}>
            <div className="encyText">
              <div className="encyTitle">{item.title}</div>
              <div className="encyInfo">{item.description}</div>
              {/*<div className="encyTag">{item.tag}</div>*/}
            </div>
            <div className="encyImg"><img src={ResizeImg(item.cover, '280', '210', '!')} /></div>
          </div>
        );
      });
    } else if (this.source == 2) { //文章
      recommendContent = recommendData.map((item, index) => {
        const lables = item.lables || [];
        console.log(lables);
        const tag = lables.map((tag, idx) => {
          return (
            <span key={idx}>{tag}</span>
          );
        });
        return (
          <div className="artItem" key={index} onClick={() => { this.forwardPage(item.articleId) }}>
            <div className="artImg"><img src={ResizeImg(item.cover, '690', '390', '!')} /></div>
            <div className="artTitle">{item.title}</div>
            <div className="artInfo">
              <div className="artTag">
                {tag}
              </div>
              <div className="artNumber">
                <div className="look">{item.pvCnt}</div>
                <div className="praise">{item.likeCnt}</div>
              </div>
            </div>
          </div>
        );
      });
    } else if (this.source == 3) { //业主日记
      recommendContent = recommendData.map((item, index) => {
        return (
          <div className="artItem" key={index} onClick={() => { this.forwardPage(item.id) }}>
            <div className="artImg">
            <div className="stage">{item.stage}</div>
              <img src={ResizeImg(item.cover, '690', '390', '!')} />
              <div className="designerImg"><img src={ResizeImg(item.designerAvatar, '60', '60', '!')} /></div>
            </div>
            <div className="artTitle">{item.title}</div>
            <div className="artInfo">
              <div className="artTag">
                {item.amount != 0 && <span>{item.amount}万</span>}
                {item.area != 0 && <span>{item.area}㎡</span>}
                <span>{item.houseType}</span>
                {item.decStyle && <span>{item.decStyle}</span>}
              </div>
            </div>
          </div>
        );
      });
    } else if (this.source == 4) { //视频
      recommendContent = recommendData.map((item, index) => {
        return (
          <div className="artItem" key={index}>
            <div className="artImg">
              <VideoContent poster={ResizeImg(item.cover, '690', '390', '!')} videoSrc={item.shortVideo ? item.shortVideo : item.longVideo} /> </div>
            <div onClick={() => { this.forwardPage(item.id) }}>
              <div className="artTitle"  >{item.title}</div>
              <div className="artInfo">
                <div className="artTag">
                  <span>{item.label}</span>
                </div>
                <div className="artNumber">
                  <div className="play">{playCounts(item.playCount)}</div>
                  <div className="praise">{item.likeCount}</div>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    return recommendContent;
  }

  render() {
    const { recommendData, version } = this.state;
    //const look = version && <div className="btn" onClick={() => { this.goToNativePage(1) }}>查看详情</div>
    const more = version && <div className="more" onClick={() => { this.goToNativePage(2) }}>更多</div>
    return (
      <div className={cs({ 'pageWrap': true, 'ios-top': Env.ios && Env.rsApp, 'img-center': true })}>
        <Nav title="预约成功" shareIcon={false} />
        <div className="successBox">
          <div className="successImg"></div>
          <div className="successText">预约成功</div>
          <div className="successTip">预计客服将于24小时内电话联系您请保持电话畅通</div>
          {
            //look
          }
        </div>
        <div className="recommenBox">
          <div className="recommenTitle">
            <div className="titleText">你可能还感兴趣的内容</div>
            {more}
          </div>
          <div className="recommenContent">
            {this.displayRecommend()}

          </div>
        </div>
      </div>

    );
  }
}
