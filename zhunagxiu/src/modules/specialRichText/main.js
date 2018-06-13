import React from 'react';
import Env from 'rs-browser';
import queryString from 'query-string';
import Nav from '../../lib/components/nav';
import RichText from '../../lib/components/richText';
import Footer from '../../lib/components/footer';
import Host from '../../lib/scripts/config_host';
import GetNativeInfo from '../../lib/scripts/getNativeInfo';
import { ReceiveArticleInfo } from '../../models/ArticleDetailModel';
import { ReceivePediaInfo } from '../../models/PediaDetailModel';
import './style.scss';

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.type = params.articleType;
    this.listId = params.listId;
    this.fetchArticle = this.fetchArticle.bind(this);
    this.fetchPedia = this.fetchPedia.bind(this);
    this.forwardConsultPage = this.forwardConsultPage.bind(this);
    this.getMid = this.getMid.bind(this);
    this.collect = {
      "sourceType": '36',
      "channel": 'article'
    }
    this.state = {
      detailInfo: {},
      share: {},
      initShareData: false,
      mId: ''
    }
  }

  componentDidMount() {
    if (this.type == 0) { //百科
      this.fetchPedia();
    } else if (this.type == 2) { //文章
      this.fetchArticle();
    }
    this.getMid();
  }

  //文章详情
  fetchArticle() {
    ReceiveArticleInfo(this.detailId).then((res) => {
      if (res.code == 200 && res.dataMap) {
        const share = {
          record: 'true',
          objectId: this.detailId,
          objectType: 'share_deco_atical',
          title: res.dataMap.title || '',
          img: res.dataMap.cover + '.200x200.png!' || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          link: `${Host.path}/mainapp/specialRichText.html?listId=${this.listId}&detailId=${this.detailId}&articleType=${this.type}`,
          text: '自从用了「红星美凯龙」，我 又get了新技能！'
        };
        //alert(JSON.stringify(share));
        document.title = share.title || '专辑文章详情';
        this.setState({
          detailInfo: res.dataMap,
          share: share,
          initShareData: true
        });
      }
    });
  }

  //百科详情
  fetchPedia() {
    ReceivePediaInfo(this.detailId).then((res) => {
      if (res.code == 200 && res.dataMap) {
        const share = {
          record: 'true',
          objectId: this.detailId,
          objectType: 'share_deco_atical',
          title: res.dataMap.title || '',
          img: res.dataMap.cover + '.200x200.png!' || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          link: `${Host.path}/mainapp/specialRichText.html?listId=${this.listId}&detailId=${this.detailId}&articleType=${this.type}`,
          text: '自从用了「红星美凯龙」，我 又get了新技能！'
        };
        document.title = share.title || '专辑百科详情';
        this.setState({
          detailInfo: res.dataMap,
          share: share,
          initShareData: true
        });
      }
    });
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
    const { detailInfo, mId } = this.state;
    let fromTags = [];
    let source = 0;
    let sourceString = '';
    if (this.type == 0) { //百科
      source = 1;
      sourceString = '27006_app-bkxq-10001';
      const labelPartVos = detailInfo.labelPartVos || [];
      if (labelPartVos.length > 0) {
        labelPartVos.map((item, index) => {
          if (index < 3) {
            return fromTags[index] = item.labelName;
          }
        })
      }
    } else if (this.type == 2) { //文章
      source = 2;
      sourceString = '27006_app-wzxq-10001';
      fromTags = detailInfo.lables;
    }
    localStorage.setItem('fromTitle', detailInfo.title);
    localStorage.setItem('fromTags', fromTags ? fromTags.join(',') : '');
    //带加入跳入ABtest链接
    location.assign(`/api-jiazhuang/c/hxapp/style/styleTest?source=${source}_${sourceString}&mid=${mId}&back=h5&open=1`);
    // if (Host.path.indexOf('uat1') > -1) {
    //   location.href = `http://api-jiazhuang.uat1.rs.com/c/hxapp/style/styleTest?source=${source}_${sourceString}&mid=${mId}&back=h5&open=1`;
    // } else if (Host.path.indexOf('mklmall') > -1) {
    //   location.href = `https://api-jiazhuang.mklmall.com/c/hxapp/style/styleTest?source=${source}_${sourceString}&mid=${mId}&back=h5&open=1`;
    // } else if (Host.path.indexOf('mmall') > -1) {
    //   location.href = `https://api-jiazhuang.mmall.com/c/hxapp/style/styleTest?source=${source}_${sourceString}&mid=${mId}&back=h5&open=1`;
    // }
  }

  render() {
    const { detailInfo, share, initShareData } = this.state;
    const { content, title } = detailInfo;
    return (
      <div className="pageWrap img-center">
        <Nav title="" share={share} initShareData={initShareData} showTip={true} hideNav={true} />
        <div className="articleInfo">
          <div className="articleTitle">{title}</div>
          <RichText description={content} preview="false" />
        </div>
        {
          Env.rsApp &&
          <Footer
            id={this.listId}
            collect={this.collect}
            initCollectData="true"
            likeType="liked_choice_album"
            forwardConsultPage={this.forwardConsultPage}
          />
        }
      </div>
    )
  }
}
