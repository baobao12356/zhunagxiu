import React from 'react';
import cs from 'classnames';
import BigData from '../../../lib/scripts/bigData';
import Banner from './banner';
import PriceInfo from './priceInfo';
import DesginBackground from './desginBackground';
import DesignersInfo from './designersInfo';
import CasesDetails from './casesDetails'
import onfire from 'onfire.js';
import queryString from 'query-string';
import CaseDetailModel from '../../../models/CaseDetailModel';
import './style.scss';
import '../../../lib/scss/base.scss';
import Nav from '../../../lib/components/nav'
import Collect from '../../../lib/components/collect'
import Like from '../../../lib/components/like'
import Comment from '../../../lib/components/comment'
import Appoint from '../../../lib/components/appoint'
import Env from 'rs-browser';
import Host from '../../../lib/scripts/config_host';
import WXshare from '../../../lib/scripts/WXshare';


export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.isAppEntry = params.app;
    this.detailId = params.detailId;
    this.caseId = params.detailId;
    this.state = {
      detailInfo: [],
      bottomInfo: {},
      share: {},
      initShareData: false,
      webPadding: false
    };
    this.WXshare = new WXshare();
    this.handlePointF = this.handlePointF.bind(this);
  }

  componentWillMount() {
    //大数据埋点
    //try{
    //  let p_domain = '';let domain = {dev: 'dev.rs.com', uat: 'uat1.rs.com', stg: 'mklmall.com', prd: 'mmall.com'};
    //  if(window.__config_env){
    //    p_domain = window.__config_env.host1;
    //    console.log('p_domain_window:',p_domain)
    //  }else{
    //    p_domain = domain[this.state.ENV]
    //  };
    //  let objs = {
    //    page: '110.200.20.00.00.000.36',
    //    p_channel: 'deco',
    //    p_domain: p_domain || '',
    //    p_type: 'page.case.detail',
    //    p_title: '',
    //    p_id: this.caseId
    //  };
    //  window.POINTER.p_pointer(objs);
    //}catch (e){
    //  console.log(e)
    //}
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
    this.handleCaseDetail(this.caseId);
    //    _this.point.pzs('110.300.55.58.68.78.13','110.300.55.58.68.78.13','110.300.55.58.68.78.09', 'deco', 'app_page_deco_case', '', this.caseId, 'mmall.com');
  }
  handleCaseDetail(detailId) {
    let _this = this;
    CaseDetailModel.ReceiveCaseDetail(detailId)
      .then((data) => {//设置详情状态
        console.log('data111111111', data)
        data.dataMap.casesId = this.caseId;
        document.title = data.dataMap.title || '案例详情';

        let share = {
          title: data.dataMap.title || '',
          img: data.dataMap.caseImgUrl + '.200x200.png!' || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          link: `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${_this.detailId}`,
          record: true,
          objectId: _this.detailId,
          objectType: 'comment_case',
          text: '真想立刻住进TA设计的家！'
        };

        this.setState({
          detailInfo: data.dataMap,
          bottomInfo: {
            id: this.caseId,
            objectType: 'case',
            className: 'liked'
          },
          share: share,
          initShareData: true
        });
        _this.WXshare.WXshareInfo(share);
      });
  }

  handlePointF(id, p_action_id) {
    this.props.f({
      id,
      p_action_id
    })
  }

  render() {
    let collect = {
      sourceType: '5',
      channel: 'deco',
      picture: this.state.detailInfo.caseImgUrl + '.200x200.png!' || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
      title: this.state.title || ''
    };
    const pointShare = { id: '3276', tag: '案例', p_action_id: `tag=案例&contentid=${this.articleId || ''}` };
    const pointComment = { id: '3378', tag: '案例', p_action_id: `tag=案例&contentid=${this.articleId || ''}` };
    const pointLike = { id: '3379', tag: '案例', p_action_id: `tag=案例&contentid=${this.articleId || ''}` };
    const collectBigData = { id: '3380', p_action_id: `tag=案例&contentid=${this.articleId || ''}` };
    const pointAppoint = { id: '3381', tag: '案例', p_action_id: `tag=案例&contentid=${this.articleId || ''}` };
    return (
      <div className={cs({ "pageWapper": true, 'app-wrap': Env.rsApp, 'ios-nav': Env.rsApp && Env.ios, 'webPadding': this.state.webPadding, 'img-center': true })}>
        <Nav initShareData={this.state.initShareData} share={this.state.share} title='案例详情' hideNav="true" showTip="true" />
        <Banner detailInfo={this.state.detailInfo} />
        <PriceInfo detailInfo={this.state.detailInfo} />
        <DesginBackground detailInfo={this.state.detailInfo} />
        <DesignersInfo detailInfo={this.state.detailInfo} caseId={this.caseId} pageFrom="app-alzd-10001" handlePointF={this.handlePointF} />
        <CasesDetails detailInfo={this.state.detailInfo} detailTitle={this.state.share} />
        {Env.rsApp && <div className={cs({ "footer": true, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX })}>
          <Comment id={this.caseId} type="comment_case" noCount="true" caseDetail="true" f={this.props.f} pointComment={pointComment} />
          <Like id={this.caseId} likeType='liked_case' caseDetail="true" pointLike={pointLike} f={this.props.f} />
          <Collect id={this.caseId} collect={collect} initCollectData={true} caseDetail="true" f={this.props.f} collectBigData={collectBigData} />
          <Appoint sourceFrom="27001" sourceType="4" pageFrom="app-alxqdx-10001" text="立即预约" designerId={this.state.detailInfo.designerId} caseId={this.caseId} pointAppoint={pointAppoint} f={this.props.f} />
        </div>}
      </div>
    );
  }
  //id,点赞类型，收藏类型，频道，评论类型

}
