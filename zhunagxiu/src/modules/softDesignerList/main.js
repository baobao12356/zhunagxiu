import React, {Component} from 'react';
import cs from 'classnames'
import './style.scss'
import {GetCaseList,getBabel,getHxappCities} from '../../models/softDesignerListModel';
import DesignerInfo from './compoments/designerInfo'
import backImg from './img/back.png';
import QueryString from 'query-string';
import sign from './img/logo.jpg';
import SelectList from './compoments/selectList';
import onfire from 'onfire.js';
import ScrollFunc from '../../lib/scripts/scrollFunc';
import { Toast, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import BigData from '../../lib/scripts/bigData';
/*import getGeo from '../../lib/scripts/getGeo';*/
import Nav from '../../lib/components/nav';
import Env from 'rs-browser';
import HybridBridge from 'rs-hybrid-bridge';


export default class DesignerListClass extends Component {
  constructor(props) {
    super(props)
    this.getCaseList = this.getCaseList.bind(this);
   this.shadowShow=this.shadowShow.bind(this);
    this.state = {
      caseList:[],
      styleTypeList:[],
      shadowShowHide:false,
      noCase:false,
      hasNextPage:true,
      loadState:0,
      loading:true,
      imgList:[],
      pageNum:1,
      designStyle:"",
      houseCategory:"",
      range:'',
      sort:'',
      bizId:2001,
      webPadding: false
    }

    this.loadState = ["正在加载","已经最后一页"];
    this.point = new BigData();
    // const params = QueryString.parse(location.search);
    // this.companyId = (params&&params.cityCode)||'';
    this.companyId = '';
  }

  componentDidMount() {
    if(!Env.rsApp){
      this.setState({
        webPadding:true
      })
    }

    onfire.on('closeTip',() => {
      this.setState({
        webPadding:false
      })
    });

    getBabel().then((res)=>{

        if(res.code==200){
          res.dataMap&&res.dataMap.length&&this.setState({
            styleTypeList:res.dataMap
          })
        }else{
          Toast.offline(res.message||'请求出错', 1);
        }

    }).catch((err) => {console.log(err)})

    let hybridBridge = new HybridBridge(window);
    hybridBridge.hybrid('jzServiceCityCode', '').then((result)=> {
      let cityCode = result.cityCode;
      sessionStorage.setItem("cityCode",cityCode);
    }).catch((error)=> {
      console.log('获取cityCode失败');
    });

    getHxappCities().then((data)=> {
      if(data.code==200&&data.dataMap){
    //设置详情状态
       for(let i=0; i<data.dataMap.length; i++){
      if((data.dataMap[i].cityCode).includes(sessionStorage.getItem('cityCode'))){
         this.companyId = data.dataMap[i].cityCode;
          }
        }
      }


    //分页
    if(this.state.pageNum == 1){
      this.getCaseList(this.state.bizId,this.state.pageNum,this.state.designStyle,this.state.houseCategory,this.state.range,this.state.sort,1, this.companyId)

    }
    window.addEventListener('scroll', this.isScrollTop.bind(this));

      })
      .catch((error)=> {
        console.log('未匹配到开通城市', error);
      });


//  this.point.p('aea43966-5fdc-4e0f-ab84-4c791c4466e7', 'home', 'page_softdesigner_list','软装设计师列表页','');
//  this.point.z('3a965480-eb29-4478-ac81-62aba6d1657d', 'home', 'page_softdesigner_list_Z','软装设计师列表页_Z','');


  }



  isScrollTop(){
    if(ScrollFunc.ifScroll()){
      if(this.state.loading && this.state.hasNextPage){
        this.setState({
          loading:false
        });
        this.getCaseList(this.state.bizId,this.state.pageNum,this.state.designStyle,this.state.houseCategory,this.state.range,this.state.sort,'', this.companyId)
        setTimeout(()=>{
          this.setState({
            loading:true
          })

        },1000)
      }
    }
  }

  getCaseList(bizId,PageNo, designStyle, houseCategory,range,sort,num,companyId=this.companyId){

    if(num == 1){
      this.setState({
        pageNum : 1,
        designStyle:designStyle,
        houseCategory:houseCategory,
        imgList:[],
        hasNextPage:true,
        loadState:0,
        loading:true,
        range:range,
        sort:sort,
      })

      window.scrollTo(0,0);
    }

    GetCaseList(bizId,PageNo, designStyle, houseCategory,range,sort,this.companyId).then((res)=>{
      if( res.code == 200&&res.dataMap&&res.dataMap.length){
        const dataMap=res.dataMap[0];
        this.setState({
          noCase:false,
        })

        if(dataMap.totalCount&&(Number(this.state.pageNum)<Number(dataMap.totalCount)/10)){

          // this.state.pageNum ++
           this.setState({
            pageNum: this.state.pageNum+1
           })
        }else{
          this.setState({
            hasNextPage:false,
            // loading:false,

            loadState:1,
          })
        }

        if(!(this.state.imgList&&this.state.imgList.length)){
          this.setState({
            imgList:dataMap.data,
          })
        }else{
          this.setState({
            imgList:[...this.state.imgList,...dataMap.data]
          })
        }

      }else{
        if(num == 1){
          this.setState({
            noCase:true,
          })

        }
        this.setState({
          hasNextPage:false,
          loadState:1,
        })
      }
    }).catch((err) => {console.log(err)})
  }





  shadowShow(styleShadow) {
    if(styleShadow){
      document.getElementsByTagName('html')[0].setAttribute("class", "overHidden");
      this.setState({
        shadowShowHide:true,
      })

    }else{
      document.getElementsByTagName('html')[0].removeAttribute("class", "overHidden");
      this.setState({
        shadowShowHide:false,
      })
    }
  }



  goIndex() {
    window
      .history
      .go(-1);
  }

  render() {


    return (
      <div className={cs({"wrap_desgin":true,'app-wrap':Env.rsApp,'ios-nav': Env.rsApp && Env.ios,'webPadding':this.state.webPadding, 'img-center': true})}>
        <Nav title='软装服务' shareIcon={false} hideNav={true} showTip={false}/>
        <section className="section_list">
          {/*<SelectList getCaseList = {this.getCaseList} styleTypeList = {this.state.styleTypeList} shadowShow={this.shadowShow}/>
          <div className="line_select"></div>*/}
          <div className="detail">
        <DesignerInfo noCase={this.state.noCase} shadowShowHide={this.state.shadowShowHide} imgList={this.state.imgList}/>
          </div>
        </section>
        <div className ={cs({"loadingBar":true,"loading":!this.state.loading})}>{this.loadState[this.state.loadState]}</div>

      </div>
    )
  }

}


