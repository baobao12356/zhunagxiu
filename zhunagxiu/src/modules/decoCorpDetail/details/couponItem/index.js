import React from 'react';
import cs from 'classnames';
import { Toast } from 'antd-mobile';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import { isLogin, getSessionId } from '../../../../core/AuthUtil';
import Host from '../../../../lib/scripts/config_host';
import Login from '../../../../lib/scripts/login';
import dateFormat from '../../../../lib/scripts/dateFormat';
import CorpDetailModel from '../../../../models/CorpDetailModel';
import './style.scss';

export default class CouopnItem extends React.Component {
  constructor(props) {
    super(props);
    dateFormat.dateFormat();
    this.displayCouponName = this.displayCouponName.bind(this);
    this.displayCouponStatus = this.displayCouponStatus.bind(this);
    this.receiveCoupon = this.receiveCoupon.bind(this);
    this.state = {
      couponStatus: this.props.couponItem.takeSatus,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      couponStatus: nextProps.couponItem.takeSatus,
    })
  }
  displayCouponName(couponInfo) {
    const { couponTypeId, title } = couponInfo;
    //51.无门槛现金抵用券 52.满减券 53.叠加满减券 54.阶梯满减券 55.折扣券 56.赠品券 57.礼品券
    if (couponTypeId == 57 || couponTypeId == 56) { //礼品赠品券
      return <div className="couponName"><span className="couponTitle">{title}</span></div>
    } else { //家装券暂时只开通礼品券类型.........
      return <div className="couponName"><span className="couponTitle">{title}</span></div>
    }
  }
  displayCouponStatus(couponInfo) {
    //console.log('ffff',this.props);
    const { id } = couponInfo;
    //console.log('lllllllllllllllll', couponInfo);
    const { couponStatus } = this.state;
    //couponStatus 0 未开始 1可领取 2已领取 3领完
    if (couponStatus == 0) { //未开始，暂时不会返回未开始券
      return <span className="">未开始</span>
    } else if (couponStatus == 1) { //暂时没有可领多次券，直接显示立即领取
      return <span className="rightText" onClick={() => { this.receiveCoupon(id, this.props.couponIndex); }}>立即领取</span>
    } else if (couponStatus == 2) {
      return <span className="getType gettedCoupon"></span>
    } else if (couponStatus == 3) {
      return <span className="getType getEndCoupon"></span>
    }
  }

  //领取优惠券
  receiveCoupon(couponId, index) {
    //console.log(index);
    this.props.f&&this.props.f({
      id: '3417',
      p_action_id:`couponId=${couponId}`
    });
    if(Env.rsApp) {
      if (isLogin()) {
        //const sessionId = '7fe2b9eb-1fdc-425a-84e9-e1b538365b83';
        const sessionId = getSessionId();
        CorpDetailModel.ReceiveCoupon(couponId, sessionId).then((data) => {
          let tempStatus = 1;
          if (data.code == 200 && data.dataMap) {
            Toast.info('领取成功', 1);
            if (data.dataMap.remainingTimes == 0) {
              this.setState({
                couponStatus: 2
              });
              tempStatus = 2;
            }
            //console.log('tempStatus', tempStatus);
            onfire.fire('changeCouponStatus', {
              status: tempStatus,
              index: index,
              //perPersonRemainingCount: this.state.remainingTimes
            });
          } else {
            Toast.info(data.message, 1);
          }
        })
      } else {
        console.log('未登录');
        Login();
      }
    } else { //分享出去的页面领取跳下载页
      if (Host.path.indexOf('uat1') > -1) {
        location.href = `http://mkl.uat1.rs.com/QR_code/?version=30015&channel=30002&share=app&__open=1`;
      } else if (Host.path.indexOf('mklmall') > -1) {
        location.href = `https://mkl.mklmall.com/QR_code/?version=30015&channel=30002&share=app&__open=1`;
      } else if (Host.path.indexOf('mmall') > -1) {
        location.href = `https://mkl.mmall.com/QR_code/?version=30015&channel=30002&share=app&__open=1`;
      }
    }
  }

  render() {
    const { couponStatus } = this.state;
    const { couponItem } = this.props;
    const { couponInfo } = couponItem;
    //console.log('oooooooooooooooooo', couponInfo);
    const { condition, startTime, endTime, status } = couponInfo;
    return (
      <div className={cs({ "couponItem": true, "get": couponStatus == 1, "getted": couponStatus == 2, "getEnd": couponStatus == 3 })}>
        <div className="itemLeft">
          {this.displayCouponName(couponInfo)}
          {/*<div className="couponName"><span className="money">8.5</span><span className="disType">折</span></div>*/}
          <div className="couponCondition">{condition}</div>
          <div className="coupontime">有效期:{new Date(startTime).Format('yyyy.MM.dd')}-{new Date(endTime).Format('yyyy.MM.dd')}</div>
        </div>
        <div className="itemRight">
          {this.displayCouponStatus(couponInfo)}
        </div>
      </div>
    )
  }
}
