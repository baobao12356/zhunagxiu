import React from 'react';
import Env from 'rs-browser';
import cs from 'classnames';
import queryString from 'query-string';
import Swiper from 'swiper';
//import { Swiper } from '../../lib/scripts/swiper/swiper-3.4.2.min.js';
import { Toast } from 'antd-mobile';
import Nav from '../../lib/components/nav';
import Host from '../../lib/scripts/config_host';
import GetNativeInfo from '../../lib/scripts/getNativeInfo';
import GetUserInfo from '../../lib/scripts/getUserInfo';
import { supervisionOrder, cityList, companyList } from '../../models/thirdSupervisionModel';
import './style.scss';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    // const params = queryString.parse(location.search);
    // this.cityCode = params.cityCode;
    //this.cityCode = '310100';
    this.companySwiper = null;
    this.fetchCityList = this.fetchCityList.bind(this);
    this.fetchCompanyList = this.fetchCompanyList.bind(this);
    this.orderServer = this.orderServer.bind(this);
    this.controlPhone = this.controlPhone.bind(this);
    this.displayCompany = this.displayCompany.bind(this);
    this.forwardCompanyDetail = this.forwardCompanyDetail.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.getCurrentCityCode = this.getCurrentCityCode.bind(this);
    this.chooseCity = this.chooseCity.bind(this);
    this.getUserPhone = this.getUserPhone.bind(this);
    this.state = {
      cityList: [],
      companyList: [],
      cityCode: '310100',
      //phone: '12'
    }
  }

  componentDidMount() {
    this.fetchCityList();
    if (Env.rsApp) {
      this.getCurrentCityCode();
      this.getUserPhone();
    } else {
      this.fetchCompanyList(this.state.cityCode);
    }
  }
  componentDidUpdate() {
    this.companySwiper && this.companySwiper.destroy();
    if (this.state.companyList.length > 0) {
      this.companySwiper = new Swiper('.companySwiper', {
        slidesPerView: 'auto',
        freeMode: true,
      });
      // if(this.companySwiper) {
      //   this.companySwiper.update();
      // } else {
      //   this.companySwiper = new Swiper('.companySwiper', {
      //     slidesPerView: 'auto',
      //     freeMode: true,
      //   });
      // }
    }
  }

  //获取app中定位城市
  getCurrentCityCode() {
    GetNativeInfo().then((nativeInfoRes) => {
      console.log(nativeInfoRes, 'native交互,.....');
      //this.cityCode = nativeInfoRes.ShowCityId;
      this.setState({
        cityCode: nativeInfoRes.ShowCityId
      });
      this.fetchCompanyList(this.state.cityCode);
    }).catch((e) => {
      console.log(e);
    });
  }

  //获取app中登录用户手机号
  getUserPhone() {
    GetUserInfo().then((res) => {
      this.phone.value = res.mobile;
    });
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
  //获取公司列表
  fetchCompanyList(cityCode) {
    companyList(cityCode).then((res) => {
      if (res.code == 200 && res.dataMap) {
        this.setState({
          companyList: res.dataMap.records
        }, () => {
          // if (!this.companySwiper) {
          //   this.companySwiper = new Swiper('.companySwiper', {
          //     slidesPerView: 'auto',
          //     freeMode: true,
          //   });
          // }
        });
      } else {
        this.setState({
          companyList: []
        });
      }
    });
  }
  chooseCity() {
    const cityCode = this.city.value;
    this.fetchCompanyList(cityCode);
  }
  //点击预约
  orderServer() {
    this.props.f({
      id: '3283'
    });
    const name = this.name.value;
    const phone = this.phone.value;
    const cityCode = this.city.value;
    const nameCheck = /^[a-zA-Z\u4e00-\u9fa5]+$/; //中文，英文
    const phoneCheck = /^1\d{10}$/;

    if (!name) {
      Toast.info('请输入您的称呼', 1);
    } else if (!nameCheck.test(name)) {
      Toast.info('请输入有效的姓名(中文，英文)', 1);
    } else if (!phone || !phoneCheck.test(phone)) {
      Toast.info('请输入有效的手机号码', 1);
    } else { //调取预约接口
      supervisionOrder(name, phone, cityCode).then((res) => {
        console.log(res);
        if (res.code == 200) { //预约成功,跳到预约成功页面
          window.location = `${Host.path}/mainapp/makeSuccess.html`;
        } else {
          Toast.info(res.message, 1);
        }
      });
    }
  }
  controlPhone(event) {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
  }
  forwardCompanyDetail(id) {
    window.location = `${Host.path}/mainapp/supervisionDetail.html?companyId=${id}&cityCode=${this.city.value}&back=h5&__open=1`;
  }

  //第三方监理公司
  displayCompany() {
    const { companyList } = this.state;
    if (companyList.length > 0) { //有监理公司
      const companyItem = companyList.map((item, index) => {
        return (
          <div className="companyItem swiper-slide">
            <div className="companyLogo"><img src={item.logo} alt="" /></div>
            <div className="companyInfo">
              <div className="companyTitle">{item.name}</div>
              <div className="companyDesc">{item.concept}</div>
              <div className="lookCompany" onClick={() => this.forwardCompanyDetail(item.id)}>查看</div>
            </div>
          </div>
        );
      });
      return (
        <div className="section">
          <div className="sectionTitle"></div>
          <div className="sectionContent companySwiper">
            <div className="companyList swiper-wrapper">
              {companyItem}
            </div>
          </div>
        </div>
      )
    } else { //没有监理公司
      return (
        <div className="section">
          <div className="sectionContent noCompany"></div>
        </div>
      );
    }
  }
  //回到顶部
  scrollToTop() {
    this.props.f({
      id: '3422'
    });
    window.scrollTo(0, 0);
  }
  render() {
    const { cityList, companyList } = this.state;
    //console.log('城市列表', cityList);
    //console.log('公司列表', companyList);
    const cityListData = cityList.length > 0 && cityList.map((item, index) => {
      if (item.cityCode == this.state.cityCode) {
        return (
          <option value={item.cityCode} selected='selected'>{item.cityName}</option>
        );
      } else {
        return (
          <option value={item.cityCode}>{item.cityName}</option>
        );
      }

    })
    return (
      <div className={cs({ "pageWrap": true, "ios-top": Env.ios && Env.rsApp, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX, 'img-center': true })}>
        <Nav title='第三方监理服务' shareIcon={false} />
        <div className="bannerBox"></div>
        <div className="orderBox">
          <div className="orderTitle">
            <p className="mainTitle">预约第三方监理服务</p>
            <p className="subTitle">红星美凯龙一站式解决方案，全程无忧</p>
          </div>
          <div className="form">
            <div className="orderName"><input type="text" placeholder="您的称呼" maxLength="10" ref={(name) => { this.name = name; }} /></div>
            <div className="orderPhone"><input type="text" placeholder="手机号码" maxLength="11" onKeyUp={this.controlPhone} ref={(phone) => { this.phone = phone; }} /></div>
            <div className="orderCity">
              <select ref={(city) => { this.city = city; }} onChange={this.chooseCity}>
                {cityListData}
              </select>
              <div className="triple"></div>
            </div>
            <div className="orderButton" onClick={this.orderServer}>立即预约</div>
          </div>
          <div className="orderEnsure">红星美凯龙承诺将严格保护您的隐私</div>
        </div>
        <div className="sectionOne"></div>
        {this.displayCompany()}
        <div className="sectionTwo"></div>
        <div className="button" onClick={this.scrollToTop}>立即预约</div>
      </div>
    );
  }
}
