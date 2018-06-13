import React from 'react';
import cs from 'classnames';
import { Toast } from 'antd-mobile';
import queryString from 'query-string';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import Cookies from 'js-cookie';
import { ReceivePediaInfo, ReceiveViewTimes } from '../../../models/PediaDetailModel';
import Header from './header';
import Layout from '../../../components/layout'
import Footer from '../../../lib/components/footer';
import DefaultImg from '../../../lib/components/defaultImg';
import RichText from '../../../lib/components/richText';
import Like from '../../../lib/components/like';
import Collect from '../../../lib/components/collect';
import ArtCommentWithReply from '../../../lib/components/artCommentWithReply';
import WXshare from '../../../lib/scripts/WXshare';
import GetNativeInfo from '../../../lib/scripts/getNativeInfo';
import Host from '../../../lib/scripts/config_host';
import Nav from '../../../lib/components/nav';
import BigData from '../../../lib/scripts/bigData';
import { RecommendsRow } from '../../../lib/components/list-row'
import '../../../lib/scss/base.scss';
import './style.scss';


export default class Details extends React.Component {
  constructor(props) {
    super(props);
    // this.ArticleDetailModel = new ArticleDetailModel();
    const params = queryString.parse(location.search);
    this.articleId = params.detailId;

    this.state = {
      detailInfo: { recommends: [] },
      bottomInfo: {},
      viewTimes: 0,
      webPadding: false,
      mId: '',
      initShareData: false,
    };
    this.WXshare = new WXshare();
    this.point = new BigData();
    this.freeRoom = this.freeRoom.bind(this);
    this.forwardConsultPage = this.forwardConsultPage.bind(this);
    this.getMid = this.getMid.bind(this);
    this.onShare = this.onShare.bind(this);
  }

  componentDidMount() {


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
    this.handleArticleDetail(this.articleId);
    this.getMid();
    //    this.point.pzs('110.300.49.58.68.78.88', '110.300.49.58.68.78.88','110.300.49.58.68.78.88','deco', 'app_page_deco_wiki', '百科详情页', this.articleId);
    // this.handleViewTimes(this.articleId);
  }
  handleArticleDetail(articleId) {
    Toast.loading('Loading...', 1000);
    ReceivePediaInfo(articleId)
      .then((data) => {//设置详情状态
        this.setState({
          detailInfo: data.dataMap || { recommends: [] },
          collect: {
            title: data.dataMap.title || '',
            sourceType: '8',
            channel: 'deco',
            picture: data.dataMap.cover || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!'
          },
          share: {
            record: 'true',
            objectId: articleId,
            objectType: 'wiki',
            title: data.dataMap.title || '百科详情',
            img: data.dataMap.cover || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
            link: `${Host.path}/mainapp/pediaDetail.html?detailId=${articleId}`,
            text: '干货来了，装修避坑全 靠TA！'
          },
          initCollectData: true,
          initShareData: true,
        });
        Toast.hide();
        document.title = data.dataMap.title || '百科详情';
        let share = {
          title: data.dataMap.title || '百科详情',
          img: data.dataMap.cover || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!'
        };
        this.WXshare.WXshareInfo(share);
      })
      .catch((error) => {
        console.log('文章id不存在', error);
        Toast.hide();
      });
  }
  handleViewTimes(articleId) {
    ReceiveViewTimes(articleId)
      .then((data) => {//设置详情状态
        this.setState({
          viewTimes: data.info[0].history.pv || 0
        });
      })
      .catch((error) => {
        console.log('获取pv失败', error);
      });
  }

  Jumparticle(data) {
    if (window.location.protocol != 'file:') {
      window.location = data + `&back=h5`;
    } else {
      window.location = data + `&back=file`;
    }
  }
  freeRoom() {
    this.props.f({
      id: 1666,
      p_action_id: `tag=百科&contentid=${this.articleId}`
    })
    setTimeout(() => {
      if (window.location.protocol != 'file:') {
        window.location = Host.path + `/activity/deco-freeRoom.html?back=h5`;
      } else {
        window.location = Host.path + `/activity/deco-freeRoom.html?back=file`;
      }
    }, 50)
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
    this.props.f({
      id: '1666',
      p_action_id: `tag=百科&collectid=${this.articleId}`
    })
    const { detailInfo, mId } = this.state;
    const labelPartVos = detailInfo.labelPartVos || [];
    let fromTags = [];
    if (labelPartVos.length > 0) {
      labelPartVos.map((item, index) => {
        if (index < 3) {
          return fromTags[index] = item.labelName;
        }
      })
    }
    //console.log('fromTags', fromTags.join(','));
    // Cookies.set('fromTitle', detailInfo.title);
    // Cookies.set('fromTags', fromTags.join(','));
    localStorage.setItem('fromTitle', detailInfo.title);
    localStorage.setItem('fromTags', fromTags.join(','));
    //带加入跳入ABtest链接
    setTimeout(() => {
      location.assign(`/api-jiazhuang/c/hxapp/style/styleTest?source=1_27006_app-bkxq-10001&mid=${mId}&back=h5&open=1`);
      // if (Host.path.indexOf('uat1') > -1) {
      //   location.href = `http://api-jiazhuang.uat1.rs.com/c/hxapp/style/styleTest?source=1_27006_app-bkxq-10001&mid=${mId}&back=h5&open=1`;
      // } else if (Host.path.indexOf('mklmall') > -1) {
      //   location.href = `https://api-jiazhuang.mklmall.com/c/hxapp/style/styleTest?source=1_27006_app-bkxq-10001&mid=${mId}&back=h5&open=1`;
      // } else if (Host.path.indexOf('mmall') > -1) {
      //   location.href = `https://api-jiazhuang.mmall.com/c/hxapp/style/styleTest?source=1_27006_app-bkxq-10001&mid=${mId}&back=h5&open=1`;
      // }
    }, 0);
  }

  onShare(shareInfo) {
    const { f } = this.props;
    const pointShare = { id: '3373', p_action_id: `tag=百科&contentid=${this.articleId || ''}` }
    f && f(pointShare);
  }

  render() {
    console.log(this);
    let styleHide = {},
      divHide = false;
    if (!Env.rsApp) {
      styleHide = {
        'display': 'none'
      };
      divHide = true;
    }
    const pointLike = { id: '3375', p_action_id: `tag=百科&contentid=${this.articleId || ''}` };
    const pointComment = { id: '3374', p_action_id: `tag=百科&contentid=${this.articleId || ''}` };
    return (
      <Layout
        className={cs({ "articleDetailBox": true, 'app-articleWrap': Env.rsApp, 'ios-nav': Env.rsApp && Env.ios, 'box-bottom': Env.rsApp, 'webPadding': this.state.webPadding, 'img-center': true })}
        share={this.state.share}
        initShareData="true"
        showTip={true}
        hideNav={true}
        f={this.props.f}
        onShare={this.onShare}
        title='百科详情'
      >
        <Header detailInfo={this.state.detailInfo} viewTimes={this.state.viewTimes} f={this.props.f} />
        <RichText description={this.state.detailInfo.content} preview="false" />
        <div className="button-wrapper" style={styleHide}>
          <span className="button-wrapper-btn btn-liked">
            {/*<span className="btn-img"></span>*/}
            <Like id={this.articleId} likeType="jz_baike" />
            <p>点赞</p>
          </span>
          <span className="button-wrapper-btn btn-collect">
            {/*<span className="btn-img"></span>*/}
            <Collect id={this.articleId} collect={this.state.collect} initCollectData={this.state.initCollectData} />
            <p>收藏</p>
          </span>
        </div>
        {this.state.detailInfo.recommends.length > 0 &&
          <div className="recommends-wrap">
            <div className="line"></div>
            <div className="details">相关推荐</div>
            <div className="detailsLine"></div>
            <ul>
              {this.state.detailInfo.recommends.length > 0 &&
                this.state.detailInfo.recommends.map((item) => {
                  return (
                    <RecommendsRow
                      onClick={this.Jumparticle.bind(this, `./pediaDetail.html?detailId=${item.id}`)}
                      item={item}
                    />
                  );
                })
              }
            </ul>
          </div>
        }

        <ArtCommentWithReply id={this.articleId} type="jz_baike" divHide={divHide} />
        {
          //!divHide && <div className="freeRoom" onClick={this.freeRoom.bind(this)}></div>
        }
        {
          !divHide &&
          <Footer
            type="jz_baike"
            id={this.articleId}
            initCollectData="none"
            likeType="jz_baike"
            f={this.props.f}
            pointLike={pointLike}
            pointComment={pointComment}
            forwardConsultPage={this.forwardConsultPage}
          />
        }
      </Layout>
    );
  }
}
