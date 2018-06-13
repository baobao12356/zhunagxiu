import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import { Toast } from 'antd-mobile';
import Host from '../../scripts/config_host';
import GetNativeInfo from '../../scripts/getNativeInfo';
import GetUserInfo from '../../scripts/getUserInfo';
import { cityList } from '../../../models/thirdSupervisionModel';
import { consultOrder } from '../../../models/designConsultResultModel';
import './style.scss';

export default class appointBox extends React.Component {
  constructor(props) {
    super(props);
    this.cityCode = '310100';
    this.fetchCityList = this.fetchCityList.bind(this);
    this.getCurrentCityCode = this.getCurrentCityCode.bind(this);
    this.getUserPhone = this.getUserPhone.bind(this);
    this.orderServer = this.orderServer.bind(this);
    this.state = {
      cityList: []
    }
  }

  componentDidMount() {
    if (Env.rsApp) {
      this.getCurrentCityCode();
      this.getUserPhone();
    }

    this.fetchCityList();
  }

  //获取城市列表
  fetchCityList() {
    cityList().then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          cityList: res.dataMap
        });
      }
    });
  }
  //获取app中定位城市
  getCurrentCityCode() {
    GetNativeInfo().then((nativeInfoRes) => {
      //console.log(nativeInfoRes, 'native交互,.....');
      this.cityCode = nativeInfoRes.ShowCityId;
      console.log('city', this.cityCode);
    }).catch((e) => {
      console.log(e);
    });
  }
  //获取app中登录用户手机号
  getUserPhone() {
    GetUserInfo().then((res) => {
      this.phone.value = res.mobile;
    })
  }

  //预约
  orderServer() {
    const { selectedData, source } = this.props;

    //source: 4_27011_app-zxrj-10001 来源_渠道号_二级渠道
    //console.log('source', source);
    const sourceParse = source.split('_');
    const sourceFrom = sourceParse[1];
    let pageFrom = sourceParse[2];
    //console.log('sourceParse', sourceParse[0],sourceParse[1], sourceParse[2]);

    let name = this.name.value;
    const phone = this.phone.value;
    const cityCode = this.city.value;
    const area = this.area.value;
    const nameCheck = /^[a-zA-Z\u4e00-\u9fa5]+$/; //中文，英文
    const areaCheck = /^[0-9]*$/; //数字
    const phoneCheck = /^1\d{10}$/;
    const fromTitle = localStorage.getItem('fromTitle');
    const fromTags = localStorage.getItem('fromTags') || '';
    let visitDate = '';
    let styleNames = '';
    let clientBudget = '';
    let sexName = '';
    if (selectedData) {
      const { styleValue, timeValue, moneyValue, sexValue } = selectedData
      styleNames = styleValue;
      clientBudget = moneyValue;
      visitDate = timeValue;
      name = name + sexValue;
      pageFrom = pageFrom + '-a';
    } else {
      pageFrom = pageFrom + '-b';
    }
    //console.log('pageFrom', pageFrom);

    if (!name) {
      Toast.info('请输入称呼', 1);
    } else if (!nameCheck.test(name)) {
      Toast.info('请输入有效的姓名(中文，英文)', 1);
    } else if (!area || !areaCheck.test(area)) {
      Toast.info('请输入有效的房屋面积', 1);
    } else if (!phone || !phoneCheck.test(phone)) {
      Toast.info('请输入有效的手机号码', 1);
    } else { //调取预约接口

      //alert(name);
      consultOrder({
        userName: name,
        userMobile: phone,
        cityCode: cityCode,
        houseArea: area,
        styleNames: styleNames,
        clientBudget: clientBudget,
        visitDate: visitDate,
        fromTags: fromTags,
        fromTitle: fromTitle,
        sourceFrom: sourceFrom,
        pageFrom: pageFrom
      }).then((res) => {
        console.log(res);
        if (res.code == 200) { //预约成功,跳到预约成功页面
          window.location = `${Host.path}/mainapp/designConsultResult.html?source=${sourceParse[0]}&back=h5&__open=1`;
          //window.location = `http://localhost:9000/designConsultResult.html?source=${sourceParse[0]}&back=h5&__open=1`;
        } else {
          Toast.info(res.message, 1);
        }
      });
    }

  }
  render() {
    const { cityList } = this.state;
    const cityListData = cityList.length > 0 && cityList.map((item, index) => {
      if (item.cityCode == this.cityCode) {
        return (
          <option value={item.cityCode} selected='selected' key={index}>{item.cityName}</option>
        );
      } else {
        return (
          <option value={item.cityCode} key={index}>{item.cityName}</option>
        );
      }
    })
    return (
      <div className="askBox">
        <div className="infoBox">
          <div className="infoTitle">新房所在城市</div>
          <div className="infoContent">
            <select ref={(city) => { this.city = city; }}>
              {cityListData}
            </select>
            <div className="triple"></div>
          </div>
        </div>
        <div className="infoBox">
          <div className="infoTitle">您的称呼</div>
          <div className="infoContent">
            <input placeholder="请输入您的称呼" maxLength="10" ref={(name) => { this.name = name; }} />
          </div>
        </div>
        <div className="infoBox">
          <div className="infoTitle">您的房屋面积</div>
          <div className="infoContent">
            <input type="tel" placeholder="请输入您的房屋面积" maxLength="6" ref={(area) => { this.area = area; }} />
            <div className="areaUnit">㎡</div>
          </div>
        </div>
        <div className="infoBox">
          <div className="infoTitle">您的电话号码</div>
          <div className="infoContent"><input type="tel" placeholder="请输入您的电话号码" maxLength="11" ref={(phone) => { this.phone = phone; }} /></div>
        </div>
        <div className="btnBox">
          <div className="confirmBtn" onClick={this.orderServer}>确定</div>
          <div className="companyInfo">红星美凯龙承诺将严格保护您的隐私</div>
        </div>
      </div>


    );
  }
}
