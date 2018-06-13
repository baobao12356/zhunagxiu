import React from 'react';
import './style.scss';
import CorpDetailModel from '../../models/CorpDetailModel';
import queryString from 'query-string';
import Nav from '../../lib/components/nav';
import Env from 'rs-browser';
import QueryString from 'query-string';
import onfire from 'onfire.js';
import cs from 'classnames';


export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.state = {
      gradeInfo: {
        "grade": 4.0,
        "sggyScore": "3.0",
        "ycpzScore": "3.0",
        "fwslScore": "3.0"
      },
      basicGrade:'',
      webPadding:''
    }
  }

  plugin(ele,percent){
    let _this = this;
    this.parent = ele;
    this.PARAMS = {percent:(percent*40/3),w:400,oneCircle:"true"};
    //初始化参数
    function DrawCircle(){
      let drawOne=_this.PARAMS.oneCircle;
      let r=_this.PARAMS.w/2;
      let r1=_this.PARAMS.w/2-20;
      let x1=_this.PARAMS.w/2;
      let y1=_this.PARAMS.w/2;
      let canvas=_this.parent;
      let tip=_this.PARAMS.percent;
      let angle="";
      let init=0;
      let initA=0;
      let preM=0;
      let initM=0;  //因为是半圆  所以初始角度是Math.PI;
      let s=2*Math.PI/180;
      let bottomC=Math.PI;
      let allCount=180;
      let allCountP=1.8;
      let poinits=[];
      if(drawOne=="true"){
        angle=tip*2*Math.PI/100;
        canvas.width=_this.PARAMS.w;
        canvas.height=_this.PARAMS.w;
        bottomC=2*Math.PI;
        allCount=0;
        allCountP=3.6;
      }else{
        angle=tip*Math.PI/100+Math.PI;
        canvas.width=_this.PARAMS.w;
        canvas.height=_this.PARAMS.w/2;
        init=180;
        preM=Math.PI;
        initM=Math.PI;  //因为是半圆  所以初始角度是Math.PI;
        s=2*Math.PI/180;
      }
      let cxt=canvas.getContext("2d");
      //cxt.lineCap="round";
      cxt.lineWidth=6;
      let speed=1;
      let radius=_this.PARAMS.w/2-2;
      let ball={x:0,y:0,speed:2};
      let T1;
      function drawScreen(){
        //cxt.fillText(0,canvas.width/2,canvas.height/2);
        cxt.fillStyle="#2cc0d4";
        //var grd=cxt.createLinearGradient(0,0,0,170);
        ////grd.addColorStop(0,"black");
        ////grd.addColorStop(1,"white");
        //
        //cxt.fillStyle=grd;
        //cxt.fillRect(20,20,150,100);


        cxt.fillRect(0,0,canvas.width,canvas.height);
        //创建圆环与虚线
        //底圆
        cxt.beginPath();
        cxt.strokeStyle="rgba(255,255,255,0.5)";
        cxt.arc(x1,y1,r1-6,0,bottomC,true);
        cxt.stroke();  //先执行stroke  就不会出现横线
        cxt.closePath();
        //虚线
        let balls=[];
        for(let i=initA;i<=360;i+=ball.speed){
          let radians=(i)*(Math.PI/180);
          ball.x=x1+Math.cos(radians)*radius;
          ball.y=y1+Math.sin(radians)*radius;
          balls.push({x:ball.x,y:ball.y});
        }
        for(let i=0;i<balls.length;i++){
          cxt.fillStyle="#fff";
          cxt.beginPath();
          cxt.arc(balls[i].x,balls[i].y,1,0,Math.PI*2,false);
          //console.log(balls[i].x)
          cxt.closePath();
          cxt.fill();
        }
        //画实线
        if(initM<angle){
          initM+=s;
        }else{
          initM=angle;
        }
        cxt.beginPath();
        cxt.strokeStyle="#fff";
        cxt.arc(x1,y1,r1-6,5*Math.PI/6,5*Math.PI/6+initM,false);
        cxt.stroke();  //先执行stroke  就不会出现横线
        cxt.closePath();
        //画虚线
        if(init<tip*allCountP+allCount){  //小于初始角度
          init+=ball.speed
        }else{
          clearInterval(T1);
        }
        for(let i=initA;i<=init;i+=2){
          let radians2=i*(Math.PI/180);
          let a1=x1+Math.cos(radians2)*radius;
          let a2=y1+Math.sin(radians2)*radius;
          cxt.fillStyle="#fff";
          cxt.beginPath();
          cxt.arc(a1,a2,1,Math.PI,Math.PI,false);
          //console.log(balls[i].x)
          cxt.closePath();
          cxt.fill();
        }
        //百分比文字
        cxt.font="100px sans bold";
        cxt.textBaseline="20px";
        cxt.textAlign="center";
        cxt.fillStyle="#fff";
        let messT=tip*initM/angle;
        /*if(drawOne!="ture"){
         messT=tip*(initM)/angle;
         console.log(initM-Math.PI)
         }*/
        if(messT>tip){
          messT=tip
        }
        let mess=(3*messT/40).toFixed(1);
        cxt.fillText(mess,canvas.width/2,canvas.height/2);
      }
      //

      T1=setInterval(drawScreen,10)
    }
    DrawCircle();
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

    let ctx = document.getElementById('canvasIndex'),_this = this;
    try{
      CorpDetailModel.ReceiveGrade(this.detailId)
        .then((data)=> {//设置详情状态
          if(data.code==200){
            this.setState({
              gradeInfo:data.dataMap
            });
            _this.plugin(ctx,data.dataMap.grade);
          }else{
            _this.plugin(ctx,_this.state.gradeInfo.grade);
          }
        });
    }catch (e){
      _this.plugin(ctx,_this.state.gradeInfo.grade);
    }
  }

  render() {
    let totalScore = Number(this.state.gradeInfo.grade).toFixed(1),basicGrade ='';

    if(4.9 <= totalScore && totalScore <= 5){
      basicGrade = '精品'
    }else if(4.6<=totalScore && totalScore<=4.8){
      basicGrade = '超赞'
    }else if(4.3<=totalScore && totalScore<=4.5){
      basicGrade = '很好'
    }else if(4.0<=totalScore && totalScore<=4.2){
      basicGrade = '不错'
    }else{
      basicGrade = ''
    }
    return (
      <div className={cs({"evaluateDetail":true,'app-articleWrap':Env.rsApp,'ios-nav': Env.rsApp && Env.ios,'box-bottom':Env.rsApp,'webPadding':this.state.webPadding, 'img-center': true})}>
        <Nav title='评分细则' shareIcon={false} hideNav={true} showTip={true} onlyH5={true}/>
        <div className="headScore">
          <div className="loadingParent">
            <div>评分</div>
            <div>{basicGrade}</div>
            <aside>
              <canvas id="canvasIndex">您的浏览器不支持canvas标签，建议使用chrome,firefox,ie10+</canvas>
            </aside>
            <div></div>
            <div>{totalScore}</div>

          </div>
          <div className="detailScore">
            <div>
              <span>辅料品质</span>
              <span>{this.state.gradeInfo.ycpzScore+'分'}</span>
            </div>
            <div>
              <span>施工工艺</span>
              <span>{this.state.gradeInfo.sggyScore+'分'}</span>
            </div>
            <div>
              <span>服务实力</span>
              <span>{this.state.gradeInfo.fwslScore+'分'}</span>
            </div>
          </div>
        </div>
        <div className="tableParts">
          <div className="tablePart1">
            <div className="tableTitle">辅料品质<span>{this.state.gradeInfo.ycpzScore+'分'}</span></div>
            <div className="tableContent">
              <table>
                <tbody>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.ycpzScore)>=4})}>
                  <td>4.0～5.0</td>
                  <td>一类辅材分级标准是家装行业内知名品牌的新材料或高端材料，比如：铜芯复合管或纯铜管水管、涂膜柔性防水、耐水石膏板、防火石膏板、耐水成品腻子等。这类材料一般都能够高于普通家庭装饰装修的功能性需求。</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.ycpzScore)>=3&&Number(this.state.gradeInfo.ycpzScore)<4})}>
                  <td>3.0～4.0</td>
                  <td>二类辅材分级标准是市场上主流品牌的常规材料，比如：PPR水管、单芯纯铜硬质电线，E0等级木工板、普通成品腻子等。这类材料能够满足普通家庭常规的装饰装修功能需求。</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.ycpzScore)<3})}>
                  <td>3.0 以下</td>
                  <td>三类辅材分级标准是不推荐使用的材料，比如：镀锌钢管或PVC管水管、107 108建筑胶、E2等级以下的木工板等。这类材料大部分已经处于已经淘汰或正在逐步淘汰的状态，不适合家庭装饰装修使用。</td>
                </tr>
                </tbody>
              </table>

            </div>

          </div>
          <div className="tablePart1">
            <div className="tableTitle">施工工艺<span>{this.state.gradeInfo.sggyScore+'分'}</span></div>
            <div className="tableContent">
              <table>
                <tbody>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.sggyScore)>=4})}>
                  <td>4.0～5.0</td>
                  <td>一类工艺分级标准是家装行业内领先的施工工艺，比如：管线点到点排布、强弱电金属过桥、瓷质砖和全瓷砖使用瓷砖粘结剂铺贴、吊顶隔断使用轻钢龙骨、使用耐水腻子施工等。</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.sggyScore)>=3&&Number(this.state.gradeInfo.sggyScore)<4})}>
                  <td>3.0～4.0</td>
                  <td>二类工艺分级标准是市场上主流的常规施工工艺，比如：管线横平竖直排布、吊顶隔断使用木龙骨涂刷防火涂料、使用普通成品腻子施工等。</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.sggyScore)<3})}>
                  <td>3.0 以下</td>
                  <td>三类工艺分级标准是已经淘汰或正在逐步淘汰中的老旧、落后施工工艺，比如：电路随意排布、木龙骨不涂刷防火涂料、使用一代掺胶调和腻子施工等。根据红星美凯龙家装平台的合作商户招募要求，所有待合作商户应至少使用二类工艺分级标准的施工工艺，对仍在使用三类施工工艺的商户坚决不合作。</td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
          <div className="tablePart1">
            <div className="tableTitle">服务实力<span>{this.state.gradeInfo.fwslScore+'分'}</span></div>
            <div className="tableContent">
              <table>
                <tbody>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.fwslScore)>4.5})}>
                  <td>4.6～5.0</td>
                  <td>门店数>3、注册资金>1000万、设计师>30人、施工队>10、公司创立年限>10年、门店面积>300㎡、荣誉证书>15</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.fwslScore)>=4&&Number(this.state.gradeInfo.fwslScore)<4.6})}>
                  <td>4.0～4.5</td>
                  <td>门店数=3、注册资金>500万、设计师>20人、施工队>5、公司创立年限>5年、门店面积>200㎡、荣誉证书>10</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.fwslScore)>=3.5&&Number(this.state.gradeInfo.fwslScore)<4})}>
                  <td>3.5～3.9</td>
                  <td>门店数=2、注册资金>200万、设计师>15人、施工队>4、公司创立年限>3年、门店面积>150㎡、荣誉证书>8</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.fwslScore)>=3&&Number(this.state.gradeInfo.fwslScore)<3.5})}>
                  <td>3.0～3.4</td>
                  <td>门店数=1（最低0.7分）、注册资金>150万、设计师>10人、施工队>3、公司创立年限>2年、门店面积>100㎡、荣誉证书>5</td>
                </tr>
                <tr className={cs({"highlight":Number(this.state.gradeInfo.fwslScore)<3})}>
                  <td>3.0 以下</td>
                  <td>注册资金>100万、设计师>3人、施工队>1、公司创立年限>1年、门店面积>50㎡、荣誉证书>3</td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    );
  }
}


