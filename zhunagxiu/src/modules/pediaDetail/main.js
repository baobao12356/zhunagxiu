import React from 'react';
import cs from 'classnames';
import { ReceivePediaInfo, ReceiveViewTimes } from '../../../models/PediaDetailModel';
import Header from './header';
import Footer from '../../../lib/components/footer';
import DefaultImg from '../../../lib/components/defaultImg';
import RichText from '../../../lib/components/richText';
import Like from '../../../lib/components/like';
import Collect from '../../../lib/components/collect';
import ArtCommentWithReply from '../../../lib/components/artCommentWithReply';
import queryString from 'query-string';
import Host from '../../../lib/scripts/config_host';
import Nav from '../../../lib/components/nav';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import BigData from '../../../lib/scripts/bigData';
import { Toast } from 'antd-mobile';
import './style.scss';
import '../../../lib/scss/base.scss';
import WXshare from '../../../lib/scripts/WXshare';

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
      initShareData: false,
    };
    this.WXshare = new WXshare();
    this.point = new BigData();
    this.freeRoom = this.freeRoom.bind(this);

  }

  componentDidMount() {
    this.handleArticleDetail(this.articleId);

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
          img: data.dataMap.cover || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          text: ''
        };
        this.WXshare.WXshareInfo(share);
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
    this.point.f('110.300.49.58.68.78.30', 'deco', 'app_page_deco_wiki', 'app_page_deco_wiki', 'p_apply', '', '', '', '', this.articleId);
    if (window.location.protocol != 'file:') {
      window.location = Host.path + `/activity/deco-freeRoom.html?back=h5`;
    } else {
      window.location = Host.path + `/activity/deco-freeRoom.html?back=file`;
    }
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

    return (
      <div className={cs({ "articleDetailBox": true, 'app-articleWrap': Env.rsApp, 'ios-nav': Env.rsApp && Env.ios, 'box-bottom': Env.rsApp, 'webPadding': this.state.webPadding })}>
        <Nav title='百科详情' share={this.state.share} initShareData={this.state.initShareData} showTip={true} hideNav={true} />
        <Header detailInfo={this.state.detailInfo} viewTimes={this.state.viewTimes} />
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
                    <a href="javascript:;" key={item.id} onClick={this.Jumparticle.bind(this, `/mainapp/pediaDetail.html?detailId=${item.id}`)}>
                      <img className="detailListLeft" src={item.cover} />
                      <div className="detailListRight">
                        <p>{item.title}</p>
                        {item.categoryTag && <span>{item.categoryTag}</span>}
                      </div>
                    </a>
                  )
                })
              }
            </ul>
          </div>
        }

        <ArtCommentWithReply id={this.articleId} type="jz_baike" divHide={divHide} />
        {
          !divHide && <div className="freeRoom" onClick={this.freeRoom.bind(this)}></div>
        }
        {
          !divHide && <Footer type="jz_baike" id={this.articleId} initCollectData="none" likeType="jz_baike" />
        }
      </div>
    );
  }
}
