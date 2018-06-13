import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link,NavLink} from 'react-router-dom'
import {getDesignerInfo} from '../../models/DesignerModel'
import queryString from 'query-string';
import DesignerDetail from './designerDetail'
import DesignerMaster from './designerMaster'
import './style.scss'
import BigData from '../../lib/scripts/bigData';
import Env from 'rs-browser';
import Host from '../../lib/scripts/config_host';
import WXshare from'../../lib/scripts/WXshare';
import HybridBridge from 'rs-hybrid-bridge';

export default class Main extends Component{
  constructor(props){
    super(props);
    this.point = new BigData();
    this.WXshare = new WXshare();
    const params = queryString.parse(location.search);
    this.hybridBridge = new HybridBridge(window);
    this.detailId = params.detailId;
    this.state = {
      details:null,
      styleList:[],
      designerService:[],
      caseList:[],
      answerList:[],
      navIdx:0,
      isScrollMaxHeight:false,
      isMaster:false,
      detailId:this.detailId,
      openid:"",
      shareData:[],
      navNo:999,
    }
  }


  componentWillMount(){

    var that = this
    this.hybridBridge.hybrid('FromNativeParms').then((result)=> {
      let version = (result.version.split(".")).join("")*1
      if(Env.ios){
        version<322 && that.setState({
          navNo:0
        })
      }else if(Env.android){
        version<324 && that.setState({
          navNo:0
        })
      }

    })
  }


  componentDidMount(){
    getDesignerInfo(this.detailId).then((res)=>{
      if(res.code == 200){
        let dataMap = res.dataMap
        if(dataMap.level == 7){
            this.setState({
              level:dataMap.level,
              isMaster:true,
              caseList:dataMap.caseList,
              bannerBg:dataMap.coverImage,
              id:this.detailId,
              details:dataMap,
              openid:dataMap.openId,
              designerId:this.detailId,
              converImg:dataMap.personalizedCoverImage
            })
        }else{
          this.designerImg = dataMap.designerImage;
          document.title = dataMap.designerName || '设计师详情';
          let share = {
            title: dataMap.designerName || '',
            img: dataMap.designerImage+'.200x200.png!'||'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
            text: dataMap.concept||'红星美凯龙为中国生活设计:全新家居网上商城,高品位室内设计方案,从设计到软装为您打造有品质的家居生活,详询4008-213-213'||''
          };
          this.WXshare.WXshareInfo(share);
          this.setState({
            accountType:dataMap.accountType,
            designerId:this.detailId,
            openid:dataMap.openId,
            details:dataMap,
            designerUrl:dataMap.designerImage,
            bannerBg:dataMap.coverImage,
            desName:dataMap.designerName,
            level:dataMap.level,
            concept:dataMap.concept || "",
            styleList:dataMap.styleList,
            workingHours:dataMap.workingHours,
            designerBudget:dataMap.designerBudget,
            activityBudget :dataMap.activityBudget,
            companyName:dataMap.companyName,
            designerService:dataMap.designerService,
            caseList:dataMap.caseList,
            isMaster:false,
            answerList:dataMap.answerList,
            shareData:[
              //'标题', '简介', '[image url]', '[current url]', false, 'objectId', '分享类型'
              dataMap.designerName,
              "红星美凯龙为中国生活设计:全新家居网上商城,高品位室内设计方案,从设计到软装为您打造有品质的家居生活,详询4008-213-213",
              'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!',
              `${Host.path}/mainapp/designersDetail.html?detailId=`+this.detailId,
              false, this.detailId, 'share_designer'
            ]
          })


        }
      }
    });

//PZ点家装设计师详情p
    this.point.pz('110.300.55.58.68.78.10', 'deco', 'page.designer.detail','', this.detailId);


  }


  render(){
    const tpl = !!this.state.details?(this.state.isMaster ? <DesignerMaster id={this.detailId} {...this.state} />:<DesignerDetail  {...this.state} />):""
    return(
      <div className="wrapper img-center">
        {tpl}
      </div>
    )
  }


}
