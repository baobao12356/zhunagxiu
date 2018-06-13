/**
 * Created by feifei on 2017/10/23.
 */
import React from 'react';
import './style.scss';
import cs from 'classnames';
import Env, { compareAppVersion } from 'rs-browser';
import Swiper from 'swiper';
import LoadingImage from '../../img/loading.gif';
import LoopBanner from '../../../../lib/components/loopBanner';


export default class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerImgs: [],
      playing: false
    }
    this.swiperImgs = null
    this.doPlay = this.doPlay.bind(this);
  }

  componentDidUpdate() {
    this.swiperImgs && this.swiperImgs.destroy();
    this.swiperImgs = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
      on: {
        slideChange: function () {
          if (this.activeIndex > 0 && compareAppVersion('2.1.0', Env.appVersion) < 0) {
            let player = document.getElementById("player");
            player.pause();
          }
        }
      }
    });
  }


  doPlay(url) {
    //this.point.f('110.300.55.64.68.79.20', 'deco', 'page.decocompany.detail', 'p_decocompany_detail', 'button.video', 'p_action_id');
    // this.props.f({
    //   id: '1458',
    // p_action_id: `tag=视频&contentid=${url||''}`,
    // });
    try {
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
    } catch (e) { }
  }

  render() {
    const { detailInfo } = this.props;
    const { activityBanners } = detailInfo;
    const bannerComp =
      activityBanners ? activityBanners.map((img, index) => (
        <div className="swiper-slide img" key={index}>
          <img src={img} />
        </div>
      )) : null;
    const video =
      detailInfo.videoUrl && <div className="swiper-slide img"> <div className="corpBlock" onClick={() => this.doPlay(detailInfo.videoUrl)} >
        <i className={cs({ "showHide": this.state.playing, "videoImg": true })} style={{ backgroundImage: "url(" + detailInfo.videoImage + ".375x210.png!)" }}><span className="videoPlay"></span></i>
        <video style={{ backgroundImage: "url(" + LoadingImage + ")" }}
          playsInline="true"
          id="player"
          className="video-js"
          preload="auto"
          data-setup='{}'>
          <source src={detailInfo.videoUrl} type="video/mp4"></source>
          <source src={detailInfo.videoUrl} type="video/webm"></source>
          <source src={detailInfo.videoUrl} type="video/ogg"></source>
        </video>
      </div></div>
    //alert(Env.appVersion)
    const videoComp = compareAppVersion('2.1.0', Env.appVersion) > 0 ? null : video;

    const swiperComp = (<div className="banner-all swiper-wrapper">
      {videoComp}
      {bannerComp}
    </div>);
    return (
      <div className="swiper-container">
        {swiperComp}
        <div className="swiper-pagination"></div>
      </div>
    )
  }

}
