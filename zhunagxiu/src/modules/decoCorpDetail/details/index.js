import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import GetUserInfo from '../../../lib/scripts/getUserInfo';
import { getSessionId } from '../../../core/AuthUtil';
import BigData from '../../../lib/scripts/bigData';
import Banner from './banner';
import CorpDetailModel from '../../../models/CorpDetailModel';
import CorpBasicInfo from './corpBasicInfo';
import CorpAllInfo from './corpAllInfo';
//import CorpScoreInfo from './corpScoreInfo';
import BottomInfo from './bottomInfo';
import Designers from './designers';
import Cases from './cases';
import Diaries from './diaries';
import NavTrans from '../../../lib/components/navTrans';
import Appoint from '../../../lib/components/appoint';
import Host from '../../../lib/scripts/config_host';
import WXshare from '../../../lib/scripts/WXshare';
import LoadingImage from '../img/loading.gif';
import EvaluateStars from '../../../lib/components/evaluateStars';
import './style.scss';
import '../../../lib/scss/base.scss';
import 'swiper/dist/css/swiper.css'


export default class Details extends React.Component {
  constructor(props) {
    super(props);

    const params = queryString.parse(location.search);
    this.detailId = params.detailId || "";
    this.isAppEntry = params.app;
    this.state = {
      detailInfo: {},
      objectType: '',
      share: {},
      companyName: '',
      initShareData: false,
      webPadding: false,
      showBottomInfo: false,
      bottomInfoType: 'sale',
      playing: false,
      aboutUs: false,
      position: 0,
      positionBlock: false,
      couponList: [],
      activityData: {},
    };
    this.showSale = this.showSale.bind(this);
    this.showShops = this.showShops.bind(this);
    this.hideBottomInfo = this.hideBottomInfo.bind(this);
    this.clickAppoint = this.clickAppoint.bind(this);
    this.doPlay = this.doPlay.bind(this);
    this.aboutUs = this.aboutUs.bind(this);
    this.transPosition = this.transPosition.bind(this);
    this.updateCoupon = this.updateCoupon.bind(this);

    const _this = this;
    onfire.on('changeCouponStatus', (res) => {
      //console.log('/////////////////////////////////////////////////',res);
      const status = res.status;
      const index = res.index;
      //const perPersonRemainingCount = res.perPersonRemainingCount;
      let temp = _this.state.couponList;
      //console.log('原始temp/////////////////////////////////////////////////',temp);

      temp[index].takeSatus = status;
      //temp[index].perPersonRemainingCount = perPersonRemainingCount;
      //console.log('状态改变,,,,,,,,,,,,,,,,,');
      //console.log('现在temp/////////////////////////////////////////////////',temp)

      _this.setState({
        couponList: temp
      });
    });
  }

  componentDidMount() {
    window.didAppear = () => {
      if (Env.rsApp) {
        GetUserInfo().then((data) => {
          Cookies.set('SESSION.user', data.sessionid);
          Cookies.set('sessionid', data.sessionid);
          Cookies.set('openid', data.openid);
          Cookies.set('is_login', 1);
          this.updateCoupon(this.detailId);
        })

      }

    }
    let _this = this;
    const { s } = this.props;
    s();
    if (!Env.rsApp) {
      this.setState({
        webPadding: true
      })
    }
    onfire.on('closeTip', () => {
      this.setState({
        webPadding: false
      })
    });
    this.handleCorpDetail(this.detailId);
    //_this.point = new BigData();
    //    _this.point.pzs('110.300.49.58.68.78.49','110.300.49.58.68.78.50','110.300.49.58.68.78.50', 'deco','page.decocompany.detail', 'p_decocompany_detail', this.detailId, 'mmall.com');
    try {
      let navTrans = document.getElementById('nav');
      let blockPosition = document.getElementById('blockPosition');
      let blockPositionInfo = document.getElementById('blockPositionInfo');
      let blockPositionScore = document.getElementById('blockPositionScore');
      let blockPositionDesigner = document.getElementById('blockPositionDesigner');
      let blockPositionDiaries = document.getElementById('blockPositionDiaries');
      let blockPositionDetail = document.getElementById('blockPositionDetail');
      let video = document.getElementsByTagName('video')[0];
      let screenWidth = 0.23466667 * document.body.clientWidth;
      window.onscroll = function () {
        if ((Env.ios && (document.body.scrollTop > 0.168 * document.body.clientWidth)) || (!Env.ios && (document.body.scrollTop > 0.11466667 * document.body.clientWidth))) {
          _this.setState({
            positionBlock: true
          });
          if (blockPositionInfo.offsetTop - document.body.scrollTop < screenWidth && blockPositionInfo.offsetTop - document.body.scrollTop > screenWidth - blockPositionInfo.scrollHeight) {
            _this.setState({
              position: 1
            })
          }
          if (blockPositionScore.offsetTop - document.body.scrollTop < screenWidth && blockPositionScore.offsetTop - document.body.scrollTop > screenWidth - blockPositionScore.scrollHeight + 5) {
            _this.setState({
              position: 2
            })
          }
          if (blockPositionDesigner.offsetTop - document.body.scrollTop < screenWidth && blockPositionDesigner.offsetTop - document.body.scrollTop > screenWidth - 2.63 * blockPositionDesigner.scrollHeight) {
            _this.setState({
              position: 3
            })
          }
          if (blockPositionDiaries.offsetTop - document.body.scrollTop < screenWidth && blockPositionDiaries.offsetTop - document.body.scrollTop > screenWidth - blockPositionDiaries.scrollHeight + 5) {
            _this.setState({
              position: 4
            })
          }
          if (blockPositionDetail.offsetTop - document.body.scrollTop < screenWidth && blockPositionDetail.offsetTop - document.body.scrollTop > screenWidth - blockPositionDetail.scrollHeight) {
            _this.setState({
              position: 5
            })
          }
        } else {
          _this.setState({
            positionBlock: false
          })
        }
      };
      navTrans.addEventListener('click', function (e) {
        _this.setState({
          showBottomInfo: false
        });
      }, false);
      // video.addEventListener("progress", function () {
      //   //SomeJavaScriptCode
      // }
      // );
    } catch (e) { }
  }

  doPlay(url) {
    //this.point.f('110.300.55.64.68.79.20', 'deco', 'page.decocompany.detail', 'p_decocompany_detail', 'button.video', 'p_action_id');
    // this.props.f({
    //   id: '1458',
    // p_action_id: `tag=视频&contentid=${url||''}`,
    // });
    try {
      let playState = this.state.playing;
      let player = document.getElementById("player");
      let playerContainer = document.getElementById("playerContainer");
      if (playState) {
        player.pause();
      } else {
        player.play();
      }
      this.setState({
        playing: !playState
      });
    } catch (e) { }
  }

  //登录回来更新优惠券列表
  updateCoupon(corpId) {
    const sessionId = getSessionId();
    CorpDetailModel.ReceiveCorpDetail(corpId, sessionId).then((data) => {
      if (data.dataMap.halfcoverDecorationprice) {
        this.setState({
          couponList: data.dataMap.couponInfos || []
        });
      }
    })
  }
  handleCorpDetail(corpId) {
    let _this = this;
    //const sessionId='32dfa594-8d4f-49b3-a00a-4324cfe3bda6';
    const sessionId = getSessionId();
    CorpDetailModel.ReceiveCorpDetail(corpId, sessionId)
      .then((data) => {//设置详情状态
        let halfPrice = '';
        if (data.dataMap.halfcoverDecorationprice) {
          halfPrice = "半包报价：" + data.dataMap.halfcoverDecorationprice;
        }
        let share = {
          title: data.dataMap.companyAppellation || '',
          img: String(data.dataMap.logoUrl) || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          text: halfPrice,
          link: `${Host.path}/mainapp/decoCorpDetail.html?detailId=${_this.detailId}`,
          record: true,
          objectId: _this.detailId,
          objectType: 'share_decorate_detail'
        };
        _this.setState({
          share: share
        });
        _this.WXshare = new WXshare();
        _this.WXshare.WXshareInfo(share);
        document.title = data.dataMap.companyAppellation;
        let collect = {
          sourceType: '30',
          channel: 'shop',
          picture: data.dataMap.logoUrl,
          title: data.dataMap.companyAppellation || ''
        };

        _this.setState({
          detailInfo: data.dataMap,
          companyName: data.dataMap.companyAppellation,
          objectType: 'share_decorate_detail',
          collect: collect,
          initShareData: true,
          couponList: data.dataMap.couponInfos || []
        });
        if (data.dataMap.activityId) {
          //console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', '调取活动')
          const activityId = data.dataMap.activityId;
          //调取活动接口判断是否有图片
          this.fetchActivityData(activityId);
        }
      });

    CorpDetailModel.ReceiveAboutUs(corpId)
      .then((data) => {//设置详情状态
        if (data.code == 200) {
          this.setState({
            aboutUs: data.dataMap.introduction
          })
        }
      });
  }

  //调取优惠活动接口，判断优惠活动是否有图片
  fetchActivityData(activityId) {
    CorpDetailModel.ReceiveActiveImg(activityId).then((data) => {
      if (data.code == 200 && data.dataMap) {
        this.setState({
          activityData: data.dataMap,
        });
      }
    })
  }

  showSale() {
    const { detailInfo, activityData } = this.state;
    const { id, images, companyId } = activityData;
    this.props.f({
      id: '3418',
      p_action_id: `tag=${detailInfo && detailInfo.shopActivityTitle ? detailInfo.shopActivityTitle : ''}`
    })
    if (id && images.length > 0) { //有活动图片跳到活动页
      if (Host.path.indexOf('uat1') > -1) {
        location.href = `http://retail-activity.uat1.rs.com/2018-05-03/activityInfo/activityInfo.html?activityId=${id}&companyId=${companyId}&back=h5&__open=1`;
      } else if (Host.path.indexOf('mklmall') > -1) {
        location.href = `https://retail-activity.mklmall.com/2018-05-03/activityInfo/activityInfo.html?activityId=${id}&companyId=${companyId}&back=h5&__open=1`;
      } else if (Host.path.indexOf('mmall') > -1) {
        location.href = `https://retail-activity.mmall.com/2018-05-03/activityInfo/activityInfo.html?activityId=${id}&companyId=${companyId}&back=h5&__open=1`;
      }

    } else { //没有活动图片，弹出优惠弹窗
      this.setState({
        showBottomInfo: true,
        bottomInfoType: 'sale'
      }, () => {
        const body = document.querySelector('body');
        const topSize = document.documentElement.scrollTop || document.body.scrollTop;
        body.style.top = `${-topSize}px`;
        body.setAttribute('class', 'overHidden');
      });
    }
  }
  showShops() {
    //this.point.f('110.300.55.59.68.78.71', 'deco', 'page.detail.company', 'page_companydetailaddressmore', 'page_companydetailaddressmore', 'p_action_id');
    this.props.f({
      id: '1772',
    });
    this.setState({
      showBottomInfo: true,
      bottomInfoType: 'shops'
    }, () => {
      const body = document.querySelector('body');
      const topSize = document.documentElement.scrollTop || document.body.scrollTop;
      body.style.top = `${-topSize}px`;
      body.setAttribute('class', 'overHidden');

    });
  }
  hideBottomInfo() {
    this.setState({
      showBottomInfo: false
    }, () => {
      const body = document.querySelector('body');
      const topSize = document.documentElement.scrollTop || document.body.scrollTop;
      const high = Math.abs(parseInt(body.style.top));
      body.setAttribute('class', '');
      window.scroll(0, high);
      body.style.top = '';
    });
  }
  clickAppoint() {
    //this.point.f('110.300.55.66.69.79.26', 'deco', 'page.decocompany.detail', 'p_decocompany_detail', 'button.booking', 'p_action_id');
  }
  aboutUs() {
    window.location.href = '/mainapp/decoAboutUs.html?detailId=' + this.detailId + '&__open=1'
  }
  scoreDetail() {
    //this.point.f('110.300.55.59.68.78.73', 'deco', 'page.detail.company', 'page_companycomment', 'page_companycomment', 'p_action_id');
    this.props.f({
      id: '1774',
    });
    window.location.href = '/mainapp/evaluateDetail.html?detailId=' + this.detailId + '&__open=1'
  }
  transPosition(position, num) {
    window.location.href = position;
    window.scrollBy(0, -document.body.clientWidth / 375 * 87);
    this.setState({
      position: num
    })
  }

  render() {
    const { couponList, detailInfo, activityData } = this.state;
    //console.log('lllllllllllllllllllllllllllll', couponList);
    let totalScore = Number(detailInfo.overall).toFixed(1), basicGrade = '';
    let saleStyle = '50.66666vw';
    if ((detailInfo.halfcoverDecorationprice && !detailInfo.subbranchs) || (!detailInfo.halfcoverDecorationprice && detailInfo.subbranchs)) {
      saleStyle = '42.66666vw'
    } else if (!detailInfo.halfcoverDecorationprice && !detailInfo.subbranchs) {
      saleStyle = '34.66666vw'
    }
    let branchStyle = '37.33333vw';
    if (!detailInfo.halfcoverDecorationprice) {
      branchStyle = '29.33333vw'
    }
    if (4.9 <= totalScore && totalScore <= 5) {
      basicGrade = '精品'
    } else if (4.6 <= totalScore && totalScore <= 4.8) {
      basicGrade = '超赞'
    } else if (4.3 <= totalScore && totalScore <= 4.5) {
      basicGrade = '很好'
    } else if (4.0 <= totalScore && totalScore <= 4.2) {
      basicGrade = '不错'
    } else {
      basicGrade = '综合'
    }


    // let bodyTag = document.getElementsByTagName('body');
    // let htmlTag = document.getElementsByTagName('html');
    // if (this.state.showBottomInfo) {
    //   bodyTag[0].style.height = '100vh';
    //   bodyTag[0].style.overflow = 'hidden';
    //   bodyTag[0].style.position = 'fixed';
    //   htmlTag[0].style.height = '100vh';
    //   htmlTag[0].style.overflow = 'hidden';
    //   htmlTag[0].style.position = 'fixed';
    // } else {
    //   bodyTag[0].style.height = 'auto';
    //   bodyTag[0].style.overflow = 'auto';
    //   bodyTag[0].style.position = '';
    //   htmlTag[0].style.height = 'auto';
    //   htmlTag[0].style.overflow = 'auto';
    //   htmlTag[0].style.position = 'relative';
    // }

    //let shareBigData = ['110.300.55.60.68.78.79', 'deco', 'page.detail.company', 'page_companydetailshare', 'page_companydetailshare', 'p_action_id'];
    //let collectBigData = ['110.300.49.58.68.78.79', 'deco', 'page.detail.company', 'page_companydetailcollect', 'page_companydetailcollect', 'p_action_id'];
    const pointShare = { id: '1782' };
    const collectBigData = { id: '1781' };


    let positionStyle = "14vw";
    if (Env.rsApp && Env.ios) {
      positionStyle = "17.066666vw"
      if (Env.iPhoneX) {
        positionStyle = '23.5vw'
      }
    } else if (Env.rsApp && Env.android) {
      positionStyle = "11.733333vw"
    }
    return (
      <div className={cs({ "pageWapper": true, 'app-wrap': false, 'webPadding': this.state.webPadding, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX })}>
        <NavTrans detailId={this.detailId} initShareData={this.state.initShareData} collect={this.state.collect} score={this.state.score} share={this.state.share} scroll="true" hideNav="true" showTip="false" pointShare={pointShare} collectBigData={collectBigData} f={this.props.f} />
        <div className="blockPosition" style={{ "top": positionStyle, "display": this.state.positionBlock ? "flex" : "none" }} id="blockPosition">
          <div className={cs({ "blockPositionShow": this.state.position == 1 })} onClick={this.transPosition.bind(this, '#blockPositionInfo', 1)}>公司情况<div><i></i></div></div>
          {detailInfo.overall && <div className={cs({ "blockPositionShow": this.state.position == 2 })} onClick={this.transPosition.bind(this, '#blockPositionScore', 2)}>评分<div><i></i></div></div>}
          {detailInfo.designers && <div className={cs({ "blockPositionShow": this.state.position == 3 })} onClick={this.transPosition.bind(this, '#blockPositionDesigner', 3)}>设计师及案例<div><i></i></div></div>}
          {detailInfo.diaryList && <div className={cs({ "blockPositionShow": this.state.position == 4 })} onClick={this.transPosition.bind(this, '#blockPositionDiaries', 4)}>业主日记<div><i></i></div></div>}
          {this.state.aboutUs && <div className={cs({ "blockPositionShow": this.state.position == 5 })} onClick={this.transPosition.bind(this, '#blockPositionDetail', 5)}>详情<div><i></i></div></div>}
        </div>
        {<Banner detailInfo={detailInfo} handleClickVideo={(url) => this.doPlay(url)} />}
        <div className="corpBlock">
          <div id="blockPositionInfo">
            <CorpBasicInfo detailInfo={detailInfo} companyName={detailInfo.companyAppellation} showSale={this.showSale} showShops={this.showShops} couponList={couponList} f={this.props.f} />
          </div>
        </div>
        <div className="corpBlock" id="blockPositionScore">
          {
            detailInfo.overall ?
              <div className="corpScoreInfo" onClick={this.scoreDetail.bind(this)}>
                <div className="scoreLeft">
                  <div>综合评分</div>
                  <div><span>{(detailInfo.overall).toFixed(1)}</span>分</div>
                  <div>根据用户评分计算</div>
                </div>
                <div className="scoreRight">
                  <div>
                    <div className="title">设计能力</div>
                    <EvaluateStars score={(detailInfo.designLevel ? Number(detailInfo.designLevel).toFixed(1) : '暂无评分')} totalScore={parseInt(detailInfo.designLevel)} />
                  </div>
                  <div>
                    <div className="title">工程质量</div>
                    <EvaluateStars score={(detailInfo.constructionQuality ? Number(detailInfo.constructionQuality).toFixed(1) : '暂无评分')} totalScore={parseInt(detailInfo.constructionQuality)} />
                  </div>
                  <div>
                    <div className="title">服务水平</div>
                    <EvaluateStars score={(detailInfo.serviceLevel ? Number(detailInfo.serviceLevel).toFixed(1) : '暂无评分')} totalScore={parseInt(detailInfo.serviceLevel)} />
                  </div>
                </div>
              </div>
              : ''
          }
        </div>
        <div className="corpBlock" id="blockPositionDesigner">
          <Designers detailId={this.detailId} detailInfo={detailInfo} f={this.props.f} />
        </div>
        <div className="corpBlock">
          <a className="otherServices" href="/activity/deco-safe.html?sourceFrom=25009&back=h5"><div><span>装修保</span><span>·</span><span>资金托管 先行赔付 极速维权</span><div className="corpOther"></div></div></a>
          <a className="otherServices" href="/activity/deco-manager.html?sourceFrom=25009&back=h5"><div><span>平台管家</span><span>·</span><span>免费管家服务</span><div className="corpOther"></div></div></a>
        </div>
        <div className="corpBlock">
          <Cases detailId={this.detailId} detailInfo={detailInfo} f={this.props.f} />
        </div>
        <div className="corpBlock" id="blockPositionDiaries">
          <Diaries detailId={this.detailId} detailInfo={detailInfo} />
        </div>
        <div className="corpBlock" id="blockPositionDetail">
          <CorpAllInfo detailId={this.detailId} detailInfo={detailInfo} />
        </div>
        {
          this.state.aboutUs ?
            <div className="corpBlock">
              <div className="com-rich-text" dangerouslySetInnerHTML={{ __html: this.state.aboutUs }}></div>
            </div> : ''
        }
        <BottomInfo detailInfo={detailInfo} showBottomInfo={this.state.showBottomInfo} bottomInfoType={this.state.bottomInfoType} hideBottomInfo={this.hideBottomInfo} f={this.props.f} />
        {!detailInfo.overall ? <div id="bottomInfoBtn" className={"bottomInfoBtn bottomInfoBtn" + this.state.showBottomInfo} style={{ "display": "none" }} onClick={this.hideBottomInfo.bind(this)}>完成</div> : ''}
        {Env.rsApp && <div className={cs({ "footer": true, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX })} onClick={this.clickAppoint.bind(this)}>
          <Appoint pageFrom="app-zxgsxq-10001" sourceType='1' text="立即预约" companyId={this.detailId} roleType="3" />
        </div>}
      </div>
    );
  }
}
