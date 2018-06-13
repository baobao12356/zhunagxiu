import React ,{Component} from 'react'
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link,NavLink} from 'react-router-dom'
import {getDesignerEvaluate,getDesignerCases,getDesignerAsk,getDesignerVideo} from '../../models/DesignerModel'
import HeadPic from './componentsItem/headPic/headPic'
import NewHeader from './componentsItem/newHeader/header'
import './style.scss'
import CaseItem from './componentsItem/caseItem/caseItem'
import AnswerItem from './componentsItem/answerItem/answerItem'
import EvaluateItem from './componentsItem/evaluateItem/evaluateItem'
import * as Config from './componentsItem/config'
import cs from 'classnames'
import Concern from '../../lib/components/concern'
import Appointment from './componentsItem/appointment/appointment'
import BigData from '../../lib/scripts/bigData';
import Env from 'rs-browser';
import AppDownloadTip from '../../lib/components/appDownloadTip';
import {getScrollTop, getWindowHeight, getScrollHeight} from '../../lib/scripts/getHeight';
import Host from '../../lib/scripts/config_host'

export default class DesignerDetail extends Component{
  constructor(props){
    super(props)
    this.toDecoCorpDetail = this.toDecoCorpDetail.bind(this)
    this.point = new BigData()
    this.casePage = 2
    this.askPage = 2
    this.evaluatePage = 2
    this.downBottomStr = ["正在加载...","没有更多了"]
    this.state = {
      details:null,
      styleList:[],
      designerService:[],
      caseList:[],
      answerList:[],
      navIdx:1,
      evaluateList:[],
      isTop:false,
      isShow:false,
      type:0,
      caseHasNextPage:true,
      askHasNextPage:true,
      caseBottom:false,
      askBottom:false,
      detailId:""
    }
  }


  componentDidMount(){
    this.setState({
      caseList:this.props.caseList,
      detailId:this.props.detailId,
      // answerList:this.props.answerList
    })
  }


  componentWillMount(){
    window.addEventListener('scroll', this.isScrollTop.bind(this));
  }

  isScrollTop(){
    let scrollTop = document.body.scrollTop;
    if(scrollTop>420){
      this.setState({
        isApp:!Env.rsApp,
        isTop:true
      })
    }else{
      this.setState({
        isApp:false,
        isTop:false
      })
    }

    if(scrollTop > this.itemBox.lastElementChild.offsetTop){
      this.setState({
        caseBottom:false,
        askBottom:false,
      })
      if(this.state.navIdx == 1 && this.state.caseHasNextPage && !this.state.caseBottom){
        getDesignerCases(this.props.designerId,this.casePage).then((res)=>{
          if(res.code == 200 && res.dataMap.totalPages>=this.casePage) {
            this.setState({
              isShow:true,
              type:0,

            })
            setTimeout(()=>{
              this.setState({

                caseList:this.state.caseList.concat(res.dataMap.records),
                isShow:false,
              })
            },1000)
            this.casePage++
          }else{
            this.setState({caseHasNextPage:false,isShow:true,})
            setTimeout(()=>{
              this.setState({
                type:1,
                isShow:false,
                caseBottom:true,
              })
            },1000)
          }
        })
      }
      if(this.state.navIdx == 0 && this.state.askHasNextPage && !this.state.askBottom){
        getDesignerVideo(this.props.designerId,this.askPage).then((res)=>{
          if( res.dataMap.records.length > 0 && res.dataMap.totalPages>=this.askPage) {
            this.setState({
              isShow:true,
              type:0,
            })
            this.askPage++
            setTimeout(()=>{
              this.setState({
                askBottom:false,
                answerList:this.state.answerList.concat(res.dataMap.records),
                isShow:false,
              })
            },2000)
          }else{
            this.setState({askHasNextPage:false,isShow:true,askBottom:false,})
            setTimeout(()=>{
              this.setState({
                type:1,
                isShow:false,
                askBottom:true,
              })
            },2000)
          }
        })
      }
    }
  }



  isActive(key){
    this.setState({
      navIdx:key,
      type:0,
      caseBottom:false,
      askBottom:false,
    })
    switch (key){
      case 0:
        //回答埋点
        this.point.f('110.300.49.58.68.78.96', 'deco', 'page.designer.detail', this.props.desName, 'p_designer_detail_video');
        break
      case 1:
        //案例埋点
        this.point.f('110.300.49.58.68.78.72', 'deco', 'page.designer.detail', this.props.desName, 'p_case');
        break
      case 2:
        //评论埋点
        this.point.f('110.300.49.58.68.78.70', 'deco', 'page.designer.detail', this.props.desName, 'p_comment');
        break
    }

    if(key==2){
      getDesignerEvaluate(this.props.detailId).then((res)=>{
        this.setState({
          evaluateList:res.dataMap.data,
        })
      })
    }else if(key == 0){
      getDesignerVideo(this.props.detailId,1).then((res)=>{
        if(res.code == 200){
          this.setState({
            answerList:res.dataMap.records,
          })
        }
      })
    }

  }

  toDecoCorpDetail(){
    window.location = `${Host.path}/mainapp/decoCorpDetail.html?detailId=${this.props.details.companyId}`
  }





  render(){

    const
      {level,designerService,
        desName,activityBudget,
        concept,designerBudget,workingHours,
        bannerBg,designerUrl,
        styleList,companyName,
        openid,shareData,designerId,accountType,navNo} = this.props,
      setHead = {
        imgUrl:designerUrl,
        sizeIdx:0,
        clsName:"designerHeaderPic"
      },
      {evaluateList,caseList,answerList} = this.state,
      defaultDiv = (type)=>{
        return (<div className="defaultImgs"><img src={Config.defaultImgs[type]} alt=""/><span>还没有相关{Config.TAB[type]}</span></div>)
      }

    switch (this.state.navIdx){
      case 0:
        this.item =   answerList.length>0 &&  answerList.map((val,idx)=>{
            return <AnswerItem {...val} desName={desName}  designerId={designerId}  key = {idx}/>
          })
        break;
      case 1:
        this.item = !!caseList && caseList.map((val,idx)=>{
            return <CaseItem {...val} level={level} key = {idx} />
          })
        break;
      case 2:
        this.item = evaluateList.length>0 && evaluateList.map((val,idx)=>{
            return <EvaluateItem {...val} key = {idx} />
          })
        break;
    }

    return(
      <div>
        {Env.rsApp?<NewHeader id={designerId} shareData = {shareData}/>:<AppDownloadTip />}
        <div className="bannerBg" style = {{ background:`url(${bannerBg}.750x420.png!) no-repeat center`}}></div>
        <div className="desginerInfo">
          <HeadPic {...setHead} />
          <div className="designerName">
            {desName}
            <div style={{background:`url(${Config.IMG[level]})`}}></div>
          </div>
          <div className="tags">
            {
              concept && <div>{concept}</div>
            }
            <div className="tag">
              {
                styleList.map((val,idx)=>{
                  return <span key ={idx}>{val}</span>
                })
              }
            </div>
          </div>
          <div className="price">
            <div><span>{workingHours || 0}</span><span>从业时间</span></div>
            <div>
                <span className="prices">
                  {
                    activityBudget &&
                    <span className="activePrice"><i>￥</i>{activityBudget}</span>
                  }
                  <span>{designerBudget}</span></span>
              <span>平方单价</span>
            </div>
          </div>
          <div className="company">
            <div >
              <span>所属公司</span>
              <span className={accountType==1?"":"noBtn"} onClick = {accountType==1 && this.toDecoCorpDetail}>{companyName}</span>
            </div>
            <div>
              <span>服务城市</span>
                <span>
                  {
                    designerService.map((val,idx)=>{
                      return <span key = {idx}>{val}</span>
                    })
                  }
                </span>
            </div>
          </div>
          {
            Env.rsApp &&
            <div className="btns">
              <Concern id = {this.state.detailId} openid = {openid}  initConcernData={true} />
              <div><Appointment text="约TA设计" desName={desName} id={designerId} openid = {openid} /></div>
            </div>
          }
        </div>

        <nav className={cs({"itemsTag":true,"onTop":this.state.isTop,"notApp":this.state.isApp})} ref = {node=>{this.nav=node}}>
          {
            Config.TAB.map((val,key)=>{
              return <div key={key}
                          className={cs({"activeItem":this.state.navIdx==key},{"dis":navNo == key})}
                          onClick={this.isActive.bind(this,key)}>{val}</div>
            })
          }
        </nav>

        <div className="itemBox" ref = {node=>{ this.itemBox = node}}>
          {!!this.item?
            this.item:
            defaultDiv(this.state.navIdx)
          }

        </div>
        <div className={cs({"moreInfo":this.state.isShow,"more":true})}>{this.downBottomStr[this.state.type]}</div>
      </div>
    )
  }
}
