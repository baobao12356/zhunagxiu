import React, { Component } from 'react';
import { List, InputItem, Picker, Toast } from 'antd-mobile';
import cs from 'classnames';
import Env from 'rs-browser';
import { createForm } from 'rc-form';
import QueryString from 'query-string';
import makeSupervisorModel from '../../models/makeSupervisorModel';
import Nav from '../../lib/components/nav';
import Host from '../../lib/scripts/config_host';
import './style.scss';
const ListItem = List.Item;
class Main extends Component {
  constructor(props) {
    super(props);
    const params = QueryString.parse(location.search);
    this.cityCode = params.cityCode ? params.cityCode : '310100';
    console.log('city', this.cityCode)
    this.state = {
      district: [],
      pickerValue: [this.cityCode],
    }
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    let district = [];
    makeSupervisorModel.getCity().then((data) => {
      district = data.dataMap.map((city) => ({ label: city.cityName, value: city.cityCode }));
      this.setState({
        district
      })
    });
  }

  handleSubmit() {
    console.log(this.inputName.props.value);
    console.log(this.inputPhone.props.value);
    console.log(this.state.pickerValue);
    const _this = this;
    const supervisorData = {
      "userName": this.inputName.props.value || '',
      "userMobile": this.inputPhone.props.value || '',
      "activityId": 29,
      "sourceFrom": "25009",
      "applicationTerminal": 2,
      "singupType": 1,
      "isGeneralActivity": "1",
      "cityCode": this.state.pickerValue[0] || '',
      "pageFrom": 'app-dsfjl-10001'
    }
    _this.props.f({
      id: '3421'
    });
    makeSupervisorModel.submit(supervisorData).then((data) => {
      if (data.code == 200) {
        window.location.href = `${Host.path}/mainapp/makeSuccess.html`;
      } else {
        Toast.info(data.message, 3);
      }
    })
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className={cs({ "pageWrap": true, "ios-top": Env.ios && Env.rsApp, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX, 'img-center': true })}>
        <Nav title='预约监理服务' shareIcon={false} />
        <div className='make-supervisor-form'>
          <List>
            <InputItem
              {...getFieldProps('autofocus')}
              clear
              placeholder="请填写你的名字"
              ref={el => this.inputName = el}
            >用户姓名</InputItem>
            <InputItem
              {...getFieldProps('money2', {
                normalize: (v, prev) => {
                  if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                    if (v === '.') {
                      return '0.';
                    }
                    return prev;
                  }
                  return v;
                },
              })}
              placeholder="请填写你的手机号码"
              ref={el => this.inputPhone = el}
              clear
              maxLength="11"
            >手机号码</InputItem>
            <Picker data={this.state.district} cols={1} {...getFieldProps('district')} className="forss" extra="请选择所在城市" value={this.state.pickerValue} onChange={v => this.setState({ pickerValue: v })}>
              <ListItem arrow="horizontal">所在城市</ListItem>
            </Picker>
          </List>
        </div>
        <div className="hint">温馨提示：红星美凯龙承诺您的装修信息不会外泄，监理服务在接到您的需求后尽快与您取得联系</div>
        <div className="btn-submit" onClick={this.handleSubmit}>确定</div>
      </div>
    )
  }
}

const MakeSupervisor = createForm()(Main);
export default MakeSupervisor;
