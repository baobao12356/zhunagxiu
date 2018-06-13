import React, { Component } from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import queryString from 'query-string';
import Swiper from 'swiper';
import Cookies from 'js-cookie';
import Nav from './nav';
import Host from '../../lib/scripts/config_host';
import ResizeImg from '../../lib/scripts/resizeImg';
import SpecialCollectionModel from '../../models/specialCollectionModel';
import { getCollectNum } from '../../models/componentsApi/collectModal';
import { getPraiseNum } from '../../models/componentsApi/praiseModal';
import { isLogin, getOpenId } from '../../core/AuthUtil';
import GetNativeInfo from '../../lib/scripts/getNativeInfo';
import GetUserInfo from '../../lib/scripts/getUserInfo';
import WXshare from '../../lib/scripts/WXshare';
import '../../components/swiper/swiper-3.4.2.min.scss';
import './style.scss';


export default class SpecialDetail extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.detailId = params.listId;
    this.displayNum = this.displayNum.bind(this);
    this.forwardDetailPage = this.forwardDetailPage.bind(this);
    this.getCollectNum = this.getCollectNum.bind(this);
    this.getPraiseNumById = this.getPraiseNumById.bind(this);
    this.getPraiseNum = this.getPraiseNum.bind(this);
    this.addCollectNum = this.addCollectNum.bind(this);
    this.subtractCollectNum = this.subtractCollectNum.bind(this);
    this.addPraiseNum = this.addPraiseNum.bind(this);
    this.subtractPraiseNum = this.subtractPraiseNum.bind(this);
    this.WXshare = new WXshare();

    this.collect = {
      sourceType: '36',
      channel: 'article'
    };
    this.state = {
      detailInfo: {},
      cover: '',
      length: '',
      backImg: false,
      webPadding: false,
      initShareData: false,
      collectNum: 0,
      praiseNum: 0,
      share: {}
    };
  }

  componentDidMount() {
    if (!Env.rsApp) {
      this.setState({
        webPadding: true,
        initShareData: true
      });
    }

    this.getCollectNum();
    this.getPraiseNum();
    window.didAppear = () => {
      this.getCollectNum();
      this.getPraiseNum();
      if (Env.rsApp) {
        GetUserInfo().then((data) => {
          Cookies.set('SESSION.user', data.sessionid);
          Cookies.set('sessionid', data.sessionid);
          Cookies.set('openid', data.openid);
          Cookies.set('is_login', 1);
        });
      }
      onfire.fire('didAppearLike');
      onfire.fire('didAppearCollect');
    };
    // onfire.on('closeTip', () => {
    //   this.setState({
    //     webPadding: false
    //   })
    // });

    SpecialCollectionModel.getData(this.detailId).then((data) => {
      if (data.code == 200) {
        const share = {
          record: 'true',
          objectId: this.detailId,
          objectType: 'share_deco_atical',
          title: data.dataMap.title || '',
          img: `${data.dataMap.cover}.200x200.png!` ||
            'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          link: `${Host.path}/mainapp/specialList.html?listId=${this.detailId}`,
          text: '自从用了「红星美凯龙」，我 又get了新技能！'
        };
        //alert(JSON.stringify(share));
        document.title = share.title || '精选专辑';
        this.setState({
          detailInfo: data.dataMap,
          cover: data.dataMap.subjectImage,
          length: data.dataMap.dataHxVos.length,
          share,
          initShareData: true
        });
        //this.WXshare.WXshareInfo(share);
        new Swiper('.articleSwiper', {
          slidesPerView: 'auto',
          freeMode: true
        });
        // if (document.getElementsByClassName('hasDesigner').length > 0) {
        //   let contH = document.getElementsByClassName('allHeight')[0].offsetHeight;
        //   let designerH = document.getElementsByClassName('designer')[0].offsetHeight;
        //   for (let i = 0; i < document.getElementsByClassName('hasDesigner').length; i++) {
        //     document.getElementsByClassName('hasDesigner')[i].style.height = contH - designerH + 'px';
        //   }
        // }

        // if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
        //   for (let j = 0; j < document.getElementsByClassName('articleList').length; j++) {
        //     document.getElementsByClassName('articleList')[j].style.height = '96%';
        //   }
        // }

        // let that = this
        // let swiperV = new Swiper('.swiper-container-v', {
        //   direction: 'vertical',
        //   nextButton: '.next',
        //   slidesPerView: 1,
        //   initialSlide: 0,

        //   //shortSwipes:false,
        //   //threshold : 100,
        //   observer: true,//修改swiper自己或子元素时，自动初始化swiper
        //   observeParents: true,//修改swiper的父元素时，自动初始化swiper
        //   autoplayDisableOnInteraction: false,
        //   freeModeMomentumBounceRatio: 5,
        //   onSlideChangeStart: function (swiper) {
        //     if (swiper.activeIndex > 0) {
        //       that.setState({
        //         backImg: true,
        //       })
        //       if (Env.android) {
        //         document.getElementsByTagName("Nav")[0].style.backgroundColor = "#FFF";
        //         //document.getElementsByTagName("Nav")[0].style.backgroundImage = "none";
        //       }
        //       document.getElementsByTagName('nav')[0].style.borderBottom = "1px solid rgba(0,0,0,.1)";
        //       document.getElementsByClassName("next")[0].style.display = "none";
        //     } else {
        //       that.setState({
        //         backImg: false,
        //       })
        //       if (Env.android) {
        //         document.getElementsByTagName("Nav")[0].style.backgroundColor = "transparent";
        //         //document.getElementsByTagName("Nav")[0].style.backgroundImage = "url("+require('./imgs/backMast.png')+")";
        //       }
        //       document.getElementsByTagName('nav')[0].style.borderBottom = "none";
        //       document.getElementsByClassName("next")[0].style.display = "block";
        //     }
        //   }
        // });
        // let swiperScrollbar = new Swiper('.swiper-container-scrollbar', {
        //   direction: 'vertical',
        //   slidesPerView: 'auto',
        //   freeMode: true,
        //   freeModeMomentum: true,
        //   freeModeMomentumRatio: 1,
        //   freeModeMomentumVelocityRatio: 2,
        //   freeModeMomentumBounce: true,
        //   touchReleaseOnEdges: true,
        //   nested: true,
        //   touchRatio: 1,
        //   longSwipesRatio: 0.1,
        //   observer: true,//修改swiper自己或子元素时，自动初始化swiper
        //   observeParents: true,//修改swiper的父元素时，自动初始化swiper
        //   autoplayDisableOnInteraction: false,
        // });
      }
    });
  }

  heightAuto(pram) {
    document.getElementsByClassName('articleList')[pram].style.height = 'auto';
    document.getElementsByClassName('articleList')[pram].style.overflow = 'inherit';
    document.getElementsByClassName('maskMore')[pram].style.display = 'none';
    document.getElementsByClassName('swiperIn')[pram].style.height = 'auto';
    document.getElementsByClassName('zhan')[pram].style.height = '74px';
  }

  goDesignersDetail(detailId, level) {
    if (level == 7) {
      window.location = `${Host.path}/mainapp/designerMasterDetail.html?detailId=${detailId}&back=h5`;
    } else {
      window.location = `${Host.path}/mainapp/designerNormalDetail.html?detailId=${detailId}&back=h5`;
    }
  }

  displayNum(num) {
    if (num < 10) {
      return '0' + num;
    }
    return num;

  }

  forwardDetailPage(id, type) {
    if (type == 0) { //百科
      this.props.f({
        id: '3465',
        p_action_id: `tag=百科&contentid=${id}`
      });
    } else if (type == 2) { //文章
      this.props.f({
        id: '3465',
        p_action_id: `tag=文章&contentid=${id}`
      });
    }
    //window.location = `http://192.168.223.38:9000/specialRichText.html?listId=${this.detailId}&detailId=${id}&articleType=${type}&__open=1`;
    window.location = `${Host.path}/mainapp/specialRichText.html?listId=${this.detailId}&detailId=${id}&articleType=${type}&back=h5&__open=1`;
  }

  //获取收藏数
  getCollectNum() {
    getCollectNum({
      objectId: this.detailId,
      sourceType: '36'
    }).then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          collectNum: res.dataMap
        });
      }
    });
  }
  //收藏数加一
  addCollectNum() {
    this.setState({
      collectNum: this.state.collectNum + 1
    });
  }
  //收藏数减一
  subtractCollectNum() {
    this.setState({
      collectNum: this.state.collectNum - 1
    });
  }

  //获取点赞数
  getPraiseNumById(userId) {
    getPraiseNum({
      id: this.detailId,
      type: 'liked_choice_album',
      userId
    }).then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          praiseNum: parseInt(res.dataMap.likedCount, 10)
        });
      }
    });
  }
  getPraiseNum() {
    const { id, likeType } = this.props;
    if (isLogin()) {
      this.getPraiseNumById(getOpenId());
    } else {
      GetNativeInfo().then((data) => {
        this.getPraiseNumById(data.hxiphoneUUID);
      });
    }
  }

  //点赞数加一
  addPraiseNum() {
    this.setState({
      praiseNum: this.state.praiseNum + 1
    });
  }
  //点赞数减一
  subtractPraiseNum() {
    this.setState({
      praiseNum: this.state.praiseNum - 1
    });
  }

  render() {
    const { detailInfo, cover, collectNum, praiseNum, share } = this.state;
    const { dataHxVos = [] } = detailInfo;
    //alert(JSON.stringify(share));
    const articleList = dataHxVos.length > 0 && dataHxVos.map(
      (item, index) => <div className="articleItem swiper-slide" key={index} onClick={() => { this.forwardDetailPage(item.dataId, item.dataType) }}>
        <div className="articleNum">{this.displayNum(index + 1)}</div>
        <div className="articleTitle">{item.title}</div>
        <div className="articleCover" style={{ background: `url(${item.cover}.500x282.png!) 50% 50% no-repeat` }} ></div>
        <div className="articleDesc">{item.description}</div>
      </div>);
    return (
      <div id="wrap" className="wrap img-center" style={{ backgroundImage: `url(${cover})` }}>
        <div className={cs({ pageInfo: true })}>
          <div className={cs({ listInfo: true, android: Env.rsApp && Env.android })} >
            <div className="listTitle">{detailInfo.title}</div>
            <div className="listDesc">{detailInfo.description}</div>
          </div>
          <div className="articleSwiper">
            <div className="articleList swiper-wrapper">
              {articleList}
            </div>
          </div>

        </div>
        <Nav
          title=""
          id={this.detailId}
          share={share}
          collect={this.collect}
          initCollectData="true"
          initShareData={this.state.initShareData}
          likeType="liked_choice_album"
          collectNum={collectNum}
          addCollectNum={this.addCollectNum}
          subtractCollectNum={this.subtractCollectNum}
          praiseNum={praiseNum}
          addPraiseNum={this.addPraiseNum}
          subtractPraiseNum={this.subtractPraiseNum}
        />
        {/*


        <Nav title='' initShareData={this.state.initShareData}  backImg={this.state.backImg?true:false}  className={cs({"pageWapper":true,'app-wrap':false,'webPadding':this.state.webPadding})} onlyH5={true}></Nav>
        <div className="swiper-container swiper-container-v">
          <div className="swiper-wrapper">
            <div  className="swiper-slide" style={{backgroundImage:'url('+this.state.cover+')'}}>
              <div className="mask" style={{backgroundImage:'url('+require('./imgs/mask.png')+')'}}></div>
              <div className="fixed">
                <div className="title">{this.state.detailInfo.title}</div>
                <div className="descripetion">{this.state.detailInfo.description}</div>
                <div className="nextTit">
                  <div>{this.state.length}篇精彩文章</div>
                  <img src={require('./imgs/down.png')}/>
                </div>
              </div>
            </div>

              {
                this.state.detailInfo.dataHxVos && [...this.state.detailInfo.dataHxVos].map((val,idx)=>{
                  if(val.designerList){
                    return(
                      <div  className="swiper-slide swiperOut" key={idx}>
                        <div className="swiper-container swiper-container-scrollbar">
                          <div className="swiper-wrapper">
                            <div className= {cs({"swiper-slide":true,"swiperIn":true})}>
                              <div className="zhan"></div>
                              <div className={cs({"allList":true,"allHeight":true})}>
                                <div className="articleList hasDesigner">
                                  <div className="maskMore" onClick={this.heightAuto.bind(this,idx)}><img src={require('./imgs/lookMore.png')}/></div>
                                  <p>{val.title}</p>
                                  <div className="articleDetail" dangerouslySetInnerHTML={{__html: val.content}}></div>
                                </div>
                                {
                                  val.designerList &&
                                  <div className="designer">
                                    <div className="designerWord">推荐设计师</div>
                                    {
                                      val.designerList && [...val.designerList].map((data,num)=>{
                                        if(num == 0){
                                          return(
                                            <div className="designerImg" key={num} onClick={this.goDesignersDetail.bind(this,data.designerId,data.level)}>
                                              <img src={data.avatarUrl}/>
                                              <span>{data.designerName}</span>
                                            </div>
                                          )
                                        }
                                      })
                                    }
                                  </div>

                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }else{
                    return(
                      <div  className="swiper-slide swiperOut" key={idx}>
                        <div className="swiper-container swiper-container-scrollbar">
                          <div className="swiper-wrapper">
                            <div className= {cs({"swiper-slide":true,"swiperIn":true})}>
                              <div className="zhan"></div>
                              <div className="allList">
                                <div className="articleList noDesigner">
                                  <div className="maskMore" onClick={this.heightAuto.bind(this,idx)}><img src={require('./imgs/lookMore.png')}/></div>
                                  <p>{val.title}</p>
                                  <div className="articleDetail" dangerouslySetInnerHTML={{__html: val.content}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })
              }
            </div>
          <div className="next"></div>
        </div>
            */}
      </div>
    );
  }
}
