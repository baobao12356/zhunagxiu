import React from 'react';
import cs from 'classnames';
import BigData from '../../../lib/scripts/bigData';
import Banner from './banner';
import onfire from 'onfire.js';
import queryString from 'query-string';
import InstituteDetailModel from '../../../models/instituteDetailModel';
import './style.scss';
import '../../../lib/scss/base.scss';
import InstituteBasicInfo from './instituteBasicInfo';
import InstituteServiceInfo from './instituteServiceInfo';
import BottomInfo from './bottomInfo';
import InstituteAllInfo from './instituteAllInfo';
import Cases from './cases';
import NavTrans2 from '../../../lib/components/navTrans2';
import Appoint from '../../../lib/components/appoint';
import Env from 'rs-browser';
import Host from '../../../lib/scripts/config_host';
import WXshare from '../../../lib/scripts/WXshare';
import { ListView } from 'antd-mobile';

export default class Details extends React.Component {
  constructor(props) {
    super(props);

    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.state = {
      detailInfo: {},
      videoShow: false,
      objectType: '',
      share: {},
      companyName: '',
      initShareData: false,
      webPadding: false,
      showBottomInfo: false,
      bottomInfoType: 'sale',
      playing: false,
      videoImg: false,
      intro: ''
    };
    this.showSale = this.showSale.bind(this);
    this.showShops = this.showShops.bind(this);
    this.hideBottomInfo = this.hideBottomInfo.bind(this);
    this.clickAppoint = this.clickAppoint.bind(this);
    this.handlePointF = this.handlePointF.bind(this);
  }

  componentDidMount() {
    let _this = this;
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
    this.handleInstituteDetail(this.detailId);
    _this.point = new BigData();
    //    _this.point.p('110.300.49.58.68.78.57', 'deco','p_designCompanyInfo', 'p_designCompanyInfo', this.detailId, 'mmall.com');
    //    _this.point.z('110.300.49.58.68.78.110', 'deco','p_designCompanyInfo', 'p_designCompanyInfo', this.detailId, 'mmall.com');

    try {
      let shadow = document.getElementById('shadow');
      let navTrans = document.getElementById('nav');
      let video = document.getElementsByTagName('video')[0];
      shadow.addEventListener('click', function (e) {
        _this.setState({
          showBottomInfo: false
        });
      }, false);
      shadow.addEventListener('click', function (e) {
        _this.setState({
          showBottomInfo: false
        });
      }, false);

      navTrans.addEventListener('click', function (e) {
        _this.setState({
          showBottomInfo: false
        });
      }, false);
    } catch (e) {
      console.log(e)
    }

  }


  handlePointF(id, p_action_id) {
    this.props.f({
      id,
      p_action_id
    })
  }

  handleInstituteDetail(instituteId) {
    let _this = this;
    InstituteDetailModel.ReceiveInstituteDetail(instituteId)
      .then((data) => {//设置详情状态
        console.log(data.dataMap);
        document.title = data.dataMap.companyAppellation;
        let share = {
          title: data.dataMap.companyAppellation || '',
          img: String(data.dataMap.logoUrl) || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          text: '',
          link: `${Host.path}/mainapp/decoInstituteDetail.html?detailId=${instituteId}`,
          record: true,
          objectType: 'note_decorate_share'
        };
        _this.WXshare = new WXshare();
        _this.WXshare.WXshareInfo(share);
        let collect = {
          sourceType: '33',
          channel: 'shop',
          picture: data.dataMap.logoUrl,
          title: data.dataMap.companyName || ''
        };
        let bannersImgs = [];
        let bannersVideo = false;
        if (data.dataMap.groupPhoto && data.dataMap.visualizeImg) {
          bannersImgs = data.dataMap.groupPhoto;
          bannersImgs.push(data.dataMap.visualizeImg);
        } else if (!data.dataMap.groupPhoto && data.dataMap.visualizeImg) {
          bannersImgs = [];
          bannersImgs.push(data.dataMap.visualizeImg);
        } else if (data.dataMap.groupPhoto && !data.dataMap.visualizeImg) {
          bannersImgs = data.dataMap.groupPhoto
        }

        if (data.dataMap.videoImage != "" && !!data.dataMap.videoUrl) {
          bannersImgs.unshift(data.dataMap.videoImage);
          bannersVideo = true;
        }
        this.setState({
          detailInfo: data.dataMap,
          banners: bannersImgs,
          companyName: data.dataMap.companyName,
          objectType: 'note_decorate_share',
          share: share,
          collect: collect,
          initShareData: true,
          videoImg: bannersVideo
        });
      });

    InstituteDetailModel.ReceiveInstituteIntro(instituteId)
      .then((data) => {//设置详情状态
        if (data.code == 200 && data.dataMap.companyRemark) {
          this.setState({
            intro: data.dataMap
          })
        }
      })
  }

  MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }

  showSale() {
    this.setState({
      showBottomInfo: true,
      bottomInfoType: 'sale'
    });
  }
  showShops() {
    this.setState({
      showBottomInfo: true,
      bottomInfoType: 'shops'
    });
  }
  hideBottomInfo() {
    this.setState({
      showBottomInfo: false
    });
  }

  clickAppoint() {
    this.props.f({
      id: '3021',
    })
    // this.point.f('110.300.49.58.68.78.335', 'deco', 'p_designCompanyInfo', 'p_designCompanyInfo', 'p_mekeAppointment', '');
  }

  render() {
    let nowVideoShow = this.state.videoShow;

    let bodyTag = document.getElementsByTagName('body');
    let htmlTag = document.getElementsByTagName('html');
    if (this.state.showBottomInfo) {
      bodyTag[0].style.height = '100vh';
      bodyTag[0].style.overflow = 'hidden';
      bodyTag[0].style.position = 'fixed';
      htmlTag[0].style.height = '100vh';
      htmlTag[0].style.overflow = 'hidden';
      htmlTag[0].style.position = 'fixed';
    } else {
      bodyTag[0].style.height = 'auto';
      bodyTag[0].style.overflow = 'auto';
      bodyTag[0].style.position = 'relative';
      htmlTag[0].style.height = 'auto';
      htmlTag[0].style.overflow = 'auto';
      htmlTag[0].style.position = 'relative';
    }


    return (
      <div className={cs({ "pageWapper": true, 'app-wrap': false, 'webPadding': this.state.webPadding, 'img-center': true })}>
        <NavTrans2 detailId={this.detailId} initShareData={this.state.initShareData} collect={this.state.collect} share={this.state.share} scroll="true" hideNav="true" showTip="true" />
        <Banner activityBanners={this.state.banners} videoImg={this.state.videoImg} detailInfo={this.state.detailInfo} />
        <div className="instituteBlock">
          {this.state.detailInfo.shopActivityTitle ?
            <div id="sale" onClick={!this.state.showBottomInfo ? this.showSale.bind(this) : ''}></div> : ''
          }
          <InstituteBasicInfo detailInfo={this.state.detailInfo} companyName={this.state.detailInfo.companyName} />
        </div>
        <div className="instituteBlock">
          {
            // this.state.detailInfo.subbranchs ?
            // <div id="shops" onClick={!this.state.showBottomInfo ? this.showShops.bind(this) : ''}></div> : ''
          }
          <InstituteServiceInfo detailInfo={this.state.detailInfo} handlePointF={this.handlePointF} showShops={this.showShops} f={this.props.f} />
        </div>
        <div className="instituteBlock">
          <Cases detailId={this.detailId} detailInfo={this.state.detailInfo} handlePointF={this.handlePointF} f={this.props.f} />
        </div>
        <div className="instituteBlock">
          <InstituteAllInfo detailId={this.detailId} detailInfo={this.state.detailInfo} intro={this.state.intro.companyRemark} setUpDate={this.state.intro.setUpDate} handlePointF={this.handlePointF} />
        </div>

        <BottomInfo detailInfo={this.state.detailInfo} showBottomInfo={this.state.showBottomInfo} bottomInfoType={this.state.bottomInfoType} />
        <div className={"bottomInfoBtn bottomInfoBtn" + this.state.showBottomInfo} onClick={this.hideBottomInfo.bind(this)}>完成</div>
        {Env.rsApp && <div className={cs({ "footer": true, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX })} onClick={this.clickAppoint.bind(this)} >
          <Appoint pageFrom="app-yysjjg-10001" text="立即预约" designAgencyId={this.detailId} roleType="4" />
        </div>}
      </div>
    );
  }
}
//{
//  "companyId": 0,
//  "companyAppellation": "string",
//  "covers": ["string","string"],
//  "companyAddress": "stringstringstringstringstring",
//  "logoUrl": "string",
//  "characteristicTab": "string,string,string",
//  "services": [
//  "string","string"
//],
//  "videoImage": "string",
//  "videoUrl": "string",
//  "videoSize": "string",
//  "videoTime": 0,
//  "caseCounts": 0,
//  "caseVos": [
//  {
//    "caseId": 0,
//    "title": "string",
//    "imageUrl": "string",
//    "houseType": "string",
//    "designStyleStr": "string",
//    "area": "string"
//  },
//  {
//    "caseId": 0,
//    "title": "string",
//    "imageUrl": "string",
//    "houseType": "string",
//    "designStyleStr": "string",
//    "area": "string"
//  },
//  {
//    "caseId": 0,
//    "title": "string",
//    "imageUrl": "string",
//    "houseType": "string",
//    "designStyleStr": "string,string",
//    "area": "string"
//  }
//],
//  "subbranchCounts": 0,
//  "subbranchs": [
//  {
//    "subbranchId": 0,
//    "subbranchName": "string",
//    "subbranchAddress": "string",
//    "addressLongitude": "string",
//    "addressLatitude": "string"
//  }
//],
//  "designerCounts": 0,
//  "designers": [
//  {
//    "designerId": 0,
//    "avatarUrl": "string",
//    "personalizedHeaderUrl": "string",
//    "realName": "string",
//    "designerLevel": 0,
//    "workingHours": "string",
//    "style": [
//      "string",
//      "string",
//      "string"
//    ]
//  },
//  {
//    "designerId": 0,
//    "avatarUrl": "string",
//    "personalizedHeaderUrl": "string",
//    "realName": "string",
//    "designerLevel": 0,
//    "workingHours": "string",
//    "style": [
//      "string"
//    ]
//  },
//  {
//    "designerId": 0,
//    "avatarUrl": "string",
//    "personalizedHeaderUrl": "string",
//    "realName": "string",
//    "designerLevel": 0,
//    "workingHours": "string",
//    "style": [
//      "string"
//    ]
//  },
//  {
//    "designerId": 0,
//    "avatarUrl": "string",
//    "personalizedHeaderUrl": "string",
//    "realName": "string",
//    "designerLevel": 0,
//    "workingHours": "string",
//    "style": [
//      "string"
//    ]
//  },
//  {
//    "designerId": 0,
//    "avatarUrl": "string",
//    "personalizedHeaderUrl": "string",
//    "realName": "string",
//    "designerLevel": 0,
//    "workingHours": "string",
//    "style": [
//      "string"
//    ]
//  },
//  {
//    "designerId": 0,
//    "avatarUrl": "string",
//    "personalizedHeaderUrl": "string",
//    "realName": "string",
//    "designerLevel": 0,
//    "workingHours": "string",
//    "style": [
//      "string"
//    ]
//  }
//],
//  "honorHxAppVos": [
//  {
//    "awardsDes": "string",
//    "awardsDate": "2017-12-19T10:55:15.334Z"
//  },
//  {
//    "awardsDes": "string",
//    "awardsDate": "2017-12-19T10:55:15.334Z"
//  },
//  {
//    "awardsDes": "string",
//    "awardsDate": "2017-12-19T10:55:15.334Z"
//  }
//],
//  "intro":"蓝色理想版权申明：除部分特别声明不要转载，或者授权我站独家播发的文章外，大家可以自由转载我站点的原创文章，但原作者和来自我站的链接必须保留（非我站原创的，按照原来自一节，自行链接）。文章版权归我站和作者共有。"
//}
