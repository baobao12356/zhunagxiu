/**
 * Created by feifei on 2017/10/24.
 */
import React from 'react';
import cs from 'classnames';
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../../../lib/scripts/bigData';
import './style.scss';


export default class BottomInfo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      detailInfo:{},
      showBottomInfo:false,
      bottomInfoType:''
    };
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
    //this.point.f('110.300.55.59.68.78.72', 'deco', 'page.detail.company','page_companydetailaddressmoremap', 'page_companydetailaddressmoremap','p_action_id');
    this.props.f({
      id: '1773',
    });
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
          <div className="dialogName"><span>{this.state.bottomInfoType && this.state.bottomInfoType == "sale" ? "促销" : "全部地址"}</span><span id="closeSub"></span></div>
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
       <div className="shadow" id="shadow" onClick={this.props.hideBottomInfo}></div>
      </div>
    )
  }

}
