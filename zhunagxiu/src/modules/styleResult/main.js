import React from 'react';
import cs from 'classnames';
import './style1.scss';
import Nav from '../../lib/components/styleTestNav';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import Host from '../../lib/scripts/config_host';
import {StyleAdd} from "../../models/StyleTest";
import BigData from '../../lib/scripts/bigData';
import {Style} from './config';
import HybridBridge from 'rs-hybrid-bridge';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.point = new BigData();
    this.hybridBridge = new HybridBridge(window);
    this.style = sessionStorage.getItem("style")
    this.state = {
      records:"",
      iPhone_X:false
    }

    this.styleNames = Style
    this.styleTypes = {
      1:"你是人群中最个性的那一枚，我行我素、独特又张扬，喜欢明快活泼的色彩，但简洁经典、功能至上，喜欢舒适的棉麻质地纺织品，喜欢在慵懒的午后读本书，听随性的音乐。简单、活力、色彩、舒适是你家的代名词。",
      2:"你崇尚Less is more理念，摒弃繁复线条、多余装饰，功能至上，强调非对称、不规则、灵活的布局和构图手法，将室内用最简单的点、线、面来表达。你沉醉于当代艺术，有着极高的审美情趣和造诣，那让你的家散发着独特魅力。",
      5:"向往美国人休闲浪漫的生活方式，临海而住面对着广茂丛林，自然风光是室内设计最大的灵感，来自森林的实木餐桌椅，棉麻布艺或皮质沙发，森林或海洋风的床品布艺，天然的贝壳为装饰，做旧感的家具的突显休闲韵味。",
      7:"代中式人群中一眼就能辨识出你独特的文人气质，简单朴素的着装但质地精良，细节中体现你不俗的涵养。熟谙中国传统文化，琴棋书画、诗酒花茶常伴你左右，喜欢明式家具简洁、优雅的线条和传统的榫卯工艺，喜欢实木天然的芬芳。",
      8:"喜欢MUJI简单、轻松的格调，天然棉麻布艺不太在意图案、色彩，只在乎贴身舒适，把身心放平静。高效功能主义，让你的空间从不缺收纳之所，榻榻米地台茶室卧室两相宜。老唱片轻扬慢曲，有机食材和一杯热抹茶带来最惬意的下午。",
      10:"喜欢的元素太多，以至于无法用某一种风格来界定，这也正是时下最流行的“去风格化”，把来自世界各地喜欢的元素融汇到一起，空间搭配出现无限可能性，元素过多则需要适当做减法，统一、呼应、协调、对比是搭配上策。",
    }
  }

  componentDidMount() {

    var that = this
    this.hybridBridge.hybrid('FromNativeParms', '').then((result)=> {
      if(!!result && result.iPhone_X != "undefined"){
        that.setState({
          iPhone_X:result.iPhone_X
        })
        // that.iphoneX = result.iPhone_X
      }
    })


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

    let cityCode = sessionStorage.getItem("cityCode")
    let options = {
      "ageId": "0",
      "houseId": "0",
      "dressingId": "0",
      "styleOne": sessionStorage.getItem("style_1"),
      "styleTwo": sessionStorage.getItem("style_2"),
      "styleThree":sessionStorage.getItem("style_3"),
      "styleId": this.style
    };
    this.getCaseList(cityCode,options);
//    this.point.p('110.300.49.58.68.78.77','deco','page.testResult','page.testResult','p_testResult');
  }

  getCaseList(cityCode,options){

    StyleAdd(cityCode, options).then((res) => {
      console.log(res);
      if (res.code == 200 && res.dataMap) {
        this.setState({
          records: res.dataMap
        });
      }
    });
  }



  jumpToPage(target,page){
    if(page === 'case'){
      this.point.f('110.300.49.58.68.79.71','deco','page.testResult','page.testResult','p_caseinfo');
    }
    if(page === 'designer'){
      this.point.f('110.300.49.58.68.79.98','deco','page.testResult','page.testResult','p_designer');
    }
    location = Host.path +'/mainapp'+ target;
  }

  render(){
    let { records } = this.state;
    return(
      <div className={cs({"styleDetailBox":true,'ios-nav': Env.rsApp && Env.ios, 'img-center': true})}>
        <Nav iPhone_X={this.state.iPhone_X} title="测验结果" shareIcon={false} showTip={false} hideNav={false}/>
        <div className={cs({"main":true,"iphoneX":this.state.iPhone_X})}>
          <div className="styleResults">
            <div className="styleTitle" style={{background:`url(${this.styleNames[this.style]}) no-repeat`}}>

            </div>
            <div className="styleContent">
              <p>{this.styleTypes[this.style]}</p>
            </div>
            <div className="yourStyle">您所在的风格占比</div>
            <div className="stylePic"></div>
          </div>
          {records[0] && Env.rsApp &&
          <div className="pushCase">
            <h3>为您匹配案例</h3>
            {
              records.map((item, idx) => {
                return (
                  <div className="caseInfo" key={idx}>
                    <div className="caseImg" onClick={this.jumpToPage.bind(this,`/caseAnalyseDetail.html?detailId=${item.caseId}`,'case')}>
                      <img src={item.caseImage+`!`}/>
                    </div>
                    <div className="caseTitle">
                      {item.title}
                    </div>

                  </div>
                )
              })
            }
          </div>}
        </div>
      </div>
    )
  }
}

