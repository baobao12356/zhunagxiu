/**
 * Created by feifei on 2017/12/20.
 */
import React from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';
import EvaluateStars from '../../../../lib/components/evaluateStars'

export default class InstituteBasicInfo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      detailInfo:'',
      praiseScore:0,
      companyName:''
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      detailInfo:nextProps.detailInfo,
      companyName:nextProps.detailInfo.companyAppellation
    })
  }

  render(){

    let companyName = '';
    if(!this.state.companyName||String(this.state.companyName)=='undefined'){
      companyName = '';
    }else{
      companyName = this.state.companyName;
    }

    return  (
      <div className="instituteBasicInfo">
        <div className="instituteTop">
          {this.state.detailInfo.logoUrl?<div className="instituteTopLeft" style={{'backgroundImage':'url('+this.state.detailInfo.logoUrl+'.150x150.png!)'}}>
          </div>:''}
          <div className="instituteTopRight">
            <div>
              <div className="instituteTitle">{this.state.companyName}</div>
            </div>
              {
                this.state.detailInfo.services ?
                  <div className="instituteService">服务城市：
                    {this.state.detailInfo.services.map((item, idx)=> {
                      return <span key={idx}>{item}</span>
                    })
                  }
                </div>: ''
              }
            {
              this.state.detailInfo.characteristicTab&&<div className="instituteTab">
                {
                  String(this.state.detailInfo.characteristicTab).split(",").map((item,idx)=>{
                    return <span key ={idx}>{item}</span>
                  })
                }
              </div>
            }
          </div>
        </div>
        {
          this.state.detailInfo.shopActivityTitle?
            <div className="instituteBottom">
            <div><div>惠</div></div>
            <div>{this.state.detailInfo.shopActivityTitle}</div>
            <div></div>
          </div>
            :''
        }
      </div>
    )
  }

}

