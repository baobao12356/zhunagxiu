/**
 * Created by feifei on 2017/10/23.
 */
import React from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';
import adverImg from '../../../../imgs/common/adverImg.png'

export default class Advertisement extends React.Component{
  constructor(props){
    super(props)

  }


  goToNative(){
    const dataNative = {
      tag:'42',
      data:{}
    };
    // Hybrid.callHybridMethod('toDecoration', 'call_native', dataNative).then((data) => {});
    new HybridBridge(window).hybrid('call_native', dataNative);
  }



  render(){

    return  (
      //产品说先写死，以后改
      <div className="Advertisement">
        <div className="advertTtile clearfix">
          <div className="adverLeft" onClick={this.goToNative.bind(this)}>进入家装频道</div>
          <div className="adverRight" onClick={this.goToNative.bind(this)}>查看更多精彩内容></div>
        </div>
        <div className="adverImg" onClick={this.goToNative.bind(this)}>
          <img src={adverImg} alt=""/>
        </div>
      </div>
    )
  }

}
