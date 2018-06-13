import React from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import onfire from 'onfire.js';
import BigData from '../../../lib/scripts/bigData';
import queryString from 'query-string';
import decoShoppingListModel from '../../../models/decoShoppingListModel';
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
    this.handleShoppingList(this.detailId);
  }

  handleShoppingList(detailId){
    let _this = this;
    decoShoppingListModel.ReceiveShoppingList(detailId).then((data)=>{
      console.log(data)


      this.setState({
        detailInfo: data,
      });

    })
  }

  goShoppingDetail(id){
    if(window.location.protocol != 'file:'){
      window.location = Host.path+`/mainapp/decoShoppingDetail.html?detailId=${id}&back=h5`;
    }else{
      window.location = Host.path+`/mainapp/decoShoppingDetail.html?detailId=${id}&back=file`;
    }
  }

  render(){
    let details = this.state.detailInfo.dataMap && this.state.detailInfo.dataMap.map((item,idx)=>{
      let goodsDetailVoList = item.goodsDetailVoList && item.goodsDetailVoList.map((val,idx)=>{
        return(
            <li key={idx} onClick={this.goShoppingDetail.bind(this,val.id)}>
              <p className="shopTitle">{val.goodsName}</p>
              <p className="shopTag">
                {
                  val.purchasePlace && <span>{val.purchasePlace}</span>
                }
                {
                  val.category && <span>{val.category}</span>
                }
                {
                  val.brand && <span>{val.brand}</span>
                }
              </p>
              <span className="price">¥{val.total}</span>
            </li>
        )
      });
      return(
        <div className="details" key={idx}>
          <div className="title">{item.category}</div>
          <ul className="shoppingList">
            {goodsDetailVoList}
          </ul>
        </div>
      )
    })
    return (
      <div className={cs({"pageWapper":true,'app-wrap':Env.rsApp,'ios-nav': Env.rsApp && Env.ios,'webPadding':this.state.webPadding,'img-center': true})}>
        <Nav title='装修清单'  share={false} shareIcon={false}  initShareData="false"   showTip={true} hideNav={true}  onlyH5={true}/>
        {details}
      </div>
    )
  }
}
