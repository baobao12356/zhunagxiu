import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getDesignerInfo } from '../../models/DesignerModel'
import queryString from 'query-string';
import './style.scss'
import BigData from '../../lib/scripts/bigData';
import Env from 'rs-browser';
import cs from 'classnames'
import Nav from './componentsItem/nav'
import Host from '../../lib/scripts/config_host'

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.point = new BigData()
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.onlyH5 = params.back == "h5" ? true : false;
    this.state = {
      itemVal: "",
      designerEnglishName: "",
      designerName: "",
      personalHonor: "",
      honorVos: "",
      caseBox: "",
      brightSpot: "",
      companyHonor: "",
      achievement: "",
      companyHonorLabel: false,
      brightSpotLabel: false,
      honorVosLabel: false,
      iphoneX: false,
      initShareData: false,
    }
  }

  componentWillMount() {
    if (document.body.scrollHeight == 635) {
      this.setState({
        iphoneX: true
      })
    }

    getDesignerInfo(this.detailId).then((res) => {
      if (res.code == 200) {
        console.log(res)
        this.setState({
          designerEnglishName: res.dataMap.designerEnglishName,
          designerName: res.dataMap.designerName,
          personalHonor: res.dataMap.personalHonor,
          honorVos: res.dataMap.honorVos,
          caseBox: res.dataMap.caseList,
          brightSpot: res.dataMap.brightSpot,
          companyHonor: res.dataMap.companyHonor,
          openId: res.dataMap.openId,
          personalizedCoverImage: res.dataMap.personalizedCoverImage,
          coverImage: res.dataMap.coverImage,
          achievement: res.dataMap.achievement,
          initShareData: true
        })
      }
    });
    //PZ点家装设计师详情p
    //    this.point.p('c39cc5e5-0648-453d-8564-6c6a84a80b32', 'deco', 'page_MasterdesignerInfo_detail',this.detailId, this.detailId);
    //    this.point.z('110.300.49.58.68.78.53', 'deco', 'p_MasterdesignerInfo','', this.detailId);
  }

  componentDidMount() {
    const minHeight = 200
    if (!!this.companyHonor && this.companyHonor.clientHeight > minHeight) {
      this.setState({
        companyHonorLabel: true,
      })
    }
    if (!!this.brightSpot && this.brightSpot.clientHeight > minHeight) {
      this.setState({
        brightSpotLabel: true,
      })
    }
    if (!!this.personalHonor && this.personalHonor.clientHeight > minHeight) {
      this.setState({
        personalHonorLabel: true,
      })
    }

  }

  toCasesDetail(id) {

    if (window.location.protocol != 'file:') {
      // window.location = `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${id}&back=h5`;
      window.location = `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${id}&__open=1`;

    } else {
      // window.location = `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${id}&back=file`;
      window.location = `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${id}&__open=1`;

    }

  }

  render() {
    const { personalizedCoverImage,
      openId,
      personalHonor,
      honorVos,
      designerEnglishName,
      designerName,
      caseBox,
      brightSpot,
      companyHonor,
      coverImage,
      achievement } = this.state
    // const item = !!itemVal && Object.entries(itemVal).map((val,idx)=>{
    //       return <InfoItem key = {idx} vals = {val} />
    //   })

    const honor = honorVos && [...honorVos].map((val, idx) => {
      return (
        <div key={idx}>
          <div className="honorTitle">{val.awardName}</div>
          <div className="honorContent">{val.awardDescription}</div>
        </div>
      )
    })
    const cases = caseBox && [...caseBox].map((val, idx) => {
      return (
        <div className="caseItem" key={idx} onClick={this.toCasesDetail.bind(this, val.caseId)}>
          <div className="casePic" style={{ background: `url(${val.imgUrl}.750x420.png!) no-repeat` }}></div>
          <div className="title">{val.title}</div>
        </div>
      )
    })
    const style = personalizedCoverImage && {
      background: `url(${personalizedCoverImage + `.750x1334.png!`})
     no-repeat`};

    const pointAppoint = {
      id: '2790',
    };
    return (
      <div className="wrapper img-center">
        <Nav f={this.props.f} pointAppoint={pointAppoint} title='' initShareData={this.state.initShareData} onlyH5={this.onlyH5} openId={openId} designerId={this.detailId} />
        <div className={cs({ "contentsBox": true })} style={style}>
          <div className={cs({ "contents": true, "iphoneX": this.state.iphoneX })} >
            <div className="designerTitle designerInfoItem">
              <div className="desName">{designerName}</div>
              <div className="EngName">{designerEnglishName}</div>
            </div>

            <div className={cs({ "designerInfoItem": true, "dis": !achievement })}>
              <div className="itemTitle">
                <div className="personal">个人成就</div>
              </div>
              <input type="checkbox" id="achievement" />
              <div className="itemText" ref={node => this.achievement = node}>
                {achievement}
              </div>
              <label htmlFor="achievement" className={!this.state.achievement && "dis"}></label>
            </div>

            <div className={cs({ "designerInfoItem": true, "dis": !personalHonor })}>
              <div className="itemTitle">
                <div className="honorIcon">个人荣誉</div>
              </div>
              <input type="checkbox" id="personalHonor" />
              <div className="itemText honor" ref={node => this.personalHonor = node}>
                {personalHonor}
              </div>
              <label htmlFor="personalHonor" className={!this.state.personalHonorLabel && "dis"}></label>
            </div>

            <div className="caseBox">
              {cases}
            </div>

            <div className={cs({ "designerInfoItem": true, "dis": !brightSpot })}>
              <div className="itemTitle">
                <div>风格理念</div>
              </div>
              <input type="checkbox" id="brightSpot" />
              <div className="itemText" ref={node => this.brightSpot = node}>
                {brightSpot}
              </div>
              <label htmlFor="brightSpot" className={this.state.brightSpotLabel && "dis"}></label>
            </div>

            <div className={cs({ "designerInfoItem": true, "dis": !companyHonor, "lastItem": true })} >
              <div className="itemTitle">
                <div>公司荣誉</div>
              </div>
              <input type="checkbox" id="companyHonor" />
              <div className="itemText" ref={node => this.companyHonor = node}>
                {companyHonor}
              </div>
              <label htmlFor="companyHonor" className={this.state.companyHonorLabel && "dis"}></label>
            </div>

          </div>
        </div>

      </div>
    )
  }


}
