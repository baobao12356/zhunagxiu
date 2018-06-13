/**
 * Created by feifei on 2017/6/13.
 *
 * navType:0——带标题不改变样式；1——不带标题滚动改变样式
 */
import React, {Component} from 'react';
import './navigator.scss';
import HybridShare from 'rs-hybrid-share';
import HybridBack from 'rs-hybrid-back';
import Hybrid from '../../../lib/scripts/hybrid';


export default class Navigator extends Component {


  constructor(props) {
    super(props);
    const that = this;

    that.onBack = that._onBack.bind(that);
    that.onShare = that._onShare.bind(that);
    that.hybridBack = new HybridBack();
    that.hybridShare = new HybridShare();

    that.state={
      shareData:[],
      paddingTop: '0.53333rem',
      title:''
    };
  }

  _onBack(){
    if(Hybrid.isApp){
      this.hybridBack.back();
    }else{
      window.history.go(-1)
    }
  }
  _onShare(){
    let shareData = this.state.shareData;
    console.log(shareData);
    this.hybridShare.open(...shareData);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      shareData: nextProps.shareData,
      title:nextProps.title
    });
    if(Hybrid.os.android){
      this.setState({
        paddingTop:0
      })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }


  handleScroll(e) {
    if(this.props.navType == 1) {
      let scrollTop = document.body.scrollTop;
      if (scrollTop > 180) {
        this.refs.nav.className = "nav0";
        this.refs.title.style.opacity = 1
      } else {
        this.refs.nav.className = "";
        this.refs.title.style.opacity = 0
      }
    }
  }

  render() {
    const that = this;
    let style1,style2,style3;
    if(Hybrid.isApp) {
      style2 = {display:'block'}
    }
    if(that.props.navType ==0) {
      style1 = {opacity:1};
    }
    style3 = {paddingTop:this.state.paddingTop};
    return (
      <nav ref="nav" className={'nav'+that.props.navType} style={style3}>
        <div className="back" onClick={that.onBack}></div>
        <div  ref="title" className="articleTitle" style={style1}>{that.state.title}</div>
        <div className="shareSpan" style={style2} onClick={that.onShare}></div>
      </nav>
    )
  }
}
