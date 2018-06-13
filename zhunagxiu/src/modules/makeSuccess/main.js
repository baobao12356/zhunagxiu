import React, { Component } from 'react';
import Nav from '../../lib/components/nav';
import Host from '../../lib/scripts/config_host';
import cs from 'classnames';
import Env from 'rs-browser';
import './style.scss';

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.goSuperviosrDetail = this.goSuperviosrDetail.bind(this);
  }

  goSuperviosrDetail() {
    window.location.href = `${Host.path}/mainapp/thirdSupervision.html`;
  }

  getRelationTime() {
    var time = new Date();
    time.setDate(time.getDate() + 1);
    console.log(new Date());
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hour = time.getHours()
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const relatinoTime = `${month}月${day}日 ${hour}:${minutes}`;
    return relatinoTime;
  }

  render() {
    console.log('time', this.getRelationTime())
    return (
      <div className={cs({ "pageWrap": true, "ios-top": Env.ios && Env.rsApp, 'ios-iPhoneX': Env.rsApp && Env.ios && Env.iPhoneX, 'img-center': true })}>
        <Nav title='预约监理服务' shareIcon={false} />
        <div className="wrapper">
          <div className="icon"></div>
          <div className="text">
            <div className="success-text">预约成功</div>
            <div className="relation-text">预计客服将于<span className="time">{this.getRelationTime()}</span>前电话联系您
            请保持电话畅通</div>
          </div>
          <div className="btn-detail" onClick={this.goSuperviosrDetail}>知道了</div>
        </div>
      </div>
    )
  }
}
