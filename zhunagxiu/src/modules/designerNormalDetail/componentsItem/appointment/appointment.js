import React, { Component } from 'react';
import Env from 'rs-browser';
import cs from 'classnames'
import './style.scss'
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../../../lib/scripts/bigData';
import Concern from '../concern';


export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.point = new BigData()
    this.toImTalk = this.toImTalk.bind(this)
    const that = this;
    this.state = {
      designerOpenId: '',
      text: ''
    };
    this.handleAppoint = this.handleAppoint.bind(this)
    that.hybridBridge = new HybridBridge(window);
    that.onHybridBridge = that.handleAppoint.bind(that);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      designerOpenId: nextProps.designerOpenId,
      text: nextProps.text
    })
  }


  toImTalk() {
    this.props.f && this.props.f({
      id: '2801',
    });
    if (!!this.props.openId) {
      const { designerImage, companyName, designerName, id } = this.props
      const dataNative = {
        tag: '7',
        type: '3',
        targetOpenId: this.props.openId,
        decoImInfo: {
          id: id,
          type: '3',
          name: designerName,
          avatar: designerImage,
          workName: ``,
          workAvatar: ``,
          companyName: companyName,
          extra: ''
        }
      };
      console.log(dataNative)
      new HybridBridge(window).hybrid('call_native', dataNative)
    }

  }

  handleAppoint(e) {
    const { desName } = this.props.desName || ""
    //预约埋点
    // this.point.f('110.300.49.58.68.78.91', 'deco', 'page.designer.reservation',desName, 'p_reservation');
    this.props.f && this.props.f({
      id: '2802',
    });
    let parameter = {
      roleType: "1",
      designerId: this.props.id || '',
      tag: 9,
      pageFrom: "app-sjsdx-10001",
      sourceType: "3"
    }
    this.hybridBridge.hybrid('call_native', parameter).then((result) => { }).catch((error) => {
      console.log('跳转native设计师预约失败')
    });
  }

  render() {
    const { text, cls, bottom } = this.props;
    const pointAttention = {
      id: '2800',
    };
    return (
      <div className={cs({ "footer": true, 'ios-iPhoneX': Env.rsApp && Env.iPhoneX })}>
        {Env.rsApp ?
          <div className={cs({ "appoint_bottom_btn": true })} onClick={this.handleAppoint} >
            预约
       </div> : ''
        }
      </div>
    );
  }
}
/*<span className="com-concern concerned"></span>*/

/*    <div className={cls} >
        {
          bottom &&
          <div className="icons">
            <Concern id = {this.props.id} openid = {this.props.openId}  initConcernData={true} pointAttention={pointAttention} f={ this.props.f}/>
            <span onClick={this.toImTalk} className={cs({"im":true,"underLine":!this.props.openId})}></span>
          </div>
        }
        <div onClick={this.handleAppoint}>预约</div>
      </div>*/
