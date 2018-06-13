import React, {Component} from 'react';
import Env from 'rs-browser';
import Os from 'rs-os';
import HybridBridge from 'rs-hybrid-bridge';
import './style.scss';

/* 展示富文本内容
 * props: description
 * description - string, 富文本内容
 * */
export default class VideoContent extends Component {

  constructor(props) {
    super(props);

    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
  }

  handlePlay(e) {
    const target = e.target;
    const parameter = {
      videourl: this.props.videoSrc,
      tag: '28',
    };
    if(Env.rsApp && Env.android){
      let hybridBridge = new HybridBridge(window);
      hybridBridge.hybrid('call_native', parameter).then((result)=> {
        // ...
      }).catch((error)=> {
        // ...
      });
    }
    else{
      target.style.display = 'none';
      target.parentNode.querySelector('video').play();
    }

  }

  handlePause(e) {
    const target = e.target;
    const parameter = {
      tag: '28',
      videourl: this.props.videoSrc
    };
    if (target.paused) {
      if(Env.rsApp && Env.android){
        let hybridBridge = new HybridBridge(window);
        hybridBridge.hybrid('call_native', parameter).then((result)=> {
          // ...
        }).catch((error)=> {
          // ...
        });
      }
      else{
        target.play();
      }
    }
    else {
      target.pause();
      // target.parentNode.querySelector('.play-btn').style.display = 'flex';
    }
  }

  render() {
    const {poster, videoSrc, myId} = this.props;
    return (
        <div className="com-video-getContent">
          <div className="play-btn" style={{backgroundImage: `url(${poster})`}} onClick={this.handlePlay} />
          {Env.ios && parseInt(Os.version) >=11 && <video src={videoSrc} onClick={this.handlePause} controls/>}
          {(!Env.ios || (Env.ios && parseInt(Os.version) <11)) && <video src={videoSrc} onClick={this.handlePause}/>}
        </div>
    );
  }
}
