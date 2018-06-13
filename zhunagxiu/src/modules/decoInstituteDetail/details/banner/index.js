/**
 * Created by feifei on 2017/10/23.
 */
import React from 'react';
import './style.scss';
import cs from 'classnames';
import Env from 'rs-browser';
import LoopBanner from './loop';
import LoadingImage from '../../img/loading.gif';
import BigData from '../../../../lib/scripts/bigData';


export default class Banner extends React.Component{
  constructor(props){
    super(props);
    this.state={
      bannerImgs:[],
      videoImg:false,
      detailInfo:{},
      videoShow:false,
      playing:false
    };
    this.videoHide = this.videoHide.bind(this);
    this.doPlay = this.doPlay.bind(this);
    this.point = new BigData();
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      bannerImgs:nextProps.activityBanners,
      videoImg:nextProps.videoImg,
      detailInfo:nextProps.detailInfo
    });
  }

  componentDidMount(){
    let _this = this;
    try{
      setTimeout(function(){
        let $defaultImgContent = document.getElementsByClassName('com-default-img-content')[0];
        let videoBannerButton = !!$defaultImgContent && !!$defaultImgContent.getElementsByTagName('div')[0] ? $defaultImgContent.getElementsByTagName('div')[0] : '';
        if(!!videoBannerButton){
          videoBannerButton.addEventListener('click', function(){
            _this.setState({
              videoShow:true
            })
          }, false);
        }
      },1500)
    }catch(e){
    }
  }

  videoHide(){
    this.setState({
      videoShow:false
    })
  }

  doPlay(){
    this.point.f('110.300.49.58.68.78.334', 'deco', 'p_designCompanyInfo','p_designCompanyInfo');
    try{
      let playState = this.state.playing;
      let player = document.getElementById("player");
      let playerContainer = document.getElementById("playerContainer");
      if (playState) {
        player.pause();
      } else {
        player.play();
      }
      this.setState({
        playing: !playState
      });
    }catch (e){}


  }

  render(){
    let bimgs = this.state.bannerImgs;
    let bimgsArray = [];
    !!bimgs && !!bimgs.length ? bimgs.map((item, index) => {
      !!item ? bimgsArray.push(item) : '';
    }) : '';
    const config = {
      imgA: bimgsArray,
      dots: true,
      noMark: true
    };
    let nowVideoShow = this.state.videoShow;
    return  (
      <div>
        {
          nowVideoShow&&this.state.detailInfo.videoImage?<div id="videoBlock" className="instituteBlock videoBlock">
              <aside>
                <div onClick={this.videoHide.bind(this,nowVideoShow)}></div>
                <video style={{backgroundImage:"url("+LoadingImage+")"}} onClick={this.doPlay.bind(this,this.state.playing)}
                       playsInline="true"
                       id="player"
                       className="video-js"
                       autoPlay
                       preload="auto"
                       data-setup='{}'>
                  <source src={this.state.detailInfo.videoUrl} type="video/mp4"></source>
                  <source src={this.state.detailInfo.videoUrl} type="video/webm"></source>
                  <source src={this.state.detailInfo.videoUrl} type="video/ogg"></source>
                </video>
                <div onClick={this.videoHide.bind(this,nowVideoShow)}></div>
              </aside>
            </div>:''
          }
        <div className="banner">
          {
            /*轮播图*/
            !!config.imgA && config.imgA.length ? (
              <LoopBanner {...config} initialHeight="190" videoImg = {this.state.videoImg}></LoopBanner>
            ) : ''
          }
        </div>
      </div>

    )
  }

}
