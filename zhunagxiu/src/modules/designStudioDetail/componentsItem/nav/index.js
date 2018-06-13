import React, { Component } from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import Share from 'rs-hybrid-share';
import Host from '../../../../lib//scripts/config_host';
import back from '../../../../lib//scripts/back';
import AppDownloadTip from '../../../../lib/components/appDownloadTip';
import Concern from '../concern';

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
export default class Nav extends Component {

  static defaultProps = {
    shareIcon: true
  };

  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleShop = this.handleShop.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.$nav = null;
    this.elementHeight = 0;
    this.state = {
      navTop: true,
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
    const share = nextProps.share;
    console.log(share)
    for (const i in share) {
      if (!share[i]) {
        delete share[i];
      }
    }
    console.log(share)
    this.share = Object.assign({
      title: '标题',
      text: '立即查看详情，悦享红星美凯龙高端品质服务-为中国设计而生',
      img: 'http://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png',
      record: false
    }, share);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleShop() {
    let { shopId } = this.props;
    if (shopId.indexOf('flagship') > 0) {
      shopId = shopId.replace('flagship', '');
      location.href = `${Host.path}/flagshipShop?id=${shopId}&back=h5`;
    } else {
      location.href = `${Host.path}/shopDetail?id=${shopId}&back=h5`;
    }
  }

  handleBack() {
    back();
  }

  handleShare() {
    if (!this.share) {
      console.log('收藏数据未初始化完成');
      return;
    }
    console.log(this.share)
    const { title, text, img, link, record, objectId, objectType } = this.share;
    new Share().open(title, text, img, link, record, objectId, objectType);
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

    let { shareIcon, designerId } = this.props;
    let divShow = false;
    const { shopId } = this.props;
    let title;
    if (String(this.props.title).length > 13) {
      title = String(this.props.title).substring(0, 13) + '...'
    } else {
      title = String(this.props.title)
    }
    const className = cs({
      'fix-header': true,
      'ios-nav': !!(Env.rsApp && Env.ios),
      'ios-iPhoneX': !!(Env.iPhoneX && Env.rsApp && Env.ios),
      'fixed': this.props.scroll ? this.state.navTop : false
    });

    if (!Env.rsApp && shareIcon) {
      shareIcon = false;
    }

    if (!Env.rsApp) {
      divShow = true;
    }

    return (
      <div className={className}>
        {this.props.showTip && divShow && <AppDownloadTip />}
        {
          Env.rsApp && <nav className="com-page-nav" ref="nav">
            <span className="back" onTouchStart={this.handleBack} />
            {/* shareIcon && <Concern id = {designerId}  initConcernData={true}/> */}
            {title && <div>{title}</div>}
          </nav>
        }

      </div>
    );
  }
}
