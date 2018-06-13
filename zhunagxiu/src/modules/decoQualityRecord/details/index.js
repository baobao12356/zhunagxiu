import React from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import onfire from 'onfire.js';
import BigData from '../../../lib/scripts/bigData';
import queryString from 'query-string';
import decoQualityRecordModel from '../../../models/decoQualityRecordModel';
import './style.scss';
import Host from '../../../lib/scripts/config_host';
import WXshare from'../../../lib/scripts/WXshare';
import Nav from '../../../lib/components/nav';
import HybridBridge from 'rs-hybrid-bridge';

export default class Details extends React.Component {
  constructor(props){
    super(props);
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.photos = [];
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
    this.handleDiaryDetails(this.detailId);
  }

  dateTrans(longTypeDate){
    let date = new Date(longTypeDate);
    Date.prototype.format = function(f){
      var o ={
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
      };
      if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(var k in o)
        if(new RegExp("("+ k +")").test(f))f = f.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));return f
    };
    return date.format('yyyy.MM.dd');
  }

  handleDiaryDetails(detailId){
    let _this = this;
    decoQualityRecordModel.ReceiveQualityRecord(detailId).then((data)=>{
      console.log(data)

      this.setState({
        detailInfo: data,
      });

    })
  }

  gotoNativeImgGroup(index,photos){
    let photoGroup = [];
    photos && photos.map((val,idx)=>{
      photoGroup[idx] = {
        "des": " ",
        "url": val,
        "title": " "
      }
    });
    const dataNative = {
      tag: '25',
      data: {
        "ID": this.detailId,
        "objectType": 'decoQualityRecord',
        "currentIndex": index,
        "share": {
          "link":`${Host.path}/mainapp/decoDiaryDetails.html?detailId=${this.detailId}`,
          "title": "业主日记",
          "text": "快看看这个业主日记中的图片，我觉得非常好。",
          "image": 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!'
        },
        "photos": photoGroup
      }
    };
    console.log(dataNative);
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  render(){
    let contents = this.state.detailInfo.dataMap && this.state.detailInfo.dataMap.map((item,idx)=>{
      this.photos = item.images;
      let contentImageList = item.images[0] && item.images.map((img,idx)=>{
        return(
          <div key={idx} className="contentImage" onClick={this.gotoNativeImgGroup.bind(this,idx,this.photos)} style={{backgroundImage:"url("+img +')'}}></div>
        )
      });
      return(
        <div className="content img-center" key={idx}>
          <div className="detailTitle">{item.oneNodeName}</div>
          <div className="detailList" key={idx}>
            <div className="contentInfo">
              {
                item.supervisorAvatar ?  <div className="contentIcon" style={{backgroundImage:"url("+item.supervisorAvatar +')'}}></div> : <div className="contentIcon"></div>
              }
              <div className="contentName">{item.supervisorName}</div>
              <div className="contentDate"></div>
            </div>
            <div className="contentWords">{item.content}</div>
            <div className="contentImageList" key={idx}>
              {contentImageList}
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className={cs({"pageWapper":true,'app-wrap':Env.rsApp,'ios-nav': Env.rsApp && Env.ios,'webPadding':this.state.webPadding})}>
        <Nav title='质检记录' share={false} shareIcon={false} initShareData="false"  showTip={true} hideNav={true} onlyH5={true}/>
        <div className="details">
          {contents}
        </div>
      </div>
    )
  }
}
