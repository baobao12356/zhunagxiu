import React ,{Component} from 'react'
import './style.scss'
import Appointment from '../appointment/appointment'
import HybridShare from 'rs-hybrid-share';
import HybridBack from 'rs-hybrid-back';
import back from '../../../../lib/scripts/back';
import BigData from '../../../../lib/scripts/bigData';
import Env from 'rs-browser';
import HybridBridge from 'rs-hybrid-bridge';
import _ from 'lodash'

export default class NewHeader extends Component {
  constructor(props){
    super(props)
    let that = this
    that.point = new BigData()
    that.hybridBack = new HybridBack();
    that.hybridShare = new HybridShare();
    that.hybridBridge = new HybridBridge(window);
    that.onHybridBridge = that.handleAppoint.bind(that);
    this.goBack = this.goBack.bind(this)
    this.handleAppoint = this.handleAppoint.bind(this)
  }

  componentWillMount(){
    window.addEventListener('scroll', this.isScrollTop.bind(this));
  }

  isScrollTop(){
    let scrollTop = document.body.scrollTop,
        coefficient = scrollTop/200>1?1:scrollTop/200,
        share = this.header.childNodes[1].lastElementChild,
        back = this.header.childNodes[0],
        appoint = this.header.childNodes[1].firstElementChild;
        share.style.filter = `invert(${coefficient})`
        back.style.filter = `invert(${coefficient})`
        back.style.WebkitFilter= `invert(${coefficient})`
        share.style.WebkitFilter = `invert(${coefficient})`
        this.header.style.backgroundColor = `rgba(255,255,255,${coefficient})`
        this.header.style.borderBottom = `1px solid rgba(241,241,241,${coefficient})`
        if(scrollTop>400){
          appoint.style.opacity = scrollTop/400>1?1:scrollTop/400
          this.header.style.borderBottom = `1px solid rgba(241,241,241,1)`
        }else if(scrollTop<400){
          appoint.style.opacity = 0
        }

  }


  goBack(){
    console.log(this)
    back();
  }

  goShare(shareData){
    console.log(shareData)
    this.point.f('110.300.55.59.69.79.09', 'deco', 'page.designer.share','', '');
    this.hybridShare.open(...shareData);
  }

  handleAppoint() {
    //预约埋点
    this.point.f('110.300.49.58.68.78.91', 'deco', 'page.designer.share','designer_reserver_comfirm', 'p_reservation');

    let parameter = {
      roleType: "1",
      designerId: this.props.id,
      tag: 9
    }
    this.hybridBridge.hybrid('call_native', parameter).then((result)=> {}).catch((error)=> {
      console.log('跳转native设计师预约失败')
    });
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(this.props, nextProps) || !_.isEmpty(this.props)) {
      return false
    }
    return true
  }

  render(){
    const {shareData}=this.props
    return(
      <div className="gradientHeader" style={{paddingTop:Env.ios?"20px":""}} ref ={node=>{this.header = node}}>
        <div className="back" onClick={this.goBack}></div>
        <div className="headerBtns">
          <div className="appoint"  onClick={this.handleAppoint} >约TA</div>
          <div className="share"  onClick={this.goShare.bind(this,shareData)} ></div>
        </div>
      </div>
    )
  }


}
