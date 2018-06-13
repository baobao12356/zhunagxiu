import React from 'react';
import cs from 'classnames';
import './style.scss';
import Nav from '../../lib/components/styleTestNav';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import {StyleRegistration} from '../../models/StyleTest';
import {Toast} from 'antd-mobile';
import Host from '../../lib/scripts/config_host';
import BigData from '../../lib/scripts/bigData';
import HybridUserInfo from 'rs-hybrid-user-info';
import HybridBridge from 'rs-hybrid-bridge';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webPadding: false,
      cityCode:'310100'
    }
    this.point = new BigData();

  }

  componentDidMount() {
    var hybridBridge = new HybridBridge(window);
    hybridBridge.hybrid('jzServiceCityCode', '').then((result)=> {
      if(String(result.cityCode).indexOf('00')>-1){
        this.setState({
          cityCode:result.cityCode
        })
      }
    }).catch((error)=> {
      console.log('获取cityCode失败');
    });

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

    var hybridUserInfo = new HybridUserInfo();
    hybridUserInfo.getUserInfo().then((result)=> {
      console.log('用户已登陆');
      let mobile = result.mobile;

      document.getElementById("phone").value = mobile;

    }).catch((error)=> {
      console.log('用户未登录')
    });
  }

  checkData(){
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    var nameRegexp = /^[\u4e00-\u9fa5]{2,10}$/;
    var nameRegexp1 = /^[a-zA-Z]{2,20}$/;
    var phoneRegexp = /^1(3[0-9]|4[579]|5[0-35-9]|7[0-35-8]|8[0-9])[\d]{8}$/;
    if(name.length < 2){
      Toast.info('姓名最少两位字符',1);
      return false;
    }
    if(!nameRegexp.test(name) && !nameRegexp1.test(name)){
      Toast.info('请输入有效的姓名(英文,中文)', 1);
      return false;
    }
    if (!phone || !phoneRegexp.test(phone)) {
      Toast.info('号码格式错误', 1);
      return false;
    }

    return true;
  }

  checkPhone(){
    let phone = document.getElementById("phone").value;
    var phoneRegexp = /^1(3[0-9]|4[579]|5[0-35-9]|7[0-35-8]|8[0-9])[\d]{8}$/;

    document.getElementById("phone").value = phone.replace(/[^\d]/g,"");

    if(phone.length > 11){
      document.getElementById("phone").value = phone.substring(0,11);
    }


  }

  styleRegistration(){
    this.point.f('110.300.49.58.68.79.43','deco','page.inputtell','page.inputtell','p_inputtell');
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    if(!!this.checkData()){
      var options ={
        "userName": name,
        "userMobile": phone,
        "activityId": 8,
        "sourceFrom": 25009,
        "applicationTerminal": 2,
        "singupType": 1,
        "isGeneralActivity":"1",
        "pageFrom": "app-sjfgcs-10001",
        "cityCode":this.state.cityCode
      };
      StyleRegistration(options).then((res) => {
        console.log(res);
        if (res.code == 200 && res.dataMap) {
          this.jumpToPage("/styleResult.html");
        }
      });
    }
  }

  jumpToPage(target){
    window.location = Host.path +'/mainapp'+ target;
  }

  render(){
    let { records } = this.state;

    let pointData = {
      page: "110.300.49.58.68.79.90",
      channel: "deco",
      type: "page.decorationTest",
      title: "page.decorationTest",
      item: "p_quitdecorationTest5",
    };

    return(
      <div className={cs({"styleDetailBox":true,'ios-nav': Env.rsApp && Env.ios, 'img-center': true})}>
        <Nav title="风格测验" shareIcon={false} showTip={false} hideNav={false} point={pointData}/>
        <div className="main">
          <input type="text" placeholder="您的称呼" id="name" autocomplete="off" maxLength="10"/>
          <input type="text" placeholder="手机号码" id="phone" onInput={this.checkPhone.bind(this)} autocomplete="off"/>
          <input type="button" name="submit" value="查看结果" onClick={this.styleRegistration.bind(this)}/>
        </div>
      </div>
    )
  }
}

