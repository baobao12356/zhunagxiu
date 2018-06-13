import React from 'react';
import Host from '../../lib/scripts/config_host';
import Env from 'rs-browser';
import ImageView  from '../../lib/library/imgGallery';
import Nav from '../../lib/components/nav';
import Footer from '../../lib/components/footer';
import Img from '../../lib/components/defaultImg';
import QueryString from 'query-string';
import BigData from '../../lib/scripts/bigData';
import HybridBridge from 'rs-hybrid-bridge';
import {Toast} from 'antd-mobile';
import back from '../../lib/scripts/back';
import cs from 'classnames';
import {AtlasDetails} from '../../models/AtlasDetailsModel';
import './style.scss';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    const qs = location.href.split('?')[1];
    this.urlParam = QueryString.parse(qs);
    this.articleId = this.urlParam.detailId;
    this.state = {
      dataMap: null,
      imagelist: null,
      picIdx: '',
      showInfo: false,
      recommendImg: null,
      openid: '',
      haveRecommend: false,
      isApp: Env.rsApp,
      lastPage: false,
      collect: null,
      initCollectData: false,
      share: null,
      initShareData: false,
      isOnline:true,
    };
    this.hasMounted = true;
    this.point = new BigData();
  }
  componentWillUnmount(){
    this.hasMounted = false;
  }
  componentDidMount() {
    let _this = this;
    console.log(this.articleId);
    AtlasDetails(this.articleId).then((res)=>{
      console.log(res);
      if (res.code == 200 && res.dataMap) {
        let dataMap = res.dataMap;
        //分享
        let share = {
          record: 'true',
          objectId: this.articleId,
          objectType: 'jz_atlas',
          title: dataMap.title || '',
          img: dataMap.cover || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          text: dataMap.description || '',
          link: `${Host.path}/mainapp/atlasDetails?detailId=${this.articleId}`
        };
        console.log('share', share);
        //收藏
        let collect = {
          sourceType: '6',
          channel: 'deco',
          picture: dataMap.cover || 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
          title: dataMap.title || ''
        };
        this.hasMounted  && this.setState({
          dataMap,
          imagelist: dataMap.imageVos.map((item)=> {
            return item.imageUrl
          }),
          picIdx: 1,
          showInfo: true,
          share,
          initShareData: true,
          collect,
          initCollectData: true,
          recommendImg: dataMap.recommends,
          haveRecommend: (dataMap.recommends && dataMap.recommends[0]) ? true : false
        });
        _this.point.pz('110.300.20.00.00.000.14', 'deco', 'page.photo.detail', dataMap.title);
      }else{
        this.setState({
          isOnline:false,
        })
        Toast.info('此图集已下线', 1,()=>{back()});
      }
    });
  }

  //关闭图片浏览器
  close() {
    //不要删!!!
  }

  //滑动结束后的回调
  togglePic(idx) {

    this.hasMounted  && this.setState({
      picIdx: ++idx
    });

    if (this.state.picIdx > this.state.imagelist.length) {
      this.hasMounted  && this.setState({
        lastPage: true
      });
    } else {
      this.hasMounted  && this.setState({
        lastPage: false
      });
    }
  }

  //点击切换底部工具栏
  hadleImageViewClick() {
    this.hasMounted  && this.setState({
      showInfo: !this.state.showInfo
    });
  }

  //
  handleDownload(url) {
    console.log('下载');
    if (this.state.picIdx <= this.state.imagelist.length) {
      new HybridBridge(window).hybrid('call_native', {
        tag: '29',
        url: this.state.imagelist[this.state.picIdx - 1]
      });
    }
  }

  //跳转
  jumpTo(target, idx ,arr) {
    const {title} = this.state.dataMap;
    this.point.f('110.300.49.58.68.79.35', 'deco' ,'page.photo.detail', title,'part.photo.picture', target, arr[idx].title, idx, arr.length);
    location.search = '?detailId=' + target;
  }

  render() {
    let {lastPage,share,initShareData,showInfo,haveRecommend,imagelist,recommendImg,isApp,picIdx,dataMap,collect,initCollectData} = this.state;

    return (
      <div className="containY picInfo img-center">
        { lastPage ? <Nav scroll={true} share={share} shareIcon={this.state.isOnline} initShareData={initShareData} hideNav="true" showTip="true"></Nav> : (showInfo &&
        <Nav scroll={true} share={share} initShareData={initShareData} hideNav="true" showTip="true"></Nav>)}
        {
          /*图片浏览器*/
          this.state.imagelist && (
            <ImageView
              disablePageNum={true}
              addPage={haveRecommend ? 1 : ''}
              imagelist={imagelist}
              close={this.close.bind(this)}
              movedCurrent={this.togglePic.bind(this)}
              onSingleTap={this.hadleImageViewClick.bind(this)}
              noMark={true}
            >
              {
                /*推荐图集*/
                haveRecommend && (
                  <div className="imgs_container">
                    <h1>推荐图集</h1>
                    <div className="imgs_content">
                      {
                        recommendImg.map((item, idx, arr)=> {
                          return <div className="img_item" key={item.id} onClick={this.jumpTo.bind(this, item.id, idx, arr)}>
                            <Img cusClass="inner_image" src={item.atlasUrl}/>
                            <span className="img_title">{item.atlasTitle}</span>
                          </div>
                        })
                      }
                    </div>
                  </div>
                )
              }
            </ImageView>)
        }
        {
          /*app内下载图片工具栏*/
          (isApp && !lastPage) && (
            <div className="foot_download">
              <p className="info_i">
                <span
                  className="indexnum">{imagelist ? (picIdx > imagelist.length ? imagelist.length : picIdx) : ''}</span><span
                className="allnum">/{imagelist ? imagelist.length : ''}</span>
              </p>
              <span className="btn_download" onClick={this.handleDownload.bind(this)}></span>
            </div>
          )
        }
        {
          /*图片文案及底部工具栏*/
          (showInfo && !lastPage ) && (
            <div>
              <div className={cs({"info wap-limit-width":true,'no-app':!Env.rsApp })}>
                <div className="infos">
                  <div className="info_title">
                    <p className="info_t">{dataMap ? dataMap.title : ''}</p>
                    <p className="info_i">
                      <span
                        className="indexnum">{imagelist ? (picIdx > imagelist.length ? imagelist.length : picIdx) : ''}</span><span
                      className="allnum">/{imagelist ? imagelist.length : ''}</span>
                    </p>
                  </div>
                  <p className="info_content">
                    {
                      dataMap &&  dataMap.imageVos && dataMap.imageVos[picIdx-1] ? dataMap.imageVos[picIdx-1].description : ''
                    }
                  </p>
                </div>
              </div>
              {
                Env.rsApp &&
                this.state.isOnline ?
                <Footer type="jz_atlas" id={this.articleId} collect={collect} initCollectData={initCollectData}
                                     likeType="jz_atlas"/>
                  :""
              }
            </div>
          )
        }
      </div>
    );
  }
}

