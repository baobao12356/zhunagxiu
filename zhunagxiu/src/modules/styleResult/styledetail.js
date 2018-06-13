import React from 'react';
import cs from 'classnames';
import './style.scss';
import Nav from '../../lib/components/nav';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import DefaultUser from '../../lib/components/defaultUser';
import Host from '../../lib/scripts/config_host';
import {StyleAdd} from "../../models/StyleTest";
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../lib/scripts/bigData';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.level = {
      'jy': require('./img/jy.png'),
      'sx': require('./img/sx.png')
    };
    this.state = {
      webPadding: false,
      text: '',
      imgs: '',
      records: []
    }
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

    let styleIdArg = ['8','1','2','7','5'];

    let resultImg = {
      "7":require('./img/xdzs2x.png'),
      "1":require('./img/hlbo2x.png'),
      "5":require('./img/xxms2x.png'),
      "2":require('./img/xdjy2x.png'),
      "8":require('./img/cyrs2x.png')
    };
    let resultContent = {
      "7":'人群中一眼就能辨认出你独特的文人气质，简单朴素的着装但质地精良，低调内敛，细节中体现你不俗的涵养。熟谙中国传统文化，笔墨纸砚、诗酒花茶一切风雅之事常伴你左右，喜欢中国古老的榫卯结构，喜欢明式家具简洁、优雅的线条，喜欢木头天然的芬芳。',
      "1":'你是人群中最具个性的那一枚，我行我素，独特又张扬，喜欢明快活泼的色彩，喜欢简洁经典、功能至上的设计，喜欢舒适的棉麻质地纺织品，喜欢在慵懒的午后读一本书，听轻松随性的音乐。简单、活力、色彩、舒适是你想要的家的代名词。',
      "5":'向往美国西海岸人民休闲浪漫的生活方式，临近风光旖旎的沙滩海岸、茂密丛林居住，自然风光是室内设计最大的灵感，实木质地的餐桌椅，棉麻布艺或皮质沙发，森林或海洋风的窗帘床品布艺，天然的贝壳成为室内装饰，常把家具做得旧旧的更突显休闲韵味。',
      "2":'你崇尚Less is more的包豪斯理念，摒弃掉所有风格当中繁复的线条，多余的装饰，功能至上，强调非对称、不规则、灵活的布局与构图手法，将室内用最简单的点、线、面来表达。你沉醉于当代艺术，有着极高的审美情趣和造诣，那让你的家散发着独特魅力。',
      "8":'喜欢MUJI简单、轻松的格调，天然棉麻布艺不在于图案精美和色彩鲜丽，只在乎贴身舒适，和把身心放平静。高效功能主义，让你的空间从来不缺收纳之所，榻榻米地台亦茶室亦卧室两相宜。老唱片轻扬慢曲，有机食材和一杯抹茶带来最惬意的下午。'
    };

    let styleId = styleIdArg[sessionStorage.getItem("styleId")];
    let ageId = sessionStorage.getItem("ageId");
    let houseId = sessionStorage.getItem("houseId");
    let dressingId = sessionStorage.getItem("dressingId");

    let options = {
      "ageId": ageId,
      "houseId": houseId,
      "dressingId": dressingId,
      "styleId": styleId
    };

    this.setState({
      imgs: resultImg[styleId],
      text: resultContent[styleId]
    });

    this.getCaseList(options);
//    this.point.p('110.300.49.58.68.78.77','deco','page.testResult','page.testResult','p_testResult');
  }

  getCaseList(options){
    var hybridBridge = new HybridBridge(window);

    let cityCode = "310100"; // 设置默认上海

    hybridBridge.hybrid('jzServiceCityCode', '').then((result)=> {

      cityCode=result.cityCode;
    }).catch((error)=> {
      console.log('获取cityCode失败');
    });

    StyleAdd(cityCode, options).then((res) => {
      console.log(res);
      if (res.code == 200 && res.dataMap) {
        console.log("成功");

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
      <div className={cs({"styleDetailBox":true,'ios-nav': Env.rsApp && Env.ios})}>
        <Nav title="测验结果" shareIcon={false} showTip={false} hideNav={false}/>
        <div className="main">
          <div className="styleResults">
            <div className="styleTitle">
              <img src={this.state.imgs}/>
            </div>
            <div className="styleContent">
              <p>{this.state.text}</p>
            </div>
          </div>
          {records[0] &&
          <div className="pushCase">
            <h3>精选案例</h3>
            {
              records.map((item, idx) => {
                return (
                  <div className="caseInfo" key={idx}>
                    <div className="caseImg" onClick={this.jumpToPage.bind(this,`/caseAnalyseDetail.html?detailId=${item.caseId}`,'case')}>
                      <img src={item.caseImage}/>
                    </div>
                    <div className="designer_bottom">
                      <div className="designer_bottom_left" onClick={this.jumpToPage.bind(this,`/designersDetail.html?detailId=${item.designerId}`,'designer')}><DefaultUser src={item.designerImage} /></div>
                      <div className="designer_bottom_center">
                        <p>
                          <span className="designerName">{item.designerName}</span>
                          <span className="cityName_desinger">{item.designerCity}</span>
                          {item.designerLevel === "精英" && <span className="designerLevel"><img src={this.level["jy"]} /></span>}
                          {item.designerLevel === "首席" && <span className="designerLevel"><img src={this.level["sx"]} /></span>}
                        </p>
                        <p>
                          {item.workingHours && <span className="styleListItem">从业年限：{item.workingHours}</span>}
                        </p>
                      </div>
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

