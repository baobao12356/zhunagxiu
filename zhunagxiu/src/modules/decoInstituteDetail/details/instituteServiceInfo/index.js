/**
 * Created by feifei on 2017/12/20.
 */
import React from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';
import Tags from '../tags'

export default class InstituteServiceInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailInfo: ''
    };
    this.goToMap = this.goToMap.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      detailInfo: nextProps.detailInfo
    })
  }

  goToMap() {
    // this.props.handlePointF('3018');
    this.props.f({
      id:'3018',
      // p_action_id
    })
    const dataNative = {
      tag: '69',
      latitude: this.state.detailInfo.addressLatitude,
      longitude: this.state.detailInfo.addressLongitude,
      address: this.state.detailInfo.companyAddress,
      description: this.state.detailInfo.companyAppellation
    };
    console.log(dataNative);
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  render() {

    return (
      <div className="instituteServiceInfo">
        <div className="instituteCompanyAddress" onClick={this.goToMap.bind(this)}><div>公司地址：{this.state.detailInfo.companyAddress || ''}</div><div className="instituteOther"></div></div>
        {
          this.state.detailInfo.subbranchs ?
            <div onClick={this.props.showShops}>分部地址<div className="instituteOther"></div><span><span style={{ 'color': '#dfaf7D' }}>{this.state.detailInfo.subbranchCounts}</span> 个地址</span></div>
            : ''
        }
      </div>
    )
  }

}
