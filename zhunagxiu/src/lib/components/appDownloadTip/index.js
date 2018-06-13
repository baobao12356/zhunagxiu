import React, { Component } from 'react';
import onfire from 'onfire.js';
import './style.scss';
import OpenApp from '../../scripts/openApp'

/* appDownloadTip wap站及分享落地页头部app下载横栏
 toscroll:是否滚动显隐， 默认不滚动
* */
export default class AppDownloadTip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tip: 'show'
    };

    this.handleClose = this.handleClose.bind(this);
    this.closeWxTip = this.closeWxTip.bind(this);
    this.scrollFn = this.scrollFn.bind(this);
  }

  scrollFn() {
    const doc = document;
    const sTop = doc.documentElement.scrollTop || window.pageYOffset || doc.body.scrollTop;
    const tipEle = doc.querySelectorAll('.com-app-download-tip')[0];
    const { tip } = this.state;
    if (sTop <= 0 && tip != 'hide') {
      tipEle.style.display = 'flex';
    } else if (sTop > 100) {
      tipEle.style.display = 'none';
    }
  }

  componentDidMount() {
    const _this = this;
    this.props.toscroll && window.addEventListener('scroll', _this.scrollFn, false);

    new OpenApp();

    onfire.on('appDownloadWxTipShow', () => {
      document.querySelectorAll('.com-app-download-tip .wx-tip')[0].style.display = 'block';
    });

  }

  componentWillUnmount() {
    const _this = this;
    window.removeEventListener('scroll', _this.scrollFn);
  }

  handleClose() {
    document.querySelector('.com-app-download-tip').style.display = 'none';
    const contentBox = document.querySelector('.contentBox');
    if (contentBox) {
      contentBox.style.marginTop = '40px';
    }
    this.setState({
      tip: 'hide'
    });

    // 关闭更改padding-top
    onfire.fire('closeTip');
  }

  closeWxTip() {
    document.querySelectorAll('.com-app-download-tip .wx-tip')[0].style.display = 'none';
  }

  render() {
    return (
      <div className="com-app-download-tip">
        <div className="logo-container">
        </div>
        <div className="info-container">
          <h5>红星美凯龙</h5>
          <h2>让日常不寻常</h2>
        </div>
        <div className="btn-container">
          <a id="btnOpenApp">立即打开</a>
        </div>
        <div className="close-container" onClick={this.handleClose}>
        </div>
        <div className="wx-tip" onTouchStart={this.closeWxTip}></div>
      </div>
    )
  }
}
