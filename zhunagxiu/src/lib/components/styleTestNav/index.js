import React, {Component} from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import Share from 'rs-hybrid-share';
import Host from '../../scripts/config_host';
import back from '../../scripts/back';
import AppDownloadTip from '../appDownloadTip';
import './style.scss';
import BigData from '../../scripts/bigData';
import HybridBridge from 'rs-hybrid-bridge';

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
    this.hybridBridge = new HybridBridge(window);
    this.handleBack = this.handleBack.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleShop = this.handleShop.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.$nav = null;
    this.elementHeight = 0;
    this.state = {
      navTop: true,
      iphoneX:""
    };
    this.point = new BigData();
  }

  componentWillMount(){
    var that = this
    this.hybridBridge.hybrid('FromNativeParms', '').then((result)=> {
      if(!!result && result.iPhone_X != "undefined"){
        that.setState({
          iphoneX:result.iPhone_X
        })
        // that.iphoneX = result.iPhone_X
      }
    })
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
    for (const i in share) {
      if (!share[i]) {
        delete share[i];
      }
    }
    this.share = Object.assign({
      title: '标题',
      text: '立即查看详情，悦享红星美凯龙高端品质服务-为中国设计而生',
      img: 'http://wap.mmall.com/images/logo.jpg',
      record: false
    }, share);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleShop() {
    let {shopId} = this.props;
    if (shopId.indexOf('flagship') > 0) {
      shopId = shopId.replace('flagship', '');
      location.href = `${Host.path}/flagshipShop?id=${shopId}&back=h5`;
    } else {
      location.href = `${Host.path}/shopDetail?id=${shopId}&back=h5`;
    }
  }

  handleBack(pointData) {
    if(!!pointData){
      this.point.f(pointData.page,pointData.channel,pointData.type,pointData.title,pointData.item);
    }
      back();
  }

  handleShare() {
    if (!this.share) {
      console.log('收藏数据未初始化完成');
      return;
    }
    const {title, text, img, link, record, objectId, objectType} = this.share;
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
    let {shareIcon,iPhone_X} = this.props;
    let {point} = this.props;
    let divShow = false;
    const {title, shopId} = this.props;
    const className = cs({
      'iphone_X':!!iPhone_X,
      'fix-header':true,
      'ios-nav': !!(Env.rsApp && Env.ios),
      fixed: this.props.scroll ? this.state.navTop : false
    });

    if (!Env.rsApp && shareIcon) {
      shareIcon = false;
    }

    if(!Env.rsApp){
      divShow = true;
    }

    return (
      <div className={className}>
          {this.props.showTip && divShow && <AppDownloadTip/>}
        {
          Env.rsApp && <nav className="com-page-nav titleCls" ref="nav">
            <div className="close" onTouchStart={this.handleBack.bind(this,point)}></div>
            {title && <div>{title}</div> }
          </nav>
        }
          {(!this.props.showTip || !this.props.hideNav) && !Env.rsApp &&
            <nav className="com-page-nav titleCls" ref="nav">
              <div className="close" onTouchStart={this.handleBack.bind(this,point)}></div>
              {/*<span className="back" onTouchStart={this.handleBack.bind(this,point)} />*/}
               { title && <div>{title}</div> }
            </nav>
          }
        </div>
    );
  }
}
