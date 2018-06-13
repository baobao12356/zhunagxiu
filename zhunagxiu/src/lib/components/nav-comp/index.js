import React, { Component } from 'react';
import RSBrowser from 'rs-browser';
import { NavBar } from 'antd-mobile';
import HybridBack from 'rs-hybrid-back';

import './style.scss';

/* nav 参考文章详情页
 *props:
 * mode 模式 string 'dark' enum{'dark', 'light'}
 * icon 出现在最左边的图标占位符 ReactNode -
 * leftContent 导航左边内容 any 无
 * rightContent 导航右边内容 any 无
 * onLeftClick 导航左边点击回调 (e: Object): void 无
 * theme 主题 string 'transparent' 或者 无
 * critical 临界值 integer 主题是transparent的时候,需要变化的临界点高度.
 * */
class NavComp extends Component {

  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      theme: '',
      navMainOpacity: 1
    };
  }

  componentWillMount() {
    const { container = window, theme } = this.props;
    this.container = container;
    // 透明
    if (theme === 'transparent') {
      this.state.navMainOpacity = 0;
    }
  }

  componentDidMount() {
    const { theme } = this.props;
    this.headerHeight = parseInt(window.getComputedStyle(
      this.headerElem.getElementsByClassName('am-navbar')[0]).height.replace('px', ''), 10);
    if (theme === 'transparent') {
      this.container.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    this.container.removeEventListener('scroll', this.handleScroll);
  }

  handleBack() {
    if (window.location.href.indexOf('back=h5') !== -1) {
      window.history.back();
    } else {
      new HybridBack().back();
    }
  }
  // async onShare(shareResult) {
  //   const { onShare } = this.props;
  //   onShare && onShare(shareResult);
  // }

  // handleShare() {
  //   const { shareInfo } = this.props;
  //   if (shareInfo) {
  //     const { title, text, img, link, record, objectId, objectType } = shareInfo;
  //     /**
  //      * 分享: status: -1:fail,0:用户取消分享,1:用户分享成功
  //      * data.shareType 微信好友: wxFriend, 微信盆友圈:wxAppMessage, 微博:weibo, QQ: qq
  //      */
  //     new HybridShare().open(title, text, img, link, record, objectId, objectType).then(({
  //       status = 0,
  //       data = {
  //         shareType: 'wxFriend'
  //       }
  //     }) => {
  //       this.onShare({ status, data });
  //     });
  //     // this.props.f && this.props.pointShare && this.props.pointShare.id && this.props.f(this.props.pointShare);
  //   }
  // }

  handleScroll() {
    const sTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    const { critical = this.headerHeight } = this.props;
    let navMainOpacity = (sTop) / critical;
    if (navMainOpacity > 0.7) {
      navMainOpacity = 0.7;
    }
    if (sTop > critical) {
      navMainOpacity = 1;
    }
    this.setState({
      navMainOpacity
    });
  }


  componentWillReceiveProps(nextProps) {
    const { theme } = nextProps;
    // 透明
    if (theme === 'transparent') {
      this.state.navMainOpacity = 0;
      this.handleScroll();
    } else {
      this.state.navMainOpacity = 1;
    }
  }

  render() {
    const { className: propClassName,
      onLeftClick = this.handleBack,
      style,
      icon = <i className="com-nav-iconfont icon-back" />,
      mode = 'light',
      rightContent,
      leftContent
    } = this.props;
    const { theme = '' } = this.props;

    let navBarStyle = null;
    // 透明
    const { navMainOpacity } = this.state;
    let overCritical = '';
    if (navMainOpacity !== 1) {
      navBarStyle = { backgroundColor: `rgba(255,255,255, ${navMainOpacity})` };
    } else {
      overCritical = 'over-critical';
    }
    const rightContentElem = rightContent;
    let iosNavClass = '';
    if (RSBrowser.rsApp && RSBrowser.ios) {
      iosNavClass = 'ios-nav';
      if (RSBrowser.iPhoneX) {
        iosNavClass = 'ios-nav iphone-x';
      }
    }
    const rootClassName = `nav-comp ${theme} ${overCritical} ${propClassName} ${iosNavClass}`;

    return (
      <div
        className={rootClassName} ref={(elem) => {
          this.headerElem = elem;
        }}
        style={style}
      >
        <NavBar
          mode={mode}
          icon={icon}
          onLeftClick={onLeftClick}
          style={navBarStyle}
          leftContent={leftContent}
          rightContent={rightContentElem}
        >
          {this.props.children}
        </NavBar>
      </div>
    );
  }
}
export default NavComp;
