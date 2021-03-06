import React, { Component } from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import Share from 'rs-hybrid-share';
import Host from '../../scripts/config_host';
import back from '../../scripts/back';
import AppDownloadTip from '../appDownloadTip';
import Collect from '../collect';
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
export default class NavTrans2 extends Component {

  static defaultProps = {
    shareIcon: true
  };

  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.$nav = null;
    this.elementHeight = 0;
    this.state = {
      navTop: true,
      collect: { sourceType: '33' }
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
      detailId: nextProps.detailId
    })
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
    if (!this.share) {
      console.log('收藏数据未初始化完成');
      return;
    }
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
              <Collect id={detailId} collect={collect} initCollectData={true} corpDetail="true" />
            </div>
            {title && <div>{title}</div>}
          </nav>
        }
        {(!this.props.showTip || !this.props.hideNav) && !Env.rsApp &&
          <nav className="com-page-nav" ref="nav" id="nav">
            <span className="back" onTouchStart={this.handleBack} />
            {title && <div>{title}</div>}
          </nav>
        }
      </div>
    );
  }
}
