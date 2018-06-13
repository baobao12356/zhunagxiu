import React from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import onfire from 'onfire.js';
import HybridBridge from 'rs-hybrid-bridge';
import Cookies from 'js-cookie';
import BigData from '../../../lib/scripts/bigData';
import queryString from 'query-string';
import decoDiaryDetailModel from '../../../models/decoDiaryDetailModel';
import './style.scss';
import NavTrans from '../../../lib/components/navTrans';
import Host from '../../../lib/scripts/config_host';
import WXshare from '../../../lib/scripts/WXshare';
import AppDownloadTip from '../../../lib/components/appDownloadTip';
import GetNativeInfo from '../../../lib/scripts/getNativeInfo';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    //this.point = new BigData();
    this.detailId = params.detailId;
    this.photos = [];
    this.state = {
      share: {},
      detailInfo: {},
      initShareData: false,
      slideIn: false,
      shadowHide: true,
      webPadding: false,
      rightMenu: [0, 0, 0, 0, 0, 0, 0],
      detailTitleSize: [],
      scrollTop: 0,
      mId: '',
    };
    this.WXshare = new WXshare();
    this.forwardConsultPage = this.forwardConsultPage.bind(this);
  }

  componentDidMount() {
    /*let _this = this;*/
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
    this.handleDiaryDetails(this.detailId);
    this.getMid();
    //    this.point.p('110.300.55.58.68.78.149', 'deco', 'page.decobook.detail','deco_list_guide');
    //    this.point.z('110.300.55.58.68.78.150', 'deco', 'page.decobook.detail','deco_list_guide');
  }

  handleDiaryDetails(detailId) {
    let _this = this;
    decoDiaryDetailModel.ReceiveDiaryDetail(detailId).then((data) => {

      let share = {
        title: data.dataMap.title || '',
        img: String(data.dataMap.cover) || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
        text: '自从用了「红星美凯龙」，我 又get了新技能！',
        link: `${Host.path}/mainapp/decoDiaryDetails.html?detailId=${detailId}`,
        record: true,
      };

      let collect = {
        sourceType: '30',
        channel: 'shop',
        picture: data.dataMap.logoUrl,
        title: data.dataMap.companyName || ''
      };
      this.setState({
        detailInfo: data.dataMap,
        initShareData: true,
        share: share,
        collect: collect
      });

      _this.WXshare.WXshareInfo(share);
    })
  }

  dateTrans(longTypeDate) {
    let date = new Date(longTypeDate);
    Date.prototype.format = function (f) {
      var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(f)) f = f.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(f)) f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); return f
    };
    return date.format('yy-MM-dd');
  }

  componentWillMount() {
    window.addEventListener('scroll', this.scrollTopHandle.bind(this));
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.scrollTopHandle.bind(this));
  }
  scrollTopHandle() {
    let sTop = document.documentElement.scrollTop || document.body.scrollTop||window.pageYOffset ;
    let aboveHeightGroup = [];
     console.log(this.state.detailTitleSize)
    for (let i = 0; i < this.state.detailTitleSize.length; i++) {
      aboveHeightGroup[i] = document.querySelectorAll('.details')[i].offsetTop - document.querySelector('.fix-header').clientHeight;
      console.log(i, document.querySelectorAll('.details')[i].offsetTop,' 每个下边内容details的偏离顶部文档高度')
      console.log(i, document.querySelector('.fix-header').clientHeight,' 导航的高度')
      console.log(i,  aboveHeightGroup[i],' 每个下边内容details的偏离顶部文档高度减去 导航的高度是aboveHeightGroup[i]')
      console.log(i, sTop,' sTop,body滚动的高度')

      if (sTop >= aboveHeightGroup[i]) {
        // alert(i)
        let scrollId = document.querySelectorAll('.detailTitle')[i].id;
        document.querySelectorAll('.detailTitle')[i].style.position = 'fixed';
        document.querySelectorAll('.detailTitle')[i].style.top = document.querySelector('.fix-header').clientHeight + 'px';
        document.querySelectorAll('.details')[i].style.paddingTop = document.querySelectorAll('.detailTitle')[i].clientHeight + 'px';
        // document.querySelectorAll('.details')[i].setAttribute('class','details details_fixed');
        this.setState({
          scrollTop: scrollId.replace(/oneNodeId/, ''),
        });
      } else {
        document.querySelectorAll('.detailTitle')[i].style.position = 'relative';
        document.querySelectorAll('.detailTitle')[i].style.top = 0;
        document.querySelectorAll('.details')[i].style.paddingTop = 0;
        // document.querySelectorAll('.details')[i].setAttribute('class','details');
      }
    }
  }

  scrollToTitle(num) {
    let oneNodeId = 'detailNodeId' + num;
    if (document.getElementById(oneNodeId)) {
      if (this.state.scrollTop != num) {
        let aboveHeight = document.getElementById(oneNodeId).offsetTop - document.querySelector('.fix-header').clientHeight + 1;
        window.scrollTo(0, aboveHeight);
        this.setState({
          scrollTop: num,
          slideIn: false,
          shadowHide: true,
        })
        console.log(this.state.scrollTop)
      }
    }
  }

  clickSlide() {
    this.setState({
      slideIn: true,
      shadowHide: false,
    })
  }

  slideOut() {
    this.setState({
      slideIn: false,
      shadowHide: true,
    })
  }

  gotoNativeMap(la, lo, co) {
    this.props.f({
      id: '1818',
      p_action_id:`tag=装修日记&contentid=${this.detailId||''}`
    });
    const dataNative = {
      tag: '69',
      latitude: la,
      longitude: lo,
      description: co,
    };
    new HybridBridge(window).hybrid('call_native', dataNative);
    //this.point.f('110.300.55.58.68.78.152','deco','page.decobook.detail','deco_detail_book');

  }

  gotoNativeImg(id) {
    this.props.f({
      id: '1817',
      p_action_id:`tag=装修日记&contentid=${this.detailId||''}`
    });

    const dataNative = {
      tag: '70',
      constructionId: id,
    };
    new HybridBridge(window).hybrid('call_native', dataNative);
    //this.point.f('110.300.55.58.68.78.151','deco','page.decobook.detail','deco_detail_book');

  }

  gotoNativeImgGroup(index, photos) {
    let photoGroup = [];
    photos && photos.map((val, idx) => {
      photoGroup[idx] = {
        "des": " ",
        "url": val,
        "title": " "
      }
    });
    const dataNative = {
      tag: '25',
      data: {
        "ID": this.detailId,
        "objectType": 'decoDiaryDetails',
        "currentIndex": index,
        "share": {
          "link": `${Host.path}/mainapp/decoDiaryDetails.html?detailId=${this.detailId}`,
          "title": "业主日记",
          "text": " 自从用了「红星美凯龙」，我 又get了新技能！",
          "image": 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!'
        },
        "photos": photoGroup
      }
    };
    console.log(dataNative);
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  toDecoCompany(id, type) {
    this.props.f({
      id: '1819',
      p_action_id:`tag=装修日记&contentid=${this.detailId||''}`
    });
    if (type === 0) {
      if (window.location.protocol != 'file:') {
        window.location = Host.path + `/mainapp/decoCorpDetail.html?detailId=${id}&__open=1`;
      } else {
        window.location = Host.path + `/mainapp/decoCorpDetail.html?detailId=${id}&__open=1`;
      }
    } else if (type === 2) {
      if (window.location.protocol != 'file:') {
        window.location = Host.path + `/mainapp/decoInstituteDetail.html?detailId=${id}&__open=1`; //&back=h5
      } else {
        window.location = Host.path + `/mainapp/decoInstituteDetail.html?detailId=${id}&__open=1`;// &back=file
      }
    }
    //this.point.f('110.300.55.58.68.78.153','deco','page.decobook.detail','deco_detail_book');

  }

  toDecoShoppingList(id) {
    this.props.f({
      id: '1820',
      p_action_id:`tag=装修日记&contentid=${this.detailId||''}`
    });
    if (window.location.protocol != 'file:') {
      window.location = Host.path + `/mainapp/decoShoppingList.html?detailId=${id}&__open=1`;//back=h5
    } else {
      window.location = Host.path + `/mainapp/decoShoppingList.html?detailId=${id}&__open=1`;//back=h5
    }
    //this.point.f('110.300.55.58.68.78.154','deco','page.decobook.detail','deco_detail_book');

  }

  toDecoQualityRecord(id) {
    this.props.f({
      id: '1821',
      p_action_id:`tag=装修日记&contentid=${this.detailId||''}`
    });
    if (window.location.protocol != 'file:') {
      window.location = Host.path + `/mainapp/decoQualityRecord.html?detailId=${id}&__open=1`;//back=h5
    } else {
      window.location = Host.path + `/mainapp/decoQualityRecord.html?detailId=${id}&__open=1`;//back=h5
    }
    //this.point.f('110.300.55.58.68.78.155','deco','page.decobook.detail','deco_detail_book');

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
    const {detailInfo, mId} = this.state;
    const tag =  detailInfo.houseType +','+ detailInfo.decStyle;
    localStorage.setItem('fromTitle', detailInfo.title);
    localStorage.removeItem('fromTags');
    //Cookies.set('fromTags', tag); //业主日记暂时不传标签

    //跳入ABtest链接
    location.assign(`/api-jiazhuang/c/hxapp/style/styleTest?source=3_27011_app-zxrj-10001&mid=${mId}&back=h5&open=1`);
    // if (Host.path.indexOf('uat1') > -1) {
    //   location.href = `http://api-jiazhuang.uat1.rs.com/c/hxapp/style/styleTest?source=3_27011_app-zxrj-10001&mid=${mId}&back=h5&open=1`;
    //   //location.href = `http://192.168.223.51:9000/designConsultancyA.html?source=1&back=h5&__open=1`;
    // } else if(Host.path.indexOf('mklmall') > -1) {
    //   location.href = `https://api-jiazhuang.mklmall.com/c/hxapp/style/styleTest?source=3_27011_app-zxrj-10001&mid=${mId}&back=h5&open=1`;
    // } else if(Host.path.indexOf('mmall') > -1) {
    //   location.href = `https://api-jiazhuang.mmall.com/c/hxapp/style/styleTest?source=3_27011_app-zxrj-10001&mid=${mId}&back=h5&open=1`;
    // }

  }

  render() {
    let _this = this;

    let firstInfos = this.state.detailInfo.firstInfos && this.state.detailInfo.firstInfos.map((item, idx) => {
      let contents = item.contents && item.contents.map((val, idx) => {
        this.photos = val.images;
        let imgList = val.images && val.images.map((val, idx) => {
          return <div key={idx} className="imgList" onClick={this.gotoNativeImgGroup.bind(this, idx, this.photos)} style={{ backgroundImage: "url(" + val + ')' }}></div>
        });
        return (
          <div className="content img-center" key={idx}>
            <div className="dateTime">
              {
                val.twoNodeName && <span>{val.twoNodeName}</span>
              }
              <div className="contentWords">{val.content}</div>
              {
                !!val.images[0] &&
                <div className="contentImage">
                  {imgList}
                </div>
              }
            </div>
          </div>

        )
      });

      _this.state.rightMenu[item.oneNodeId - 1] = item.contentNum;
      _this.state.detailTitleSize[idx] = idx;

      return (
        <div className="details" key={idx} id={'detailNodeId' + item.oneNodeId}>
          <div className="detailTitle" id={'oneNodeId' + item.oneNodeId}><span>{item.oneNodeName}</span></div>
          {/* <div   className="wrap_all_fixed" id={`wrap_all_fixed${item.oneNodeId}`}>{contents}</div> */}
          {contents}
        </div>)
    });

    return (
      <div className={cs({ "pageWapper": true, 'app-wrap': false, 'webPadding': this.state.webPadding })}>
        <NavTrans detailId={this.detailId} initShareData={this.state.initShareData} collect={this.state.collect} share={this.state.share} scroll="true" hideNav="true" showTip="true" />
        <div className="banner" onClick={this.gotoNativeImg.bind(this, this.detailId)} style={{ backgroundImage: "url(" + this.state.detailInfo.cover + '!)' }}>
          <div className="iconImg"><span className="img"></span><span>{this.state.detailInfo.imageTotalNum}</span></div>
          {
            this.state.detailInfo.userAvatar ? <div className="userAvatar" style={{ backgroundImage: "url(" + this.state.detailInfo.userAvatar + ')' }}></div> : <div className="userAvatar"></div>
          }
        </div>
        <div className="titleGroup">
          <div className="title">{this.state.detailInfo.title}</div>
          <div className="tag">
            {!!this.state.detailInfo.amount &&
              <span>{this.state.detailInfo.amount}万</span>
            }
            {!!this.state.detailInfo.area &&
              <span>{this.state.detailInfo.area}㎡</span>
            }
            {!!this.state.detailInfo.houseType &&
              <span>{this.state.detailInfo.houseType}</span>
            }
            {!!this.state.detailInfo.decStyle &&
              <span>{this.state.detailInfo.decStyle}</span>
            }
          </div>
        </div>
        <ul className="clickTag">
          <li className={(this.state.detailInfo.longitude == '' || this.state.detailInfo.latitude == '' || this.state.detailInfo.community == '') ? '' : 'light'} onClick={this.state.detailInfo.longitude != '' && this.state.detailInfo.latitude != '' && this.state.detailInfo.community != '' && this.gotoNativeMap.bind(this, this.state.detailInfo.latitude, this.state.detailInfo.longitude, this.state.detailInfo.community)}>
            <p className='icon icon1'></p>
            <p className='word'>小区地图</p>
          </li>
          <li className={cs({ 'light': (this.state.detailInfo.companyType === 0 || this.state.detailInfo.companyType === 2) })} onClick={(this.state.detailInfo.companyType === 0 || this.state.detailInfo.companyType === 2) && this.toDecoCompany.bind(this, this.state.detailInfo.companyId, this.state.detailInfo.companyType)}>
            <p className='icon icon2'></p>
            <p className='word'>装修公司</p>
          </li>
          <li className={cs({ 'light': this.state.detailInfo.hasGoods })} onClick={this.state.detailInfo.hasGoods && this.toDecoShoppingList.bind(this, this.detailId)}>
            <p className='icon icon3'></p>
            <p className='word'>装修清单</p>
          </li>
          <li className={cs({ 'light': this.state.detailInfo.hasCheckRecords })} onClick={this.state.detailInfo.hasCheckRecords && this.toDecoQualityRecord.bind(this, this.detailId)}>
            <p className='icon icon4'></p>
            <p className='word'>质检记录</p>
          </li>
        </ul>
        {firstInfos}
        <div className="menuIcon" onClick={this.clickSlide.bind(this)}></div>
        <div className={cs({ 'shadow': true, 'hide': this.state.shadowHide })} onClick={this.slideOut.bind(this)}></div>
        <div className={cs({ "rightMeun": true, "slideIn": this.state.slideIn })}>
          <ul>
            <li>装修历程</li>
            <li className={cs({ "active": this.state.scrollTop == 1, "gray": !this.state.rightMenu[0] })} onClick={this.scrollToTitle.bind(this, '1')}>
              开工交底{!!this.state.rightMenu[0] && '（' + this.state.rightMenu[0] + '）'}
            </li>
            <li className={cs({ "active": this.state.scrollTop == 2, "gray": !this.state.rightMenu[1] })} onClick={this.scrollToTitle.bind(this, '2')}>
              拆建施工{!!this.state.rightMenu[1] && '（' + this.state.rightMenu[1] + '）'}
            </li>
            <li className={cs({ "active": this.state.scrollTop == 3, "gray": !this.state.rightMenu[2] })} onClick={this.scrollToTitle.bind(this, '3')}>
              水电施工{!!this.state.rightMenu[2] && '（' + this.state.rightMenu[2] + '）'}
            </li>
            <li className={cs({ "active": this.state.scrollTop == 4, "gray": !this.state.rightMenu[3] })} onClick={this.scrollToTitle.bind(this, '4')}>
              泥木施工{!!this.state.rightMenu[3] && '（' + this.state.rightMenu[3] + '）'}
            </li>
            <li className={cs({ "active": this.state.scrollTop == 5, "gray": !this.state.rightMenu[4] })} onClick={this.scrollToTitle.bind(this, '5')}>
              油漆施工{!!this.state.rightMenu[4] && '（' + this.state.rightMenu[4] + '）'}
            </li>
            <li className={cs({ "active": this.state.scrollTop == 6, "gray": !this.state.rightMenu[5] })} onClick={this.scrollToTitle.bind(this, '6')}>
              安装施工{!!this.state.rightMenu[5] && '（' + this.state.rightMenu[5] + '）'}
            </li>
            <li className={cs({ "active": this.state.scrollTop == 7, "gray": !this.state.rightMenu[6] })} onClick={this.scrollToTitle.bind(this, '7')}>
              竣工{!!this.state.rightMenu[6] && '（' + this.state.rightMenu[6] + '）'}
            </li>
          </ul>
        </div>
        {

           Env.rsApp &&<div className="consultBtn" onClick={this.forwardConsultPage}>设计咨询</div>
        }
      </div>
    )
  }
}
