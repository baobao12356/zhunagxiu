import React from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import onfire from 'onfire.js';
import BigData from '../../../lib/scripts/bigData';
import queryString from 'query-string';
import decoShoppingDetailModel from '../../../models/decoShoppingDetailModel';
import './style.scss';
import Host from '../../../lib/scripts/config_host';
import WXshare from'../../../lib/scripts/WXshare';
import Nav from '../../../lib/components/nav';

export default class Details extends React.Component {
  constructor(props){
    super(props);
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.state = {
      detailInfo: {},
      webPadding:false
    }
    this.WXshare = new WXshare();
  }


  componentWillMount(){
    /*let _this = this;*/
    if(!Env.rsApp){
      this.setState({
        webPadding:true
      })
    }
    onfire.on('closeTip',() => {
      this.setState({
        webPadding:false
      })
    });
    this.handleShoppingDetail(this.detailId);
  }

  handleShoppingDetail(detailId){
    let _this = this;
    decoShoppingDetailModel.ReceiveShoppingDetail(detailId).then((data)=>{
      console.log(data)

      this.setState({
        detailInfo: data.dataMap,
        initShareData: true,
      });

    })
  }

  render(){

    return (
      <div className={cs({"pageWapper":true,'app-wrap':Env.rsApp,'ios-nav': Env.rsApp && Env.ios,'webPadding':this.state.webPadding, 'img-center': true})}>
        <Nav title='装修清单详情'  share={false} shareIcon={false}  initShareData="false" showTip={true} hideNav={true} onlyH5={true}/>
        <div className="details">
          <table className="detailList">
            <tbody>
            <tr>
              <td>名称</td>
              <td>{this.state.detailInfo.goodsName}</td>
            </tr>
            <tr>
              <td>总价</td>
              <td>{this.state.detailInfo.total}</td>
            </tr>
            <tr>
              <td>数量</td>
              <td>{this.state.detailInfo.number}</td>
            </tr>
            <tr>
              <td>品牌</td>
              <td>{this.state.detailInfo.brand}</td>
            </tr>
            <tr>
              <td>规格款式</td>
              <td>{this.state.detailInfo.specifications}</td>
            </tr>
            <tr>
              <td>购买地</td>
              <td>{this.state.detailInfo.purchasePlace}</td>
            </tr>
            <tr>
              <td>类型</td>
              <td>{this.state.detailInfo.category}</td>
            </tr>
            <tr>
              <td>备注</td>
              <td>{this.state.detailInfo.remark}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
