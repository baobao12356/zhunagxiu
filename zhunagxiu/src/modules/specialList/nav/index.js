import React, { Component } from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import Share from 'rs-hybrid-share';
import Collect from '../../../lib/components/collect';
import Like from '../../../lib/components/like';
import Host from '../../../lib/scripts/config_host';
import back from '../../../lib/scripts/back';
import AppDownloadTip from '../../../lib/components/appDownloadTip';
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
      praiseNum: 0,
      //backImg:""
    };
  }

  componentDidMount() {
    this.$nav = this.refs.nav;
    if (this.props.scroll) {
      this.navScroll();
    }
  };

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   backImg:nextProps.backImg
    // })
    //alert(JSON.stringify(nextProps));
    if (!nextProps.initShareData || this.share) {
      return;
    }
    //alert(JSON.stringify(nextProps));
    const share = nextProps.share;
    for (const i in share) {
      if (!share[i]) {
        delete share[i];
      }
    }
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
    let { shareIcon, id, collect, initCollectData, likeType, collectNum, praiseNum } = this.props;
    let divShow = false;
    const { shopId } = this.props;
    let title;
    //alert(JSON.stringify(this.props.share));
    if (String(this.props.title).length > 13) {
      title = String(this.props.title).substring(0, 13) + '...'
    } else {
      title = String(this.props.title)
    }
    let className;

    if (!Env.rsApp && shareIcon) {
      shareIcon = false;
    }

    if (!Env.rsApp) {
      divShow = true;
    }

    console.log('shareIcon', shareIcon);
    return (
      <div>
        {
          Env.rsApp &&
          <nav className="bottomNav">
            <div className="back" onClick={this.handleBack}></div>
            <div className="praise">
              <Like
                id={id}
                likeType={likeType}
                addPraiseNum={this.props.addPraiseNum}
                subtractPraiseNum={this.props.subtractPraiseNum}
              />
              <span className="praiseNum">{praiseNum == 0 ? '' : praiseNum}</span>
              {/*
          <div className="praiseImg"></div>
          <span className="praiseNum">999+</span>
          */
              }
            </div>
            <div className="collect">
              <Collect
                id={id}
                collect={collect}
                initCollectData={initCollectData}
                addCollectNum={this.props.addCollectNum}
                subtractCollectNum={this.props.subtractCollectNum}
              />
              <span className="collectNum">{collectNum == 0 ? '' : collectNum}</span>
            </div>
            <div className="share" onClick={this.handleShare}></div>
          </nav>
        }
      </div>


      // <div className={className}>
      //     {this.props.showTip && divShow && <AppDownloadTip/>}
      //   {
      //     Env.rsApp && <nav className={Env.ios?"com-page-navIos":"com-page-nav"} ref="nav">
      //       <span className={this.state.backImg?"back":"backW"} onTouchStart={this.handleBack} />
      //       { shopId && <span className="shop" onTouchStart={this.handleShop} /> }
      //       { shareIcon && <span className="share" onTouchStart={this.handleShare} /> }
      //       { title && <div>{title}</div> }
      //     </nav>
      //   }
      //     {(!this.props.showTip || !this.props.hideNav) && !Env.rsApp &&
      //       <nav className="com-page-nav" ref="nav">
      //         <span className={this.state.backImg?"back":"backW"} onTouchStart={this.handleBack} />
      //         { shopId && <span className="shop" onTouchStart={this.handleShop} /> }
      //         { shareIcon && <span className="share" onTouchStart={this.handleShare} /> }
      //         { title && <div>{title}</div> }
      //       </nav>
      //     }
      //   </div>
    );
  }
}
