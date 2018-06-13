import React, { Component } from 'react';
import cs from 'classnames'
import Env from 'rs-browser';
import './style.scss'
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../../../lib/scripts/bigData';
import Concern from '../concern'

export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.point = new BigData()
    const that = this;
    this.state = {
      designerOpenId: '',
      text: ''
    };
    this.handleAppoint = this.handleAppoint.bind(this)
    this.toImTalk = this.toImTalk.bind(this)
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
    if (!!this.props.openId) {
      const { designerImage, companyName, designerName, id } = this.props
      const dataNative = {
        tag: '7',
        type: '9',
        targetOpenId: this.props.openId,
        decoImInfo: {
          id: id,
          type: '9',
          name: ``,
          avatar: ``,
          workName: designerName,
          workAvatar: designerImage,
          companyName: companyName,
          extra: ''
        }
      };
      console.log(dataNative)
      new HybridBridge(window).hybrid('call_native', dataNative)
    }
    this.props.handlePointF('3029');
  }

  handleAppoint(e) {
    const { desName } = this.props.desName || "";
    const { fid } = this.props;
    console.log('didddddddddddddd', fid);
    this.props.handlePointF(fid);
    let parameter = {
      roleType: "5",
      designStudioId: this.props.id,
      tag: 9,
      pageFrom: "app-sjsdx-10001"
    }
    console.log(parameter)
    this.hybridBridge.hybrid('call_native', parameter);
  }

  render() {
    console.log(this.props.openId)
    const { text, cls, bottom } = this.props
    return (
      <div className={cs({ "footer": true, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX })}>
        {Env.rsApp ?
          <div className="appoint_bottom_btn" onClick={this.handleAppoint} >
            预约
     </div> : ''
        }
      </div>

    )
  }



}
