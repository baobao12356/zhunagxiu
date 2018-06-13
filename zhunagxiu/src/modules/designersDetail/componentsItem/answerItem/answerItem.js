import React ,{Component} from 'react';
import './style.scss'
import HybridBridge from 'rs-hybrid-bridge';
import {formatTimes} from '../../../../lib/scripts/dateFormat'
import Host from '../../../../lib/scripts/config_host'
import BigData from '../../../../lib/scripts/bigData';
import Env from 'rs-browser';

export default class AnswerItem extends Component{
  constructor(props){
    super(props)
    const that = this;
    this.point = new BigData()
    this.toVideoDetail = this.toVideoDetail.bind(this)
    that.hybridBridge = new HybridBridge(window);
  }

  toVideoDetail(){
    const {id,desName,cover,title,shortVideo,shortVideoSize} = this.props
    //视频F埋点
    this.point.f('110.300.49.58.68.78.96', 'deco', 'page.designer.detail',desName, 'p_designer_detail_video',id);
    if(Env.rsApp){
      const params =
      {
        tag : 66,
        "title": "",
        "text": "",
        "image": "",
        "link": `${Host.path}/mainapp/videoDetail.html?detailId=${id}`,
        // "link": `http://192.168.221.163:9000/videoDetail.html?detailId=${id}`,
        "videoID":id, //视频详情页id
        "videoUrl":"",//视频播放地址
        "videoSize":"",
        "callType":1//tag调用场景 0跳通用界面 1跳视频详情页 2传参调用
      }
      this.hybridBridge.hybrid('call_native', params)
    }else{
      window.location = `${Host.path}/mainapp/videoDetail.html?detailId=${id}`
    }
  }

  toAnswerList(aid){
    console.log(aid)
  }
  render(){

    const {cover,title,label,playCount,likeCount} = this.props
    return (
          <div className="videoItem">
            <div className="videoCover" onClick = {this.toVideoDetail} style={{background:`url(${cover}.750x420.png!) no-repeat`}}>
              {label && <div className="videoLabel">{label}</div>}
              <div className="videoBtn"></div>
            </div>
            <div className="videoTitle">{title}</div>
            <div className="videoCount">
              <div>{playCount || 0}</div>
              <div>{likeCount || 0}</div>
            </div>
          </div>
    )
  }

}
