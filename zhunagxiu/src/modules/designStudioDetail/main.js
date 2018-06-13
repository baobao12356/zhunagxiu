import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getDesignStudioInfo } from '../../models/DesignStudioModel'
import Nav from './componentsItem/nav'
import './style.scss'
import queryString from 'query-string';
import * as Config from './componentsItem/config'
import cs from 'classnames'
import Appoint from './componentsItem/appointment/appointment'
import Env from 'rs-browser'
import BigData from '../../lib/scripts/bigData';
import HybridBridge from 'rs-hybrid-bridge';
import Host from '../../lib/scripts/config_host'
import Concern from './componentsItem/concern';

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.point = new BigData()
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.closeDialog = this.closeDialog.bind(this)
    this.handleCasesList = this.handleCasesList.bind(this)
    this.state = {
      res: "",
      dialogInfos: "",
      dialogTitle: "",
      dialogIsShow: false,
      share: "",
      bottomBtnShow: 99,
      initShareData: false,
      membersVosDesignerId: ""
    }
    this.handlePointF = this.handlePointF.bind(this);
  }

  toCompany(cid, companyType) {
    this.handlePointF('3027');
    if (companyType === 0) {
      //装修公司详情
      window.location = `/mainapp/decoCorpDetail.html?detailId=${cid}&back=h5`
    } else if (companyType === 2) {
      //设计机构
      window.location = `/mainapp/decoInstituteDetail.html?detailId=${cid}&back=h5`
    }

  }
  isShowBottomBtn() {
    let scroll = document.documentElement.scrollTop || document.body.scrollTop
    if (scroll > 210) {
      this.setState({
        bottomBtnShow: true
      })
    } else {
      this.setState({
        bottomBtnShow: false
      })
    }
  }

  handlePointF(id, p_action_id) {
    this.props.f({
      id,
      p_action_id
    })
  }

  // shouldComponentUpdate(nextProps,nextState){
  //   if(this.state.bottomBtnShow !=99 && nextState.bottomBtnShow === this.state.bottomBtnShow){
  //     return false
  //   }else {
  //     return true
  //   }
  // }

  componentWillMount() {

    window.addEventListener("scroll", this.isShowBottomBtn.bind(this))
    getDesignStudioInfo(this.detailId).then((res) => {
      if (res.code == 200) {
        console.log(res)
        this.setState({
          membersVosDesignerId: res.dataMap.membersVos[0].id,
          res: res.dataMap,
          share: false,
          initShareData: true,
        })

        let items = []
        res.dataMap.honorVos && res.dataMap.honorVos[0] && [...res.dataMap.honorVos].map((val, idx) => {
          return items.push(Object.assign({}, { title: val.awardName }, { contents: val.awardDescription }))
        })
        this.honorList = {
          dialogInfos: items,
          dialogIsShow: !this.state.dialogIsShow,
          dialogTitle: "荣誉奖项"
        }

        let _items = []
        res.dataMap.designServices && res.dataMap.designServices[0] && [...res.dataMap.designServices].map((val, idx) => {
          return _items.push(Object.assign({}, { title: val.serviceName }, { contents: val.serviceIntroduction }))
        })
        res.dataMap.constructServices && res.dataMap.constructServices[0] && [...res.dataMap.constructServices].map((val, idx) => {
          return _items.push(Object.assign({}, { title: val.serviceName }, { contents: val.serviceIntroduction }))
        })
        this.servicesList = {
          dialogInfos: _items,
          dialogIsShow: !this.state.dialogIsShow,
          dialogTitle: "设计服务"
        }


        const { membersVos } = res.dataMap
        this.leaderItem = membersVos && (<div className="teamBox">
          <div className="teamTab">团队成员</div>
          <div className={cs({ "teamContent": true })} style={{ flexDirection: membersVos.length < 4 ? "column" : "row" }}>
            {
              membersVos &&
                membersVos.length < 4 ? membersVos.map((val) => {
                  return (
                    <div key={Math.random()} className={cs({ "teamItem teamItem_2": true })}>
                      <div className={cs({ "leader_2": !!val.workingHours, "memberPic": true })}
                        style={{ background: `url(${val.avatar}) no-repeat` }}></div>
                      <div className="memberName">
                        <div>{val.name}</div>
                        {
                          val.workingHours &&
                          <div className="memberWorkTime">从业{val.workingHours}</div>
                        }


                      </div>
                      <div className="memberPosition">{val.workerType}</div>

                    </div>
                  )
                }) :
                membersVos.map((val) => {
                  return (
                    <div key={Math.random()} className={cs({ "teamItem": true, "leader": !!val.workingHours })}>
                      <div className="memberPic" style={{ background: `url(${val.avatar}) no-repeat` }}></div>
                      <div className="memberName">{val.name}</div>
                      <div className="memberPosition">{val.workerType}</div>
                      <div className="memberWorkTime">{val.workingHours}</div>
                    </div>
                  )
                })
            }
          </div>
        </div>)

      }
    })
    //PZ点家装设计师详情p
  }

  handleCasesList() {
    this.handlePointF('3026');
    const dataNative = {
      tag: '73',
      designId: this.state.membersVosDesignerId
    };
    console.log(dataNative)
    new HybridBridge(window).hybrid('call_native', dataNative)
  }

  honorMore() {
    if (!this.state.bottomBtnShow) {
      document.querySelectorAll("html")[0].style.overflow = "hidden"
      document.querySelectorAll("html")[0].style.height = "100%"
      document.querySelectorAll("body")[0].style.overflow = "hidden"
      document.querySelectorAll("body")[0].style.height = "100%"
    }
    setTimeout(() => {
      this.setState(this.honorList)
    }, 200)
  }

  servicesMore() {
    if (!this.state.bottomBtnShow) {
      document.querySelectorAll("html")[0].style.overflow = "hidden"
      document.querySelectorAll("html")[0].style.height = "100%"
      document.querySelectorAll("body")[0].style.overflow = "hidden"
      document.querySelectorAll("body")[0].style.height = "100%"
    }
    setTimeout(() => {
      this.setState(this.servicesList)
    }, 200)
    this.handlePointF('3024');
  }

  showServe(sName, sId, idx) {
    if (!this.state.bottomBtnShow) {
      document.querySelectorAll("html")[0].style.overflow = "hidden"
      document.querySelectorAll("html")[0].style.height = "100%"
      document.querySelectorAll("body")[0].style.overflow = "hidden"
      document.querySelectorAll("body")[0].style.height = "100%"

    }
    this.setState({
      ...this.servicesList,
      dialogIsShow: !this.state.dialogIsShow,
    })
    // page, channel, type, title, item, actionId = '', action = '', actionPos = '', actionTol = '', id = this.id, domain = 'mmall.com'
    this.point.f('110.300.49.58.68.78.353', 'deco', 'page.designer.detail', sName, 'p_server', '', '', '', '', sId);
  }

  closeDialog(e) {
    document.querySelectorAll("html")[0].style.overflow = "auto"
    document.querySelectorAll("html")[0].style.height = "auto"
    document.querySelectorAll("body")[0].style.overflow = "auto"
    document.querySelectorAll("body")[0].style.height = "auto"
    this.setState({
      dialogIsShow: !this.state.dialogIsShow
    })
  }

  toCasesDetail(id) {

    if (!!id && id != 'undefined') {
      if (window.location.protocol != 'file:') {
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
      studioLogo,
      designerBudget,
      designerImage,
      styleList,
      designServices,
      honorVos,
      caseList,
      companyService,
      companyName,
      briefIntroduction,
      brightSpot,//此处一句话亮点后端取得是一句话亮点字段，设计师详情页面的一句话亮点是设计理念
      constructServices,
      openId,
      concept,//此处设计理念后端取得是设计理念字段，设计师详情页面的设计理念是一句话亮点
      activityBudget,
      caseCounts,
      designerService,
      companyId,
      companyType,
      membersVos,
      designerAvatar,
      studioName,
    } = this.state.res
    const desHeader = studioLogo || designerAvatar || ""
    console.log(desHeader, "----------------------------------------")
    const designerPicStyle = desHeader && { style: { background: `url(${desHeader}) no-repeat` } }
    console.log(designerPicStyle, "----------------------------------------")
    const pointAttention = {
      id: '2800',
    };
    return (
      <div className={cs({ "wrapper": true, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX, 'img-center': true })}>
        <Nav title='' initShareData={this.state.initShareData} designerId={this.state.membersVosDesignerId} showTip={true} hideNav={true} />
        <div className={cs({ "contentBox": true, "isIos": Env.ios })}>
          <div className="designerInfos">

            <div className="desTop">
              <div className="desLeft">
                <div className="desName">{studioName}</div>
                <div className="desWorkTime"></div>
                <div className="tags">
                  {
                    styleList && styleList.map((val, idx) => {
                      return (<div key={idx}>{val}</div>)
                    })
                  }
                </div>
                <div className="desSchool">{brightSpot}</div>
              </div>
              <div className="desRight">
                <div className="pic" {...designerPicStyle}></div>
              </div>
            </div>

            <div className="desBottom">
              <div className="price">
                <span className="priceInfo">设计费</span>
                <span className="prices">
                  <span className={cs({ "active": activityBudget ? true : false })}>￥<i className="priceNum">{activityBudget ? activityBudget : designerBudget}</i>/m²</span>
                  {
                    activityBudget &&
                    <span className="designerBudget">￥{designerBudget}/m²</span>
                  }
                </span>
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
          {
            designServices &&
            <div className="serviceBox">
              <div className="designerSer">
                <div className="serTitle">
                  <div className="boxName">设计服务</div>
                  <div className="more" onClick={this.servicesMore.bind(this, designServices, constructServices)}>查看详情</div>
                </div>
                <div className="serBox">

                  {
                    designServices && designServices[0] && [...designServices].map((val, idx) => {
                      return (
                        <div className="serItems" onClick={this.showServe.bind(this, val.serviceName, val.id, idx)} key={idx}>
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
                        <div className="serItems" onClick={this.showServe.bind(this, val.serviceName, val.id, idx)} key={idx}>
                          <div className="serIcon" style={{ background: `url(${Config.SERVICEICON[val.id]})` }}></div>
                          <div className="serName">{val.serviceName}</div>
                          <div className="serDesc"></div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>

              {this.leaderItem}

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
              <div className="honorBox">
                <div className="honorTitle">{honorVos[0].awardName}</div>
                <div className="honorContent">{honorVos[0].awardDescription}</div>
              </div>
            </div>
          }

          <div className={cs({ "caseBox": true, "dis": !caseList ? true : false })}>
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
                      <div className="casePic" style={{ background: `url(${val.imgUrl}.670x376.png!) no-repeat` }}></div>
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
              designerService &&
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
              concept
              &&
              <div className="designIdea">
                <div className="ideaTop">设计理念</div>
                <div className="ideaContent">{concept}</div>
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
            (
              <Appoint bottom={true}
                designerImage={studioLogo}
                designerName={studioName}
                companyName={companyName}
                cls={cs({ "appointBtn": true })}
                id={this.detailId}
                fid="3030"
                handlePointF={this.handlePointF}
                openId={openId} />
            )
        }
      </div>
    )
  }
}

