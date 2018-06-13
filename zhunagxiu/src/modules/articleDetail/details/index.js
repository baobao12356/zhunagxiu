import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import LazyLoad from 'react-lazy-load';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { ReceiveArticleInfo, BigDataCommendList, getShopGoods } from '../../../models/ArticleDetailModel';
import Header from './header';
import Layout from '../../../components/layout'
import Footer from '../../../lib/components/footer';
import DefaultImg from '../../../lib/components/defaultImg';
import RichText from './component/richText';
// import RichText from '../../../lib/components/richText';
import Collect from '../../../lib/components/collect';
import ArtCommentWithReply from '../../../lib/components/artCommentWithReply';
import GetNativeInfo from '../../../lib/scripts/getNativeInfo';
import Host from '../../../lib/scripts/config_host';
import BigData from '../../../lib/scripts/bigData';
import WXshare from '../../../lib/scripts/WXshare';
import GetUserInfo from '../../../lib/scripts/getUserInfo';
import Hybrid from '../../../lib/scripts/hybrid';
import ResizeImg from '../../../lib/scripts/resizeImg';
import GoodList from './component/showModal';
import GoodsRow from './component/goods';
import GoodsOne from './component/goodsOne';
import '../../../lib/scss/base.scss';
import './style.scss';
require("babel-core/register");
require("babel-polyfill");

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    // this.ArticleDetailModel = new ArticleDetailModel();
    const params = queryString.parse(location.search);
    // this.articleId = params.detailId || 30||2034||'';
    this.articleId = params.detailId || '';
    this.back = params.back || "";
    this.showTip = true;  //是否显示推荐下载
    this.state = {
      detailInfo: {},
      bottomInfo: {},
      designerData: [],
      viewTimes: 0,
      share: {},
      webPadding: false,   //切换padding-top
      commendList: "",
      initShareData: false,
      isH5: false,
      uid: '',
      mid: '',
      goods: {},
      itemInfo: {},
      itemPromotionInfo: {},
      showModal: false,
      content: ``,
      shopProductIds: [],
      cityId: '',
      skuIdData: [],
      mId: '',
    };
    //20322871,8235977,20327488,20326516,8235977,20327488
    this.contextAll = ``;
    this.WXshare = new WXshare();
    this.point = new BigData();
    this.freeRoom = this.freeRoom.bind(this);
    this.forwardConsultPage = this.forwardConsultPage.bind(this);

    this.uid = '';
    this.mid = '';
    this.getItemDetail = this.getItemDetail.bind(this);
    this.onClose = this.onClose.bind(this);
    this.popupGoodsList = this.popupGoodsList.bind(this);
    this.skuId = [20322871, 8235977, 20327488, 20326516, 8235977, 20327488];
    this.assemblyData = this.assemblyData.bind(this);
    this.skuIdData = [];
    this.onShare = this.onShare.bind(this);
  }
  /*async componentWillMount(){

    const res = await BigDataCommend(this.articleId)
    const commendList = await BigDataCommendList(res.data.sorts)
    this.setState({
      commendList:!!commendList && commendList.data.info,
      isH5:this.back=="h5"?true:false
    })
    await this.handleArticleDetail(this.articleId)

  }*/

  initFun() {
    GetUserInfo().then((res) => {
      this.uid = res.openid;
    }).catch((e) => {
      console.log(e);
    })
    Hybrid.callHybridBasicInfo('getPhoneUuid', 'getter').then((res) => {
      this.mid = res.hxiphoneUUID;
      BigDataCommendList(this.articleId, this.mid, this.uid).then((res) => {
        if (res.code == 200) {
          this.setState({
            commendList: res.dataMap[0].data,
            isH5: this.back == "h5" ? true : false
          })
        }
      }).catch((e) => {
        console.log(e);
      })
    }).catch((e) => {
      console.log(e);
    })
  }



  //获取商品数据
  getItemDetail(skuId) {
    // alert(222);
    // console.log(skuId, '传过来的id1,,,,,,,,');
    getShopGoods(skuId).then((res) => {
      if (res && res.code == 200 && res.dataMap && res.dataMap.itemInfo) {
        // this.setState({
        //   goods: res.dataMap || {},
        //   itemInfo: res.dataMap.itemInfo ? res.dataMap.itemInfo : {},
        //   itemPromotionInfo: res.dataMap.itemPromotionInfo ? res.dataMap.itemPromotionInfo : {},
        // })
        let itemInfo = res.dataMap.itemInfo, cityCode = itemInfo.shopInfoBrief && itemInfo.shopInfoBrief.cityId ? itemInfo.shopInfoBrief.cityId : '';
        if (this.state.cityId == cityCode) {
          // this.skuIdData.push(res.dataMap.itemInfo);
          this.setState({
            skuIdData: [...this.state.skuIdData, res.dataMap.itemInfo]
          })
        } else {
          console.log(res.dataMap, cityCode, '列表不')
          return
        }
        // this.skuIdData.push(res.dataMap.itemInfo);

        // console.log(this.skuIdData,'组合一条数据');

      }

    }).catch((e) => {
      console.log(e)
    })

  }

  assemblyData() {
    let shopProductIds = this.state.shopProductIds ? this.state.shopProductIds : [];
    shopProductIds && shopProductIds.length > 0 && shopProductIds.forEach((item, index) => {
      item && this.getItemDetail(item);
    })
    // console.log(this.state.shopProductIds,this.state.skuIdData, '组装数据了...........')
  }


  componentDidMount() {
    this.getCityCode();
    // this.handleArticleDetail(this.articleId);
    this.initFun();
    if (!Env.rsApp) {
      this.setState({
        webPadding: true
      })
    }

    onfire.on('closeTip', () => {
      this.setState({
        webPadding: false
      })
    })

    // this.assemblyData();

  }
  //数据
  handleArticleDetail(articleId) {
    ReceiveArticleInfo(articleId).then((data) => {//设置详情状态
      // console.log(data.dataMap.content, '数据..........先试试');
      //   const content= data.dataMap.content;
      //  let rsGoods=content.match('RSGoods');
      //  console.log(rsGoods,'rsGoods')
      if (!(data && data.dataMap)) {
        return;
      }
      document.title = data.dataMap.title || '文章详情';
      this.share = {
        record: 'true',
        objectId: articleId,
        objectType: 'share_deco_atical',
        title: data.dataMap.title || '',
        img: data.dataMap.cover + '.200x200.png!' || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
        link: `${Host.path}/mainapp/articleDetail.html?detailId=${articleId}`,
        text: '自从用了「红星美凯龙」，我 又get了新技能！'
      };

      this.setState({
        // commendList:,
        detailInfo: data.dataMap,
        designerData: data.dataMap.designerVoList || [],
        collect: {
          title: data.dataMap.title || '',
          sourceType: '9',
          channel: 'article',
          picture: data.dataMap.cover + '.200x200.png!' || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!'
        },
        share: this.share,
        viewTimes: data.dataMap.pvCnt || 0,
        initCollectData: true,
        initShareData: true,
        content: `${data.dataMap.content}` || ``,
        shopProductIds: data.dataMap.shopProductIds != '' ? data.dataMap.shopProductIds.split(',') : [],
      }, () => {
        this.assemblyData();
      });

      this.WXshare.WXshareInfo(this.share);

    }).catch((error) => {
      console.log('文章id不存在', error);
    });


  }

  //接口

  JumpDesigner(id, level) {
    if (window.location.protocol != 'file:') {
      if (level == 7) {
        window.location = Host.path + '/mainapp/designerMasterDetail.html?detailId=' + id + `&__open=1`;
      } else {
        window.location = Host.path + '/mainapp/designerNormalDetail.html?detailId=' + id + `&__open=1`;
      }
    } else {
      if (level == 7) {
        // window.location = Host.path + '/mainapp/designerMasterDetail.html?detailId=' + id + `&back=file`;
        window.location = Host.path + '/mainapp/designerMasterDetail.html?detailId=' + id + `&__open=1`;
      } else {
        window.location = Host.path + '/mainapp/designerNormalDetail.html?detailId=' + id + `&__open=1`;
      }
    }
  }

  freeRoom() {
    // this.point.f('110.300.49.58.68.78.94', 'deco', 'app_page_deco_article', 'app_page_deco_article', 'p_apply', '', '', '', '', this.articleId);
    if (window.location.protocol != 'file:') {
      window.location = Host.path + `/activity/deco-freeRoom.html?pageFrom=app-wzxqty-10001&__open=1`;
    } else {
      window.location = Host.path + `/activity/deco-freeRoom.html?pageFrom=app-wzxqty-10001&__open=1`;
    }

  }

  toArticle(aId) {
    console.log(aId);
    this.props.f({
      id: '2188',
      p_action_id: `tag=文章&contentid=${this.articleId || ''}`

    })
    // this.point.f('d45084f7-4586-46c3-b7e2-cfc418849636', 'deco', 'app_page_deco_article', '', 'recommend', this.articleId, this.articleId);
    window.location = Host.path + '/mainapp/articleDetail.html?detailId=' + aId + `&__open=1`;

  }



  popupGoodsList() {
    this.setState({
      showModal: true,
    })
    document.querySelector('body').setAttribute('class', 'overHidden');
  }

  onClose() {
    this.setState({
      showModal: false,
    })
    document.querySelector('body').setAttribute('class', '');
  }


  getCityCode() {
    GetNativeInfo().then((nativeInfoRes) => {
      // console.log(nativeInfoRes,'native交互,.....');
      this.setState({
        // cityId :nativeInfoRes&&nativeInfoRes.ShowCityId?nativeInfoRes.ShowCityId:'310100',
        cityId: nativeInfoRes && nativeInfoRes.ShowCityId ? nativeInfoRes.ShowCityId : '',
        mId: nativeInfoRes.hxiphoneUUID,
      }, () => {
        this.handleArticleDetail(this.articleId);
      })
      console.log('city', nativeInfoRes.ShowCityId);
    }).catch((e) => {
      console.log(e);
      this.setState({
        cityId: '',
      }, () => {
        this.handleArticleDetail(this.articleId);
      })
    });
  }

  forwardConsultPage() {
    console.log('ABtest');
    const { detailInfo, mId } = this.state;

    // Cookies.set('fromTitle', detailInfo.title);
    // Cookies.set('fromTags', detailInfo.lables);
    const fromTags = detailInfo.lables;
    localStorage.setItem('fromTitle', detailInfo.title);
    localStorage.setItem('fromTags', fromTags ? fromTags.join(',') : '');
    // let cousultInfo = {};
    // cousultInfo.title = detailInfo.title;
    // cousultInfo.style = detailInfo.lables;
    // sessionStorage.setItem('cousultInfo', JSON.stringify(cousultInfo));

    this.props.f({
      id: '1667',
      p_action_id: `tag=文章&contentid=${this.articleId || ''}`
    })

    location.assign(`/api-jiazhuang/c/hxapp/style/styleTest?source=2_27006_app-wzxq-10001&mid=${mId}&back=h5&open=1`);
  }
  /**
   * 分享
   *
   * @param {Object} shareInfo
   */
  onShare(shareInfo) {
    const { f } = this.props;
    const pointShare = {
      id: '3277',
      p_action_id: `tag=文章&contentid=${this.articleId || ''}` || ""
    };
    f && f(pointShare);
  }

  render() {
    const pointLike = {
      id: '277',
      p_action_id: `tag=文章&contentid=${this.articleId || ''}`
    };
    console.log(this);
    let designerClassName = 'softDesignerList';

    if (this.state.designerData.length == 0) {
      designerClassName += ' softDesignerList-hide';
    }

    let styleHide = {
      'display': 'none'
    },
      divHide = false;

    if (!Env.rsApp) {
      // styleHide = {
      //   'display':'none'
      // };
      divHide = true;
    }


    const { commendList, showModal, shopProductIds, content, cityId, skuIdData, detailInfo } = this.state
    // console.log(commendList)

    const commendItem = (
      <div className="commend">
        <div className="commend-title">相关推荐</div>
        <div className="commend-box">

          {
            commendList &&
            commendList.map(v => {
              return <div className="commend-item" key={Math.random()} onClick={this.toArticle.bind(this, v.id)}>
                {/* <div className="commend-left" style={{ background: `url(${v.cover_img_url})` }}> */}
                <div className="commend-left">
                  <LazyLoad height={210}>
                    <img src={v.cover_img_url || ''} alt="" />
                  </LazyLoad>
                </div>
                <div className="commend-right">
                  <div className="commend-article-title">{v.title && v.title}</div>
                  <div className="commend-tags">
                    {
                      v.tags && v.tags.split(',').map((vl, ks) => {
                        if (ks > 2) {
                          return
                        }
                        return (<span key={Math.random()}>{vl}</span>)
                      })
                    }
                  </div>
                  <div className="commend-counts">
                    <div className="pv">{v.pv}</div>
                    <div className="like">{v.liked}</div>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    )
    const _this = this;
    function goodsList() {
      //console.log( shopProductIds,  _this.state.skuIdData,'结果///////////////////////////////////////////////////')
      return shopProductIds.map((item, index) => {
        return <GoodsOne skuId={item} key={index} cityId={cityId} f={_this.props.f} articleId={_this.articleId}></GoodsOne>
      })
    }

    return (
      <Layout
        className={cs({ "articleDetailBox": true, 'app-wrap': Env.rsApp, 'ios-nav': Env.rsApp && Env.ios, 'box-bottom': Env.rsApp, 'webPadding': this.state.webPadding, 'img-center': true })}
        isH5={this.state.isH5}
        share={this.state.share}
        onShare={this.onShare}
        title='文章详情'
      >
        <div className="main">
          <Header detailInfo={this.state.detailInfo} viewTimes={this.state.viewTimes} f={this.props.f} />
          <RichText description={content} preview="true" cityId={cityId} f={this.props.f} articleId={this.articleId} />
          <div className={designerClassName}>
            {
              this.state.designerData.map((item) => {
                let designerLabel;
                if (item.label) {
                  designerLabel = item.label.split(',').join('/');
                }

                return (
                  <div className="designer-item" key={item.id} onClick={this.JumpDesigner.bind(this, item.id, item.designerLevel)}>
                    <div className="designer-info">
                      {/* <DefaultImg cusClass="designer-head" src={item.avatarUrl} /> */}
                      <div className="designer-head">
                        <LazyLoad height={195}>
                          <img src={item.avatarUrl || ''} alt="" />
                        </LazyLoad>
                      </div>

                      <div className="designer-rightInfo">
                        <p className="realName">{item.realName}</p>
                        <p className="designer-desc">{(designerLabel ? designerLabel + '/' : '') + '从业' + item.workingYear}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

          {commendList && commendItem}


          {/*<div className="button-wrapper" style={styleHide}>
              <span className="button-wrapper-btn btn-liked">
                {/!*<span className="btn-img"></span>*!/}
                <Like id={this.articleId} likeType="deco_atical_liked"/>
                <p>点赞</p>
              </span>
              <span className="button-wrapper-btn btn-collect">
                {/!*<span className="btn-img"></span>*!/}
                <Collect id={this.articleId} collect={this.state.collect} initCollectData={this.state.initCollectData}/>
                <p>收藏</p>
              </span>
            </div>*/}

          {/*<div className="line"></div>*/}
          <ArtCommentWithReply id={this.articleId} type="review_house_atical" divHide={divHide} />
        </div>
        {
          //!divHide &&
          //<div className="freeRoom" onClick={this.freeRoom.bind(this)}></div>
        }
        {

          Env.rsApp && <Footer

            type="review_house_atical"
            id={this.articleId}
            collect={this.state.collect}
            initCollectData={this.state.initCollectData}
            likeType="deco_atical_liked"
            pointLike={pointLike}
            f={this.props.f}
            forwardConsultPage={this.forwardConsultPage} />
        }

        {
          shopProductIds && shopProductIds.length > 3 && skuIdData.length > 3 ?
            <div className="goods_fixed" onClick={this.popupGoodsList}>商品{skuIdData.length || ''}</div> : ''
        }



        {
          <ReactCSSTransitionGroup
            transitionName="mask"
            transitionAppear={true}

            transitionEnterTimeout={100}
            transitionLeaveTimeout={100}
            transitionAppearTimeout={100}
          >
            {showModal ?
              <div className="pop_list_mask">

              </div>
              : ''}
          </ReactCSSTransitionGroup>}


        {
          <ReactCSSTransitionGroup
            transitionName="list"
            transitionAppear={true}

            transitionEnterTimeout={150}
            transitionLeaveTimeout={150}
            transitionAppearTimeout={150}
          >
            {showModal ?
              <div className="pop_list">
                <div className="pop_goods_list" >
                  <div className="pop_text_goods" >文中商品</div>
                  {goodsList()}
                </div>
                <div className="pop_slide_in" onClick={this.onClose}>
                  <span></span>
                </div>

              </div>
              : ''}
          </ReactCSSTransitionGroup>}





      </Layout>
    );
  }
}


/*    {
          <ReactCSSTransitionGroup
            transitionName="list"
            transitionAppear={true}

            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
            transitionAppearTimeout={200}
          >
        {showModal ?
          <div className="pop_list">
          <div className="pop_goods_list" >
            <div className="pop_text_goods" >文中商品</div>
             {goodsList()}
          </div>
          <div className="pop_slide_in" onClick={this.onClose}>
              <span></span>
          </div>

          </div>
         : ''}
         </ReactCSSTransitionGroup>} */



/*
shopProductIds&&shopProductIds.length>0?
<div className="goods_fixed" onClick={this.popupGoodsList}>商品{shopProductIds.length||''}</div>:'' */

/*
            {
          shopProductIds&&shopProductIds.length>0?
          <div className="goods_fixed" onClick={this.popupGoodsList}>商品{shopProductIds.length||4}</div>:''
        }*/

// classOperation.addClass(navTitleEle, 'nav_title_show');

