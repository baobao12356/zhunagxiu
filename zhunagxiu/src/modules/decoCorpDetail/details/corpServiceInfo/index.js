/**
 * Created by feifei on 2017/10/23.
 */
import React from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';
import Tags from '../tags'

export default class CorpServiceInfo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      detailInfo:''
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      detailInfo:nextProps.detailInfo
    })
  }

  render(){

    return  (
      <div className="corpServiceInfo">
        <div>特色服务：<Tags label={this.state.detailInfo.specialServiceStr||''}/></div>
        <div>成交价格：{this.state.detailInfo.acceptPriceStr ? (String(this.state.detailInfo.acceptPriceStr).replace(/,/, "，")) : ''}</div>
        <div className="corpCompanyAddress">公司地址：{this.state.detailInfo.companyAddress||''}</div>
        {
          this.state.detailInfo.subbranchs?
            <div>分部地址<div></div><span>全部{this.state.detailInfo.subbranchs.length}个地址</span></div>
            :''
        }
      </div>
    )
  }

}
