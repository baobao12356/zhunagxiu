import React ,{Component} from 'react'
import './style.scss'
import HeaderPic from '../headPic/headPic'
import Appointment from '../appointment/appointment'
import Concern from '../../../../lib/components/concern'
import HybridShare from 'rs-hybrid-share';
import HybridBack from 'rs-hybrid-back';
import back from '../../../../lib/scripts/back';
import BigData from '../../../../lib/scripts/bigData';
import Env from 'rs-browser';


export default class Header extends Component {
  constructor(props){
    super(props)
    let that = this
    that.point = new BigData()
    that.hybridBack = new HybridBack();
    that.hybridShare = new HybridShare();
  }


  goBack(){
    console.log(this)
    back();
  }

  goShare(shareData){

    this.point.f('110.300.55.59.69.79.09', 'deco', 'page.designer.share','', '');
    this.hybridShare.open(...shareData);
  }


  render(){

    const {designerUrl,text,openid,cls,id,shareData}=this.props,
      setHead = {
      imgUrl:designerUrl,
      sizeIdx:2,
      clsName:"designerHeaderPic"
    };

    let style;
    if(Env.ios){
      style = {paddingTop:'20px'}
    }

    return(
      <div className={cls} style={style}>
        <div className="desginerBack" onClick={this.goBack.bind(this)}><div className="back"></div></div>
        <div className="designerPic">
          {
            text?(!id?<HeaderPic {...setHead} />:"设计大师"):""
          }

        </div>
        <div className="btn">
          {
            text?(!designerUrl?<Concern id = {id} openid = {openid}  initConcernData={true} />:<Appointment text={text} id={id} openid = {openid} />):<div onClick={this.goShare.bind(this,shareData)} className="share"></div>
          }
        </div>
      </div>
    )
  }


}
