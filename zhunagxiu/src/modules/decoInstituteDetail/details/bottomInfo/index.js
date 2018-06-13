/**
 * Created by feifei on 2017/10/24.
 */
import React from 'react';
import './style.scss';
import cs from 'classnames';
import HybridBridge from 'rs-hybrid-bridge';
//import BigData from '../../../../lib/scripts/bigData';

export default class BottomInfo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      detailInfo:{},
      showBottomInfo:false,
      bottomInfoType:''
    }
    //this.point = new BigData();
    this.goToMap = this.goToMap.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      detailInfo:nextProps.detailInfo,
      showBottomInfo:nextProps.showBottomInfo,
      bottomInfoType:nextProps.bottomInfoType
    })
  }

  goToMap(description,address,latitude,longitude){
    const dataNative = {
      tag:'69',
      latitude:latitude,
      longitude:longitude,
      address:address,
      description:description
    };
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  render(){

    return  (
      <div className={cs({"bottomInfo":true,"bottomInfotrue":this.state.showBottomInfo})}>
        <div className="dialogBox">
          <div className="dialogName">{this.state.bottomInfoType && this.state.bottomInfoType == "sale" ? "促销" : "全部地址"}</div>
          <div className="dialogContent">

            {this.state.bottomInfoType == "sale" ?
              <div className="saleBoxs">
                <div className="diallogTilte"><div className="saleIcon">惠</div><div>{this.state.detailInfo.shopActivityTitle}</div></div>
                <div className="dialogDesc">
                  {this.state.detailInfo.shopActivity}
                </div>
              </div>:
              <div className="address">
                {this.state.detailInfo.subbranchs?
                  this.state.detailInfo.subbranchs.map((item,idx)=>{
                    return <div className="adrItem" key={idx} onClick={this.goToMap.bind(this,item.subbranchName,item.subbranchAddress,item.addressLatitude,item.addressLongitude)}>
                      <div>{item.subbranchName}</div>
                      <div>{item.subbranchAddress}</div>
                    </div>
                  })
                  :''
                }


              </div>


            }



          </div>
        </div>
        <div className="shadow" id="shadow"></div>
      </div>
    )
  }

}
