import React, {Component} from 'react';
import HybridBridge from 'rs-hybrid-bridge';
import './style.scss'
export default class IMbtns extends Component{
  constructor(props){
    super(props)
    this.hybridBridge = new HybridBridge(window);
    this.state = {
      designerOpenId:''
    }
  }


  toIMdialog(){
    const parameter = {
      "targetOpenId":this.props.designerOpenid.openId,
      "type":3,
      "tag":7
    }
    console.log(parameter)
    let that = this
    that.hybridBridge.hybrid('call_native', parameter).catch((error)=> {
      console.log('跳转IM失败')
    });

  }

  render(){
    return(
      <div className="IMbtn">
        在线&#8195;|
        <div onClick = {this.toIMdialog.bind(this)}>
          <i></i>
          聊一聊
        </div>
      </div>
    )
  }


}
