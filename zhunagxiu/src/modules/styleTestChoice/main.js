/**
 * Created by feifei on 2017/9/17.
 */
import React,{Component} from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import './style.scss';
import QueryString from 'query-string';
import Age from './choices/age';
import Clothes from './choices/clothes';
import HouseType from './choices/houseType';
import Nav from '../../lib/components/styleTestNav';
import {StyleInfo} from '../../models/styleTestChoiceModel';



export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shadowPagePercentage:'0%',
      styleInfo:{},
      houseTypeHide:true,
      clothesHide:true,
      pageData:'110.300.49.58.68.78.55',
      itemData:'p_quitdecorationTest1',
      huoseWord:true,
      clothseWord:true
    }

    //this.point = new BigDate();

  }

  componentDidMount() {
    StyleInfo().then((res) => {
      console.log(res);
      if (res.code == 200 && res.dataMap) {
        this.setState({
          styleInfo:res.dataMap
        })
      }else{
        console.log(res.message)
      }
    });
  }
  //控制户型  穿衣风格的显示隐藏
  changeState(houseParam,clothesParam){
    if(houseParam == 1){
      this.setState({
        houseTypeHide:false,
        huoseWord:false
      })
    }else{
      this.setState({
        houseTypeHide:true,
        huoseWord:true
      })
    }
    if(clothesParam == 1){
      this.setState({
        clothesHide:false,
        clothseWord:false
      })
    }else{
      this.setState({
        clothesHide:true,
        clothseWord:true
      })
    }
  }

  bigData(pageData,itemData){
    this.setState({
      pageData:pageData,
      itemData:itemData,
    })
  }


  render() {
    let pointData = {
      page:this.state.pageData,
      channel:'deco',
      type:'page.decorationTest',
      title:'page.decorationTest',
      item:this.state.itemData
    }

    return (

      <div className={cs({"styleDetailBox":true,'ios-nav': Env.ios})}>
        <Nav title='风格测验' shareIcon={false} hideNav={false} showTip={false} point={pointData}/>
        <Age agePercentage={this.state.styleInfo.ageList} changeState={this.changeState.bind(this)} bigData={this.bigData.bind(this)}/>
        <HouseType huoseWord={this.state.huoseWord} houseTypeHide={this.state.houseTypeHide} housePercentage={this.state.styleInfo.houseList} changeState={this.changeState.bind(this)} bigData={this.bigData.bind(this)}/>
        <Clothes clothseWord={this.state.clothseWord} clothesHide={this.state.clothesHide} clothesPercentage={this.state.styleInfo.styleList}/>
      </div>
    )
  }

}
