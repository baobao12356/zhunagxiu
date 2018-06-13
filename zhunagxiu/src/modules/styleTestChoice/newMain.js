/**
 * Created by feifei on 2017/9/17.
 */
import React, { Component } from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import './style1.scss';
import * as Configs from './choices/config'
import Nav from '../../lib/components/styleTestNav';
import Dialog from './choices/dialog/dialog'
import { StyleRegistration } from '../../models/StyleTest';
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../lib/scripts/bigData';
import LoopBanner from '../../lib/components/loopBanner';
import Host from '../../lib/scripts/config_host';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.checkStyle = this.checkStyle.bind(this)
    this.nextQuestion = this.nextQuestion.bind(this)
    this.prevQuestion = this.prevQuestion.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.setDialog = this.setDialog.bind(this)
    this.phoneMaxLength = this.phoneMaxLength.bind(this)
    this.albumShow = this.albumShow.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.hybridBridge = new HybridBridge(window);
    this.point = new BigData()
    this.iphoneX = 99
    this.state = {
      pageNo: 0,
      style_1: 99,
      style_2: 99,
      style_3: 99,
      style_4: 99,
      dialog: {
        msgs: "",
        isShow: false,
      },
      picNo: 0,
      noShowPic: true,
      currentPic: 0,
      pointData: "",
      iPhone_X: false
      // startX:"",
      // scrollNext:false,
      // scrollPrev:false,
      // isStoreScroll:true
    }

    this.cityCode = "310100"; // 设置默认上海
  }

  //点击选择风格
  checkStyle(type, style) {

    let tpyeParam
    if (type == 0) {
      tpyeParam = { style_1: style == this.state.style_1 ? 99 : style }
    } else if (type == 1) {
      tpyeParam = { style_2: style == this.state.style_2 ? 99 : style }
    } else if (type == 2) {
      tpyeParam = { style_3: style == this.state.style_3 ? 99 : style }
    } else if (type == 3) {
      tpyeParam = { style_4: style == this.state.style_4 ? 99 : style }
    }
    this.setState(tpyeParam)

  }

  //下一题
  nextQuestion() {
    let isChecked
    if (this.state.pageNo == 0) {
      isChecked = this.state.style_1
    } else if (this.state.pageNo == 1) {
      isChecked = this.state.style_2
    } else if (this.state.pageNo == 2) {
      isChecked = this.state.style_3
    }
    if (isChecked != 99) {
      this.setState({
        pageNo: this.state.pageNo * 1 + 1
      })
    } else {
      this.setDialog(Configs.MSGS[0])
    }
  }

  //呼出错误提示
  setDialog(msgs) {
    this.setState({
      dialog: {
        msgs: msgs,
        isShow: true,
      }
    })
    this.timer = setTimeout(() => {
      this.setState({
        dialog: {
          msgs: "",
          isShow: false,
        }
      })
    }, 2000)
  }

  //上一题
  prevQuestion() {
    this.setState({
      pageNo: this.state.pageNo * 1 - 1
    })

  }

  //最大可输出手机号长度
  phoneMaxLength(e) {
    if (e.target.value > 11) {
      e.target.value = e.target.value.slice(0, 11)
    }
  }

  //提交风格并验证提示
  updateForm() {
    let cityCode = '310100';
    if (this.state.style_4 != 99) {
      if (this.verfiyPhone(this.phone.value)) {

        const { style_1, style_2, style_3, style_4 } = this.state
        let style1 = this.transformParams(style_1),
          style2 = this.transformParams(style_2),
          style3 = this.transformParams(style_3),
          styleType = [style1, style2, style3]
        const style = this.checkRepeat(styleType)
        sessionStorage.setItem("style_1", (style_1 + 1) * 1)
        sessionStorage.setItem("style_2", (style_2 + 1) * 1)
        sessionStorage.setItem("style_3", (style_3 + 1) * 1)
        sessionStorage.setItem("style_4", style_4)
        sessionStorage.setItem("style", style)
        this.hybridBridge.hybrid('jzServiceCityCode', '').then((result) => {
          cityCode = result.cityCode;
          sessionStorage.setItem("cityCode", cityCode)
          this.styleRegistration(this.phone.value, style_4, cityCode, style)
        }).catch((error) => {
          console.log('获取cityCode失败');
          sessionStorage.setItem("cityCode", cityCode)
          this.styleRegistration(this.phone.value, style_4, cityCode, style)
        });




      }
    } else {
      this.setDialog(Configs.MSGS[2])
    }
  }

  //转化所选项
  transformParams(style) {

    if (style == 0) {
      style = 8
    } else if (style == 1) {
      style = 10
    } else if (style == 2) {
      style = 1
    } else if (style == 3) {
      style = 2
    } else if (style == 4) {
      style = 7
    } else if (style == 5) {
      style = 5
    }
    return style

  }

  //检测重复
  checkRepeat(arr) {
    let res
    if (arr[0] == arr[1]) {
      res = arr[0]
    } else if (arr[0] == arr[2]) {
      res = arr[0]
    } else if (arr[1] == arr[2]) {
      res = arr[1]
    } else {
      res = 10
    }
    return res

  }

  //验证手机
  verfiyPhone(phoneNum, errorMsg = "") {
    if (!phoneNum || !(/^1(3|4|5|7|8)\d{9}$/.test(phoneNum))) {
      this.setDialog(Configs.MSGS[1])
    } else {
      return true
    }
  }

  //注册报名
  styleRegistration(phoneNum, sex, cityCode, style) {
    var options = {
      "userName": "风格测验",
      "userMobile": phoneNum,
      "activityId": 29,
      "sourceFrom": 27009,
      "applicationTerminal": 2,
      "singupType": 1,
      "isGeneralActivity": "1",
      "pageFrom": "app-sjfgcs-10001",
      "userNote": sex == 0 ? "男士" : "女士",
      "cityCode": cityCode,
      "styleId": style,
    };
    if (!Env.rsApp) {/* 非主app页面时的渠道来源和页面标识 */
      options.sourceFrom = 25012;
      options.pageFrom = 'wap-sjfgcs-10001';
    }
    StyleRegistration(options).then((res) => {
      if (res.code == 200 && res.dataMap) {
        // window.location = `/styleResult.html`
        window.location = `${Host.path}/mainapp/styleResult.html`
      }
    });
  }

  componentWillMount() {
    var that = this
    this.hybridBridge.hybrid('FromNativeParms', '').then((result) => {
      if (!!result && result.iPhone_X != "undefined") {
        that.setState({
          iPhone_X: result.iPhone_X
        })
        // that.iphoneX = result.iPhone_X
      }
    })


    if (this.state.pageNo == 0) {
      this.setState({
        pointData: {
          channel: 'deco',
          type: 'page.decorationTest',
          title: 'page.decorationTest',
          page: '110.300.49.58.68.78.55',
          item: 'p_quitdecorationTest1'
        }
      })

    } else if (this.state.pageNo == 1) {

      this.setState({
        pointData: {
          channel: 'deco',
          type: 'page.decorationTest',
          title: 'page.decorationTest',
          page: '110.300.49.58.68.78.44',
          item: 'p_quitdecorationTest2'
        }
      })

    } else if (this.state.pageNo == 2) {
      this.setState({
        pointData: {
          channel: 'deco',
          type: 'page.decorationTest',
          title: 'page.decorationTest',
          page: '110.300.49.58.68.79.39',
          item: 'p_quitdecorationTest3'
        }
      })

    } else {
      this.setState({
        pointData: {
          channel: 'deco',
          type: 'page.decorationTest',
          title: 'page.decorationTest',
          page: '110.300.49.58.68.79.11',
          item: 'p_quitdecorationTest4'
        }
      })

    }
    // page, channel, type, title = '', id = this.id, domain = 'mmall.com'

  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  //回调获取当前图片index
  picNo(idx) {
    this.setState({
      picNo: idx
    })
  }

  //开启图片展示
  albumShow(idx) {
    this.setState({
      currentPic: idx,
      noShowPic: !this.state.noShowPic
    })
  }

  //点击手机输入埋点
  onFocus() {

  }



  render() {

    const choices = Configs.STYLE_IMG.map((val, idx) => {
      return (
        <article key={idx}
          className={cs({
            "choiceStyleBox": true,
            "nowPage": this.state.pageNo == idx,
            "isIphoneX": !!this.state.iPhone_X,
            "lastPage": this.state.pageNo == Configs.QUESTIONS.length - 1
          })}>
          <div className="cPage">
            <div>
              <span>{idx + 1}</span>
              <span>/{Configs.QUESTIONS.length}</span>
            </div>
          </div>
          <div className="question">
            {Configs.QUESTIONS[idx]}
          </div>
          <div className="choices">
            {
              val && val.map((vals, idxs) => {
                let typeState
                if (idx == 0) {
                  typeState = this.state.style_1
                } else if (idx == 1) {
                  typeState = this.state.style_2
                } else if (idx == 2) {
                  typeState = this.state.style_3
                } else if (idx == 3) {
                  typeState = this.state.style_4
                }
                return (
                  <div onClick={this.state.pageNo == Configs.QUESTIONS.length - 1 && this.checkStyle.bind(this, idx, idxs)} key={idxs} style={{ background: `url(${vals}.308x234.png!) no-repeat` }}>
                    {
                      this.state.pageNo != Configs.QUESTIONS.length - 1 &&
                      <div className="albumClose" onClick={this.albumShow.bind(this, idxs)}></div>
                    }
                    <span
                      className={idx == this.state.pageNo && typeState != 99 && idxs == typeState && "isChecked"}
                      onClick={this.checkStyle.bind(this, idx, idxs)}></span>
                  </div>
                )
              })
            }
          </div>
          {
            this.state.pageNo == Configs.QUESTIONS.length - 1 &&
            <div className="userPhone">
              <div className="message" >请输入您的手机号</div>
              <div className="inputPhone">
                <input type="number"
                  ref={(node) => { this.phone = node }}
                  placeholder="我们会将结果发送至您的手机"
                  onChange={this.phoneMaxLength}
                  onFocus={this.onFocus}
                />
              </div>
            </div>
          }
        </article>
      )
    })

    return (
      <div className={cs({ "styleDetailBox": true, 'ios-nav': (!!Env.rsApp && Env.ios), 'img-center': true })}>
        <Nav iPhone_X={this.state.iPhone_X} title='风格测验' shareIcon={false} hideNav={false} showTip={false} point={this.state.pointData} />
        <div onClick={this.albumShow.bind(this)}
          className={cs({ "album": true, "dis": this.state.noShowPic, "iphoneX": (this.iphoneX != 99 && this.iphoneX) ? true : false })}>

          <LoopBanner imgA={Configs.STYLE_IMG[this.state.pageNo]}
            currentIndex={this.state.currentPic}
            handleFun={this.picNo.bind(this)}
            noAutoPlay={true}
            noMark={true}
            speed={100}
            initialHeight="280" />
          <div className="albumPage">
            <span>{this.state.picNo + 1}</span>
            <span>/6</span>
          </div>
        </div>

        {choices}
        <div className="choiceBtns ">
          {
            this.state.pageNo != 0 &&
            <div className={Env.ios ? "prevBtn" : "prevBtn android"} onClick={this.prevQuestion}>上一题</div>
          }
          {
            this.state.pageNo != 0 && <div className="middle"></div>
          }
          {
            this.state.pageNo == Configs.QUESTIONS.length - 1 ?
              <div className={Env.ios ? "nextBtn" : "nextBtn android"} onClick={this.updateForm}>提交</div>
              :
              <div className={Env.ios ? "nextBtn" : "nextBtn android"} onClick={this.nextQuestion}>下一题</div>
          }
        </div>
        <Dialog {...this.state.dialog} />
      </div>
    )
  }

}
