import React, { Component } from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import Share from 'rs-hybrid-share';
import Host from '../../scripts/config_host';
import back from '../../scripts/back';
import AppDownloadTip from '../appDownloadTip';
import Collect from '../collect';
import BigData from '../../scripts/bigData';


import './style.scss';
/* nav 参考文章详情页
 *props: title, shareIcon, share,scroll
 * shareIcon - 是否显示分享按钮
 * title - string，标题
 * share - object, 分享所需的参数
 * initShareData - 分享所需数据是否初始化完成
 * scroll - Bool 滚动时导航切换样式，默认false
 * showTip - Bool 是否需要推荐下载，默认false
 * hideNav - showTip与hideNav均为true，则nav隐藏
 * */
export default class NavTrans extends Component {

  static defaultProps = {
    shareIcon: true
  };

  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    //this.point = new BigData();

    this.$nav = null;
    this.elementHeight = 0;
    this.state = {
      navTop: true,
      collect: { sourceType: '30' }
    };
  }

  componentDidMount() {
    this.$nav = this.refs.nav;
    if (this.props.scroll) {
      this.navScroll();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.initShareData || this.share) {
      return;
    }

    this.setState({
      collect: nextProps.collect,
      detailId: nextProps.detailId,
    })
    const share = nextProps.share;
    for (const i in share) {
      if (!share[i]) {
        delete share[i];
      }
    }
    this.share = Object.assign({
      title: '标题',
      text: '立即查看详情，悦享红星美凯龙高端品质服务-为中国设计而生',
      img: 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
      record: false
    }, share);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleBack() {
    if (String(window.location).indexOf('back=h5') > -1) {
      window.history.go(-1);
      return false;
    } else {
      back();
    }
  }

  handleShare() {

    this.props.f && this.props.pointShare && this.props.pointShare.id && this.props.f(this.props.pointShare);
    if (!this.share) {
      console.log('收藏数据未初始化完成');
      return;
    }

    let { title, text, img, link, record, objectId, objectType } = this.share;
    if (this.props.score && text.indexOf('评分') < 0) {
      this.share.text = text + '\n\n' + this.props.score;
    }
    new Share().open(title, this.share.text, img, link, record, objectId, objectType);
  }

  navScroll() {
    const _this = this;
    if (this.$nav) {
      this.elementHeight = parseFloat(window.getComputedStyle(this.$nav).height);
      window.addEventListener('scroll', _this.handleScroll);
    }
  }

  handleScroll() {
    const sTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    if (sTop >= this.elementHeight) {
      this.setState({
        navTop: false
      });
    }
    if (!sTop || sTop < this.elementHeight) {
      this.setState({
        navTop: true
      });
    }

  }

  render() {
    let { shareIcon } = this.props;
    let divShow = false;
    const { title } = this.props;
    const className = cs({
      'fix-header': true,
      'ios-nav': !!(Env.rsApp && Env.ios),
      'ios-iPhoneX': !!(Env.iPhoneX && Env.rsApp && Env.ios),
      'fixed': this.props.scroll ? this.state.navTop : false
    });

    if (!Env.rsApp && shareIcon) {
      shareIcon = true;
    }

    if (!Env.rsApp) {
      divShow = true;
    }
    let detailId = this.props.detailId || this.state.detailId;
    let collect = this.props.collect || this.state.collect;

    return (
      <div className={className}>
        {this.props.showTip && divShow && <AppDownloadTip />}
        {
          Env.rsApp && <nav className="com-page-nav" ref="nav" id="nav">
            <span className="back" onTouchStart={this.handleBack} />
            <div className="collect">
              <Collect id={detailId} collect={collect} sourceType="30" initCollectData={true} corpDetail="true" collectBigData={this.props.collectBigData} f={this.props.f} />
            </div>
            {shareIcon && <span className="share" onTouchStart={this.handleShare} />}
            {title && <div>{title}</div>}
          </nav>
        }
        {(!this.props.showTip || !this.props.hideNav) && !Env.rsApp &&
          <nav className="com-page-nav" ref="nav" id="nav">
            <span className="back" onTouchStart={this.handleBack} />
            {shareIcon && <span className="share" onTouchStart={this.handleShare} />}
            {title && <div>{title}</div>}
          </nav>
        }
      </div>
    );
  }
}
