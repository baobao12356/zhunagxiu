import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import queryString from 'query-string';
import cs from 'classnames';
import Env from 'rs-browser';
import GetUserInfo from '../../lib/scripts/getUserInfo';
import { getDesignerInfo } from '../../models/DesignerModel';
import Nav from './componentsItem/nav';
import * as Config from './componentsItem/config';
import Appoint from './componentsItem/appointment/appointment';
import BigData from '../../lib/scripts/bigData';
import HybridBridge from 'rs-hybrid-bridge';
import Host from '../../lib/scripts/config_host';
import Concern from './componentsItem/concern';
import EvaluateStars from '../../lib/components/evaluateStars';
import U3D from './img/3d.png';
import NOU3D from './img/no3d.png';
import './style.scss';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.point = new BigData();
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.serviceShowFlag = params.serviceShowFlag || 0;
    this.closeDialog = this.closeDialog.bind(this);
    this.handleCasesList = this.handleCasesList.bind(this);
    this.showServe = this.showServe.bind(this);
    this.state = {
      res: '',
      dialogInfos: '',
      dialogTitle: '',
      dialogIsShow: false,
      share: '',
      bottomBtnShow: false,
      initShareData: false,
    };
  }

  toCompany(cid, companyType) {
    this.props.f({
      id: '3622',
      p_action_id: `tag=公司&contentid=${cid}`
    });
    if (companyType === 0) {
      //装修公司详情
      window.location = `/mainapp/decoCorpDetail.html?detailId=${cid}&back=h5`;
    } else if (companyType === 2) {
      //设计机构
      window.location = `/mainapp/decoInstituteDetail.html?detailId=${cid}&back=h5`;
    }
  }
  isShowBottomBtn() {
    const scroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (scroll > 210) {
      this.setState({
        bottomBtnShow: true
      });
    } else {
      this.setState({
        bottomBtnShow: false
      });
    }
  }

  componentWillMount() {
    window.addEventListener('scroll', this.isShowBottomBtn.bind(this));
    getDesignerInfo(this.detailId, this.serviceShowFlag).then((res) => {
      if (res.code == 200) {
        console.log(res);
        this.setState({
          res: res.dataMap,
          share: false,
          initShareData: true,
        });
        const items = [];
        res.dataMap.honorVos && res.dataMap.honorVos[0] && [...res.dataMap.honorVos].map((val, idx) => {
          return items.push(Object.assign({}, { title: val.awardName }, { contents: val.awardDescription }))
        });
        this.honorList = {
          dialogInfos: items,
          dialogIsShow: !this.state.dialogIsShow,
          dialogTitle: '荣誉奖项'
        };

        const _items = [];
        res.dataMap.designServices && res.dataMap.designServices[0] && [...res.dataMap.designServices].map((val, idx) => {
          return _items.push(Object.assign({}, { title: val.serviceName }, { contents: val.serviceIntroduction }))
        });
        res.dataMap.constructServices && res.dataMap.constructServices[0] && [...res.dataMap.constructServices].map((val, idx) => {
          return _items.push(Object.assign({}, { title: val.serviceName }, { contents: val.serviceIntroduction }))
        });
        this.servicesList = {
          dialogInfos: _items,
          dialogIsShow: !this.state.dialogIsShow,
          dialogTitle: '设计服务'
        };
      }
    });
  }

  componentDidMount() {
    window.didAppear = () => {
      if (Env.rsApp) {
        GetUserInfo().then((data) => {
          Cookies.set('SESSION.user', data.sessionid);
          Cookies.set('sessionid', data.sessionid);
          Cookies.set('openid', data.openid);
          Cookies.set('is_login', 1);
        });
      }
    };
  }
  handleCasesList() {
    const dataNative = {
      tag: '73',
      designId: this.detailId
    };
    this.props.f({
      id: '3013',
    });
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  honorMore() {
    this.props.f({
      id: '3621'
    });
    if (!this.state.bottomBtnShow) {
      document.querySelectorAll('html')[0].style.overflow = 'hidden';
      document.querySelectorAll('html')[0].style.height = '100%';
      document.querySelectorAll('body')[0].style.overflow = 'hidden';
      document.querySelectorAll('body')[0].style.height = '100%';
    }
    setTimeout(() => {
      this.setState(this.honorList);
    }, 200);
  }

  servicesMore() {
    if (!this.state.bottomBtnShow) {
      document.querySelectorAll('html')[0].style.overflow = 'hidden';
      document.querySelectorAll('html')[0].style.height = '100%';
      document.querySelectorAll('body')[0].style.overflow = 'hidden';
      document.querySelectorAll('body')[0].style.height = '100%';
    }
    this.props.f({
      id: '2797',
    });
    setTimeout(() => {
      this.setState(this.servicesList);
    }, 200);
  }

  showServe() {
    if (!this.state.bottomBtnShow) {
      document.querySelectorAll('html')[0].style.overflow = 'hidden';
      document.querySelectorAll('html')[0].style.height = '100%';
      document.querySelectorAll('body')[0].style.overflow = 'hidden';
      document.querySelectorAll('body')[0].style.height = '100%';
    }
    this.setState({
      ...this.servicesList,
      dialogIsShow: !this.state.dialogIsShow,
    });
    this.props.f({
      id: '2797',
    });
  }

  closeDialog(e) {
    document.querySelectorAll('html')[0].style.overflow = 'auto';
    document.querySelectorAll('html')[0].style.height = 'auto';
    document.querySelectorAll('body')[0].style.overflow = 'auto';
    document.querySelectorAll('body')[0].style.height = 'auto';
    this.setState({
      dialogIsShow: !this.state.dialogIsShow
    });
  }

  toCasesDetail(id) {
    this.props.f({
      id: '2799',
    });
    if (!!id && id !== 'undefined') {
      if (window.location.protocol !== 'file:') {
        window.location = `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${id}&back=h5`;
      } else {
        window.location = `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${id}&back=file`;
      }
    }
  }

  render() {
    const {
      designerName,
      workingHours,
      school,
      designerBudget,
      designerImage,
      styleList,
      designServices,
      honorVos,
      caseList,
      companyService,
      companyName,
      briefIntroduction,
      brightSpot,
      constructServices,
      openId,
      concept,
      activityBudget,
      caseCounts,
      designerService,
      companyId,
      companyType,
      serviceType,
      privateCount,
      volume,
      overall,
      designLevel,
      serviceQuality
    } = this.state.res;
    const designerPicStyle = designerImage && { background: `url(${designerImage}) center center no-repeat` };
    let isShowCase = false;
    if (this.serviceShowFlag == 1) {
      isShowCase = serviceType == 2 || serviceType == 3;
    }
    console.log(!caseList);
    const pointAttention = {
      id: '2800',
    };

    let iosContentTop = '';
    let iPhoneXContentTop = '';
    if (Env.rsApp && Env.ios) {
      iosContentTop = 'isIos';
    }
    if (Env.rsApp && Env.iPhoneX) {
      iPhoneXContentTop = 'iPhoneXTop';
    }
    return (
      <div className="wrapper img-center">
        <Nav title='' initShareData={this.state.initShareData} designerId={this.detailId} showTip={true} hideNav={true} scroll={true} />
        <div className={cs({ "contentBox": true })}>
          <div className={`designerInfos ${iosContentTop} ${iPhoneXContentTop}`}>
            <div className="desTop">
              <div className="desLeft">
                <div className="desName">{designerName}</div>
                <div className="desWorkTime">从业{workingHours}</div>
                <div className="desSchool">{concept}</div>
                <div className="tags">
                  {
                    styleList && styleList.map((val, idx) => {
                      const key = idx;
                      return (<div key={key}>{val}</div>);
                    })
                  }
                </div>
              </div>
              <div className="desRight">
                <div className="pic" style={designerPicStyle}></div>
              </div>
            </div>
            <div className={cs({ "desBottom": true, "activityFont": activityBudget })}>
              <div className="collectNumber"><p>{privateCount}</p><p>收藏数</p></div>
              <div className="dealNumber"><p>{volume}</p><p>成交量</p></div>
              <div className="price">
                <p className="prices">
                  <span><i className="priceNum">{activityBudget ? activityBudget : designerBudget}</i>/m²</span>
                  {
                    activityBudget &&
                    <span className="designerBudget">{designerBudget}/m²</span>
                  }
                </p>
                <p className="priceInfo">设计费</p>
              </div>
              <div>
                <Concern
                  id={this.detailId}
                  openid={openId}
                  initConcernData={true}
                  pointAttention={pointAttention}
                  f={this.props.f}
                />
              </div>
            </div>
          </div>
          <div className="scoreWrap">
            <div className="scoreInfo">
              <div className="scoreLeft">
                <div className="satisfyScore">{overall}<span>分</span></div>
                <p>满意度</p>
              </div>
              <div className="scoreRight">
                <div className="designScore">
                  <div>设计水平</div>
                  <div><EvaluateStars totalScore={designLevel} score={Number(designLevel).toFixed(1)} /></div>
                </div>
                <div className="serviceScore">
                  <div>服务质量</div>
                  <div><EvaluateStars totalScore={serviceQuality} score={Number(serviceQuality).toFixed(1)} /></div>
                </div>
              </div>
            </div>
          </div>
          {
            designServices &&
            <div className="serviceBox">
              <div className="serTitle">
                <div className="boxName">设计服务</div>
                <div className="more" onClick={this.servicesMore.bind(this, designServices, constructServices)}>查看详情</div>
              </div>
              <div className="serBox">

                {
                  designServices && designServices[0] && [...designServices].map((val, idx) => {
                    return (
                      <div className="serItems" onClick={this.showServe} key={idx}>
                        <div className="serIcon" style={{ background: `url(${Config.SERVICEICON[val.id]})` }}></div>
                        <div className="serName">{val.serviceName}</div>
                        <div className="serDesc"></div>
                      </div>
                    )
                  })
                }

                {
                  constructServices && constructServices[0] && [...constructServices].map((val, idx) => {
                    return (
                      <div className="serItems" onClick={this.showServe} key={idx}>
                        <div className="serIcon" style={{ background: `url(${Config.SERVICEICON[val.id]})` }}></div>
                        <div className="serName">{val.serviceName}</div>
                        <div className="serDesc"></div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          }

          {
            honorVos &&
            [...honorVos].length > 0 &&
            <div className="honorBox">
              <div className="honorTop">
                <div className="honorName">所获奖项</div>
                {
                  honorVos &&
                  [...honorVos].length > 1 &&
                  <div className="more" onClick={this.honorMore.bind(this, honorVos)}>查看详情</div>
                }
              </div>
              <div className="honorBoxContent">
                <div className="honorTitle">{honorVos[0].awardName}</div>
                <div className="honorContent">{honorVos[0].awardDescription}</div>
              </div>
            </div>
          }

          <div className={cs({ "caseBox": true, "dis": !caseList || isShowCase })}>
            <div className="caseTop">
              <div className="caseName">案例作品</div>
              <div className="more" onClick={this.handleCasesList}>查看全部<i>{caseCounts && caseCounts}</i>套作品</div>
            </div>
            <div className="caseItemBox">
              {
                caseList &&
                [...caseList].map((val, idx) => {
                  return (
                    <div className="caseItem" onClick={this.toCasesDetail.bind(this, val.caseId)} key={idx}>
                      <div className="casePic" style={{ background: `url(${val.imgUrl}.670x376.png!) 50% 50% no-repeat` }}></div>
                      <div className="caseTitle">{val.title}</div>
                      <div className="tags tagsCase">
                        <div>{val.designStyleStr}</div>
                        <div>{val.houseTypeStr}</div>
                        <div>{val.area}</div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>

          <div className="desCityCompany">
            {
              companyService &&
              <div>
                <div className="cityTop">服务城市</div>
                <div className="cityName">{designerService}</div>
              </div>
            }

            {
              companyName &&
              <div>
                <div className="companyTop">所属公司</div>
                <div className="companyName" onClick={this.toCompany.bind(this, companyId, companyType)}>{companyName}</div>
              </div>
            }

          </div>

          <div className="personalInfo">
            {
              briefIntroduction &&
              <div className="personalBox">
                <div className="personalTop">个人简介</div>
                <div className="personalContent">{briefIntroduction}</div>
              </div>
            }
            {
              brightSpot &&
              <div className="designIdea">
                <div className="ideaTop">设计理念</div>
                <div className="ideaContent">{brightSpot}</div>
              </div>
            }
          </div>
        </div>

        <div className={cs({ "dialogInfo": true, "dis": !this.state.dialogIsShow })}>
          <div className="shadow"></div>
          <div className="dialogBox">
            <div className="dTitle">{this.state.dialogTitle}</div>
            <div className="dItem">
              {
                this.state.dialogInfos &&
                this.state.dialogInfos.map((val, idx) => {
                  return (
                    <div className="dList" key={idx}>
                      <div className="dListTitle">{val.title}</div>
                      <div className="dListContent">{val.contents}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        {
          !!this.state.dialogIsShow ?
            <div className="closeBtn" onClick={this.closeDialog}>完成</div> :
            (<Appoint bottom={true}
              designerImage={designerImage}
              designerName={designerName}
              companyName={companyName}
              cls={cs({ "appointBtn": true })}
              id={this.detailId}
              openId={openId}
              f={this.props.f}
            />)
        }
      </div>
    )
  }

}
