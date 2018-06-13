import React ,{Component} from  'react'
import Nav from '../../lib/components/nav'
import './style.scss'
import Env from 'rs-browser';
import * as Config from '../designersDetail/componentsItem/config'
import GoTo from './img/goTo.png'
import queryString from 'query-string';
import Collect from '../../lib/components/collect'
import Like from '../../lib/components/like'
import Comment from '../../lib/components/comment'
import Appoint from '../../lib/components/appoint'
import softTrimModel from '../../models/softTrimDetail'
import cs from 'classnames'
import BigData from '../../lib/scripts/bigData';

export default class Main extends Component{
  constructor(props){
    super(props)
    this.point = new BigData()
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.toDesignerPage = this.toDesignerPage.bind(this);
    this.caseDetails=this.caseDetails.bind(this);
    this.state = {
      designerHxAppVo:""
    }


  }

  componentWillMount(){
    softTrimModel.softTrimDetail(this.detailId).then((res)=>{
      if(res.code == 200){
        const result = res.dataMap
        const designerRes = res.dataMap.designerHxAppVo
        this.setState({
          designerId:result.designerId,
          title:result.title,
          caseStyle:result.caseStyle,
          houseStyle:result.houseStyle ,
          houseArea:result.houseArea,
          designerName:designerRes.designerName,
          designerImg:designerRes.designerImg,
          houseImage:result.houseImage,
          budget:result.budget,
          caseDesc:result.caseDesc,
          spaceHxAppVoList:result.spaceHxAppVoList,
          designerHxAppVo:designerRes
        })
      }

    })

    this.share = {
      record: 'true',
      objectId: this.detailId,
      objectType: 'share_soft_decoration',
      title: this.state.title,
      img: 'http://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png',
      link: window.location.href
    }

    //PZ点家装设计师详情p
    // this.point.pz('110.300.49.58.68.78.99', 'deco', 'p_decorationDesign_info','p_decorationDesign_info',  this.detailId);

  }


  toDesignerPage(){
    this.props.f({
      id:'1354'
    })
    if(this.state.designerHxAppVo.designerLevel==7){
      window.location = `/mainapp/designerMasterDetail.html?detailId=${this.state.designerId}&back=h5`
    }else{
      window.location = `/mainapp/designerNormalDetail.html?detailId=${this.state.designerId}&back=h5`
    }
  }


  caseDetails(){
     this.props.f({
       id:'1352'
     })
  }

  render(){
    let collect = {
      sourceType: '29',
      channel: 'deco',
      picture: 'http://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png',
      title: "title"
    };
    const pointShare = { //分享埋点数据
      id:'1412',
     };

    const
      {designerId,title,caseStyle,
        houseStyle,houseArea,designerName
        ,designerImg,houseImage,budget,caseDesc,
        spaceHxAppVoList,designerHxAppVo} = this.state
    let spaceHxAppVoItem = ""
    if(!!spaceHxAppVoList){
       spaceHxAppVoItem = spaceHxAppVoList.map((val,idx)=>{
        return(
          <div className="caseType" key={idx}>
            <div className="caseTypeTitle">{val.objectName}</div>
            {
              val.softSpaceImageHxAppVos.map((vals,ids)=>{
                  return(
                    <div className="caseTypePic" key = {ids}>
                      <img src={vals.imageUrl+".750x466.png"} style={{width:`100%`}} onClick={this.caseDetails}/>
                      {
                        !!vals.imageDotHxAppVos &&
                        vals.imageDotHxAppVos.map((value,index)=>{
                          return (
                            <span className="clkTags"
                                       key = {index}
                                       style={{left:`${value.dotX*100*1}%`,top:`${value.dotY*100*1}%`}}>
                                    <i className=""></i><span>{value.productAppellation}</span>
                                  </span>
                          )
                        })
                      }
                    </div>
                  )
              })
            }
            <div className="caseTypeContent">{val.description}</div>
          </div>
        )
      })
    }



    return(
      <div className="img-center">
        <Nav shareIcon = {true}
             share={this.share}
             initShareData = {true}
             hideNav = {true}
             showTip = {true}
             pointShare={pointShare}
             f={this.props.f}
             />
        <div className = {cs({
                   "iosApp":Env.rsApp && Env.ios,
                    "andApp":Env.rsApp && Env.android,
                    "wrapper":true})}
        >
          <div className="title">{title}</div>
          <div className="tags">
            {caseStyle && <span>{caseStyle}/</span>}
            {houseStyle && <span>{houseStyle}/</span>}
            {(!!houseArea || houseArea==0) && <span>{houseArea}平方</span>}
          </div>

          <div className="designer" onClick = {this.toDesignerPage}>
            <div className="pic"><img src={designerImg+".80x80.png!"} alt=""/></div>
            <div className="designerName">{designerName}</div>
          </div>
          <div className="casePic">
            <img src={houseImage+".750x500.png"} alt=""/>
          </div>
          <div className="caseTitle">软装预算：{budget}万</div>
          <div className="caseContent">
            {caseDesc}
          </div>
          {spaceHxAppVoItem}
          <div className="designers">
            <div className="designerTitle">设计师名片</div>
            <div onClick = {this.toDesignerPage} className={cs({"designerBox":true,"mb-50":!Env.rsApp})}>
              <div className="designerPhoto">
                <img src={designerImg+".128x128.png!"} alt=""/>
                <div>{designerHxAppVo.personalBrightSpot && `设计理念`}</div>
              </div>
              <div className="designerInfo">
                <div className="designerName">
                  {designerName}
                  <span>
                    {
                      Config.IMG[designerHxAppVo.designerLevel] &&
                        <img src={Config.IMG[designerHxAppVo.designerLevel]}/>
                    }
                  </span>
                </div>
                <div className="infoTags">
                  {designerHxAppVo && <span>从业{designerHxAppVo.workingHours}</span>}
                  {designerHxAppVo && <span>{designerHxAppVo.budget}</span>}
                  {designerHxAppVo && <span>{designerHxAppVo.serviceCity}</span>}
                </div>
                <div className="desc">{designerHxAppVo.personalBrightSpot}</div>
              </div>
              <div className="toDesigner"><img src={GoTo} alt=""/></div>
            </div>
          </div>
        </div>

        {Env.rsApp &&
        <div className="footer">
          <Comment id={this.detailId} type="review_soft_decoration" noCount="true" caseDetail="true"/>
          <Like id={this.detailId} likeType='liked_soft_decoration' caseDetail="true"/>
          <Collect id={this.detailId} collect={collect} initCollectData={true} caseDetail="true"/>
          <Appoint text="约TA设计" designerId = {designerId} caseId={this.detailId}/>
        </div>
        }

      </div>
    )
  }
}

