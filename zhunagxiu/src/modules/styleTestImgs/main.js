/**
 * Created by xujun.yuan on 2017/9/16.
 */
import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import './style.scss';
import Data from './data';
import Nav from '../../lib/components/styleTestNav';


export default class StyleTest extends React.Component {
  constructor(props) {
    super(props);
    //style = ["禅意日式","活力北欧","现代简约","现代中式","休闲美式"];
    this.state = {
      key:0,
      imgKey:0,
      position:true,
      disabled:false
    };
    this.styleImgArr = Data.shuffle(Data.styleImgArr);
    this.styleTitleArr = Data.styleTitleArr;
    sessionStorage.setItem('sumObj','[0,0,0,0,0]');
    this.StyleLike = this.StyleLike.bind(this);
    this.StyleDislike = this.StyleDislike.bind(this);
  }

  StyleDislike(){
    let topImg = document.getElementById('styleImgtrue');
    let backImg = document.getElementById('styleImgfalse');
    let key = this.state.key;
    let _this = this;

    if(!this.getIos8()){
      this.fadeOut(topImg,backImg,500);
    }else{
      if(key <14) {
        this.setState({
          key: key + 1,
          imgKey: key + 1
        })
      }else{
        _this.getResultStyle()
      }
    }
  }

  StyleLike(){
    let topImg = document.getElementById('styleImgtrue');
    let backImg = document.getElementById('styleImgfalse');
    let key = this.state.key;
    let _this = this;

    let nowStyle = this.styleImgArr[key].style;
    let sumObj = JSON.parse(sessionStorage.getItem('sumObj'));
    sumObj[nowStyle]++;
    console.log(JSON.stringify(sumObj));
    sessionStorage.setItem('sumObj',JSON.stringify(sumObj));

    if(!_this.getIos8()){
      this.fadeOut(topImg,backImg,500);
    }else{
      if(key <14) {
        this.setState({
          key: key + 1,
          imgKey: key + 1
        })
      }else{
        _this.getResultStyle()
      }
    }
  }

  getResultStyle(){
    let styleId = 2;
    let sumObj = JSON.parse(sessionStorage.getItem('sumObj'));

    if(this.getIos8()){
      styleId = sumObj.indexOf(Math.max.apply(Math, sumObj));   //ios8及以下，判断第一个最大值所在的位置
    }else if(Array.from(new Set(sumObj)) === sumObj){   //如果数组内没有重复值
      styleId = sumObj.indexOf(Math.max.apply(Math, sumObj));   //最大值所在的位置
    }else{
      let oldSumObj = [1,4,5,2,3];
      let maxChoice = Math.max.apply(Math, sumObj);
      let resultObj = [];
      for(let i = 0; i < 5; i++) {
        if(sumObj[i]<maxChoice){
          resultObj[i] = 0;    //比最大值小的元素全部重设为0
        }else{
          resultObj[i] = sumObj[i] + oldSumObj[i];    //是最大值的元素加上旧数据
        }
      }
      styleId = resultObj.indexOf(Math.max.apply(Math, resultObj)) ;   //重新求得最大值所在的位置
    }
    sessionStorage.setItem('styleId',styleId);
    if(!this.getIos8()) {
        window.location = '/mainapp/styleRegistrationDetail.html'
    }else{
      window.location = '/mainapp/styleRegistrationDetail.html'
    }
  }

  fadeOut(el,elb,time){
    let _this = this;
    let key = _this.state.key;
    elb.style.opacity = '1';
    el.style.opacity = '1';
    if(key<14){
      _this.setState({
        key:key+1,
        disabled:"disabled"
      });
    }else{
      _this.setState({
        key:key+1,
        disabled:false
      });
      _this.getResultStyle()

    }

    //if(key >= 14){
    //  alert(111+key)
    //}
    var t = setInterval(function(){
      if(el.style.opacity > 0){
        el.style.opacity = parseFloat(el.style.opacity)-0.01;
      }else{
        clearInterval(t);
        _this.changeImg(el,elb,time/2)

      }
    },time/200);
  }

  changeImg(el,elb,time){
    let _this = this;
    let key = _this.state.key;
    let imgKey = _this.state.imgKey;
    let position = _this.state.position;
    setTimeout(function(){
      elb.style.zIndex = '5';
      el.style.zIndex = '1';
      if(key <14) {
        _this.setState({
          imgKey: imgKey + 1,
          position: !position,
          disabled:false
        });
      }else{
        if(key == 14) {
          _this.setState({
            disabled:false
          });
        }
      }
    },time);
  }



  getIos8() {
    // 判断是否 iPhone 或者 iPod
    if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
      // 判断系统版本号是否小于 8，下面条件成立就表示<=8否则>8
      return Boolean(navigator.userAgent.match(/OS [3-8]_\d[_\d]* like Mac OS X/i));
    } else {
      return false;
    }
  }

  render() {

    let _this =this;
    let key = _this.state.key;
    let imgKey = _this.state.imgKey;
    let nowStyle = _this.styleImgArr[key].style;
    let position = _this.state.position;
    let pointData = {
      page: "110.300.49.58.68.79.11",
      channel: "deco",
      type: "page.decorationTest",
      title: "page.decorationTest",
      item: "p_quitdecorationTest4"
    };

    //alert('key:'+key+';imgKey:'+imgKey)
    return (
      <div className="img-center">
        <Nav title='风格测试' shareIcon={false} hideNav={false} showTip={false} point={pointData}/>
        <div className="styleImgs">
          <div className="styleContent">
            <div className="styleImg">
              <img src={this.styleImgArr[imgKey+Number(!position)].imgSrc} id={"styleImg"+position}/>
              <img src={imgKey<14?this.styleImgArr[imgKey+Number(position)].imgSrc:this.styleImgArr[imgKey+Number(!position)].imgSrc} id={"styleImg"+!position}/>
            </div>
            <div className="styleChoice">
              <div className="styleChoiceBox">
                <button className="styleDislike" onClick={this.StyleDislike.bind(this)} disabled={this.state.disabled}></button>
                <button className="styleLike" onClick={this.StyleLike.bind(this)} disabled={this.state.disabled}></button>
              </div>
            </div>
          </div>
          <div className="styleCount">{key+1+"/15"}</div>
        </div>
      </div>
    )
  }
}

//<img className="styleTitle" src={this.styleTitleArr[nowStyle]}/>

