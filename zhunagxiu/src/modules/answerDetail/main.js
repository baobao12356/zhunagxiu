import React from 'react';
import cs from 'classnames';
import './style.scss';
import QueryString from 'query-string';
import Nav from '../../lib/components/nav';
import Img from '../../lib/components/defaultImg';
import LoopBanner from '../../lib/components/loopBanner';
import { Toast } from 'antd-mobile';
import { AskingDetail, AnswerList, DesignerAnswerList } from '../../models/PlanAskModel';
import { dateFormat, formatTimes } from '../../lib/scripts/dateFormat';
import { getScrollTop, getWindowHeight, getScrollHeight } from '../../lib/scripts/getHeight';
import Like from '../../lib/components/like';
import Comment from '../../lib/components/comment';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import Host from '../../lib/scripts/config_host';
import Env from 'rs-browser';
import BigData from '../../lib/scripts/bigData';
import onfire from 'onfire.js';
import DefaultUser from '../../lib/components/defaultUser';
import Concern from '../../lib/components/concern'

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    dateFormat();
    this.askId = QueryString.parse(location.href.split('?')[1]).detailId;
    this.designerId = QueryString.parse(location.href.split('?')[1]).designerId;
    this.askingType = QueryString.parse(location.href.split('?')[1]).askingType;
    this.state = {
      showAskcontent: false,
      switchAskcontent: false,
      toggleAskCss: false,
      bannerImg: null,
      records: [],
      hideAnswerArr: null,
      toggleAnswerArr: null,
      pageNo: 1,
      hasNextPage: true,
      loading: false,
      imgViewArr: [],
      tags: [],
      Askcontent: '',
      webPadding: false,
      budget: ''
    };
    //分享
    this.share = {
      record: 'true',
      objectId: this.askId,
      objectType: 'jz_answer',
      title: '问答',
      img: 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
      link: `${Host.path}/mainapp/answerDetail.html?detailId=${this.askId}&designerId=${this.designerId}`
    };
    this.fetchMoreAnswer = this.fetchMoreAnswer.bind(this);
    this.showhideClick = this.showhideClick.bind(this);
    this.toggleAnswer = this.toggleAnswer.bind(this);
    this.judgeBottom = this.judgeBottom.bind(this);
    this.openBannerImgView = this.openBannerImgView.bind(this);
    this.openRichImgView = this.openRichImgView.bind(this);
    this.point = new BigData();
  }


  componentDidMount() {
    if (!Env.rsApp) {
      this.setState({
        webPadding: true
      })
    }

    onfire.on('closeTip', () => {
      this.setState({
        webPadding: false
      })
    });
    AskingDetail(this.askId, this.askingType).then((res) => {

      if (res.code == 200 && res.dataMap) {
        let imgViewArr = null;
        if (res.dataMap.askImageUrls) {
          imgViewArr = res.dataMap.askImageUrls.map((item) => {
            return {
              des: '',
              title: '',
              url: item
            }
          });
        }
        this.setState({
          bannerImg: res.dataMap.askImageUrls || null,
          imgViewArr,
          Askcontent: res.dataMap.content || '',
          tags: res.dataMap.tags || []
        });
        this.loadImg();
      }
    });
    this.fetchMoreAnswer();
    window.addEventListener('scroll', this.judgeBottom);
    //    this.point.p('110.300.49.58.68.78.45','deco','page.designer.answerdetail','p_answerdetail');
  }

  loadImg() {
    let AskcontentDom = Array.from(document.querySelectorAll('.ask_content'))[0];
    let imgs = Array.from(AskcontentDom.querySelectorAll('img'));
    if (imgs.length > 0) {
      for (let item of imgs) {
        return item.onload = () => {
          let judgeOverFlow = AskcontentDom.scrollHeight - AskcontentDom.offsetHeight > 5 ? true : false;
          return this.setState({
            showAskcontent: judgeOverFlow,
            switchAskcontent: judgeOverFlow
          });
        }
      };
    } else {
      let judgeOverFlow = AskcontentDom.scrollHeight - AskcontentDom.offsetHeight > 5 ? true : false;
      return this.setState({
        showAskcontent: judgeOverFlow,
        switchAskcontent: judgeOverFlow
      });
    }
  }

  fetchMoreAnswer() {
    this.setState({
      loading: true
    });
    this.state.pageNo != 1 && Toast.loading('Loading...', 10000);
    DesignerAnswerList(this.askId, this.designerId, this.state.pageNo, 10).then((res) => {
      this.setState({
        loading: false
      });

      if (res.code == 200) {
        this.setState({
          toggleAnswerArr: new Array(res.dataMap.count).fill(false),
          records: this.state.records.concat(res.dataMap.records),
          hasNextPage: (this.state.pageNo + 1 > res.dataMap.totalPages) ? false : true,
        });
        let designerMiddleDom = Array.from(document.querySelectorAll('.designer_middle'));
        this.mapFun(designerMiddleDom)

      }
    });
  }

  mapFun(designerMiddleDom) {
    designerMiddleDom.map((item) => {
      let imgs = Array.from(item.querySelectorAll('img'));
      if (imgs.length > 0) {
        for (let item of imgs) {
          item.onload = (item) => {
            let hideAnswerArr = designerMiddleDom.map((item) => {
              return item.scrollHeight - item.offsetHeight > 5 ? true : false;

            });
            return this.setState({
              hideAnswerArr,
            });
          };
        }
      } else {
        let hideAnswerArr = designerMiddleDom.map((item) => {
          return item.scrollHeight - item.offsetHeight > 5 ? true : false;

        });
        return this.setState({
          hideAnswerArr,
        });
      }
    });
  }
  judgeBottom() {
    if (this.state.hasNextPage && !this.state.loading) {
      if (getScrollHeight() - getScrollTop() - getWindowHeight() < 20) {
        console.log("you are in the bottom!");
        this.setState({
          pageNo: ++this.state.pageNo
          // pageNo: 1
        }, () => {
          this.fetchMoreAnswer();
        });
      }
    }
  }

  showhideClick() {
    this.setState({
      switchAskcontent: !this.state.switchAskcontent,
      toggleAskCss: !this.state.toggleAskCss,
    })
  }

  toggleAnswer(idx) {
    let toggleAnswerArr = this.state.toggleAnswerArr;
    let hideAnswerArr = this.state.hideAnswerArr;
    toggleAnswerArr[idx] = true;
    hideAnswerArr[idx] = false;
    this.setState({
      toggleAnswerArr,
      hideAnswerArr
    })
  }

  openBannerImgView(e) {
    let linkIdx = e.target.getAttribute("data-index");
    let data = {
      ID: '',
      objectType: '',
      currentIndex: linkIdx,
      photos: this.state.imgViewArr
    };
    new HybridOpenPageImagePreview().open(data).catch((e) => {
      console.log(e);
    });
  }

  openRichImgView(e, idx) {

    e.stopPropagation();
    let target = e.target;
    if (target.tagName.toLowerCase() != 'img') {
      return;
    }
    let data = {
      ID: '',
      objectType: '',
      currentIndex: '',
      photos: []
    };
    let designerMiddleDom = Array.from(document.querySelectorAll(`.designer_middle`))[idx];
    let imgs = designerMiddleDom.querySelectorAll('img');
    let i = 0;
    let len = imgs.length;
    for (; i < len; i++) {
      if (imgs[i] == target) {
        data.currentIndex = i;
      }
      data.photos.push({
        des: '',
        title: '',
        url: imgs[i].src
      });
    }
    new HybridOpenPageImagePreview().open(data).catch((e) => {
      console.log(e);
    });
  }

  jumpToPage(target) {
    location = Host.path + '/mainapp' + target;
  }

  showDetails() {
    this.point.f('110.300.49.58.68.79.29', 'deco', 'page.designer.answerdetail', 'p_answerdetail');
    let target = "";
    if (this.askingType == 1) {
      target = `/diagnoseDetail.html?detailId=${this.askId}`;
    } else if (this.askingType == 2) {
      target = `/planCommentDetail.html?detailId=${this.askId}`;
    }
    location = Host.path + '/mainapp' + target;
  }

  toLocaleTime(createDate) {
    let answerTime = new Date(createDate);
    Date.prototype.toLocaleString = function () {
      return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
    };

    return answerTime.toLocaleString();
  }

  render() {
    let { tags, showAskcontent, switchAskcontent, toggleAskCss, bannerImg, Askcontent, records, hideAnswerArr, toggleAnswerArr, hasNextPage } = this.state;
    const config = {
      imgA: bannerImg,
      dots: true,
      noMark: true
    };
    return (
      <div className={cs({ "planComment_box": true, 'app-wrap': Env.rsApp, 'ios-nav': Env.rsApp && Env.ios, 'webPadding': this.state.webPadding, 'img-center': true })}>
        {/*<Nav title='问答' initShareData="true" share={this.share} hideNav="true" showTip="true"/>*/}
        <Nav title='问答' shareIcon={false} hideNav={true} showTip={true} />
        <div className="planComment">
          <div className="banner_div">
            {
              /*轮播图*/
              config.imgA ? (
                <LoopBanner {...config} myClick={this.openBannerImgView} initialHeight="280"></LoopBanner>
              ) : <div className="com-default-img-content h280"></div>
            }
          </div>
          <div className="tags">
            {tags[0] && tags.map((item, idx) => { return <span key={idx}>{item}</span> })}
          </div>
          <div className="details_div">
            <p className={cs({ 'ask_content': true, 'toggle_content': toggleAskCss })} onClick={this.showDetails.bind(this)}>
              {Askcontent}
            </p>
            {
              showAskcontent &&
              <div className={cs({ "switch_ask_btn": true, "tohide": switchAskcontent })} onClick={this.showhideClick}>
                {switchAskcontent ? '展开' : '收起'}
              </div>
            }
          </div>
          <div className="designer_div">
            {/*<h3>设计师点评</h3>*/}
            {
              !records[0] && <div className="no_content"></div>
            }
            {
              !records[0] && <div className="no_desc">还没有点评，敬请期待吧</div>

            }
            {
              records[0] && records.map((item, idx) => {
                return (<div className="designer_item" key={idx} >
                  <div className="designer_top">
                    <div className="designer_top_left" onClick={this.jumpToPage.bind(this, `/designersDetail.html?detailId=${item.designerId}`)}><DefaultUser src={item.designerImage} /></div>
                    <div className="designer_top_center">
                      <p>{item.designerName}</p>
                      {/*item.styleList && item.styleList[0] && <p>{item.styleList.join(' / ')}</p>*/}
                      <p>
                        {/*{item.styleList && item.styleList[0] && item.styleList.map((item, idx)=> {*/}
                        {/*return <span key={idx} className="styleListItem">{item}</span>*/}
                        {/*})}*/}
                        {item.workingHours && <span key={idx} className="styleListItem">从业年限：{item.workingHours}年</span>}
                        {item.budget && <span className="styleListItem">{item.budget}<span>元/m²</span></span>}
                      </p>
                    </div>
                    {/*<div className="designer_top_right">{new Date(item.createDate).Format('yyyy-MM-dd')}</div>*/}
                    {/*<div className="designer_top_right">{formatTimes(item.createDate,1)}</div>*/}
                    <Concern id={this.askId} initConcernData={true} />
                  </div>
                  {toggleAnswerArr &&
                    <div className={cs({ "designer_middle": true, 'toggle_content': toggleAnswerArr[idx] })}
                      dangerouslySetInnerHTML={{ __html: item.answerContent }} onClick={(e) => this.openRichImgView(e, idx)}>
                    </div>}
                  {
                    hideAnswerArr && hideAnswerArr[idx] && <div className='show_answer_btn' onClick={() => {
                      this.toggleAnswer(idx)
                    }}>展开</div>
                  }
                  <div className="operation">
                    <span className="answerTime">{this.toLocaleTime(item.createDate)}</span>
                    <Comment id={item.answerId} type="jz_answer" count={item.originComment} />
                    <Like id={item.answerId} likeType='jz_answer' comLikeCount={item.originLikeCnt} isLiked={item.isLiked} />
                  </div>
                </div>)
              })
            }
          </div>
        </div>
        {(!hasNextPage && records[0]) && <div className="no-more">没有更多了</div>}
      </div>
    );
  }
}


