import React, { PureComponent } from 'react';
import { Steps, Toast } from 'antd-mobile';
// import { Steps } from 'antd-mobile';
import { connect } from 'react-redux';
import queryString from 'query-string';
import cs from 'classnames';
import { Header } from 'rs-react-components';
import Env from 'rs-browser';
import 'antd/dist/antd.css';
import { decoOrderFetchDetail } from '../../../actions';

import './style.scss';

const Step = Steps.Step;

const params = queryString.parse(location.search);
const { id } = params;
class DecoOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    Toast.loading('loading...', 100);
    this.decoOrderFetchDetail();
  }

  async decoOrderFetchDetail() {
    const { dispatch } = this.props;
    const action = await decoOrderFetchDetail(id);
    const { payload = {} } = action;
    const { serialNumber } = payload;
    if (serialNumber) {
      Toast.hide();
    }
    dispatch(action);
  }

  render() {
    const outerClassName = cs({
      'deco-order-detail': true,
      'app-wrap': true,
      'ios-nav': Env.rsApp && Env.ios,
      'iPhone-x': Env.rsApp && Env.ios && Env.iPhoneX
    });
    const { decoOrder } = this.props;
    const stepEle = !!decoOrder && !!decoOrder.items && decoOrder.items.map((item) => {
      const title = item.productName + item.paymentStatusDesc;
      const status = item.paymentStatus === 1 ? 'finish' : 'await';//paymentStatus  1 待付款 2 已付款
      const random = Math.random();
      const description = `￥${item.salePrice}`;
      return (
        <Step key={random} title={title} description={description} status={status} />
      );
    });
    const receiveEle = decoOrder.lastPaymentDate ? (
      <div className="receive-date">收款时间：{decoOrder.lastPaymentDate}</div>
    ) : null;
    const hintElem = decoOrder.hint ? (
      <div className="banner">
        <div className="banner-opacity1">
          <div className="banner-todo">{decoOrder.hint}</div>
          <div className="banner-opacity2">
            <div className="banner-prepay">{decoOrder.hintDetail}</div>
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div className="deco-order">
        <Header className="header">
          <div>装修订单</div>
        </Header>
        <div className={outerClassName}>
          {hintElem}
          <div className="deco-order-steps">
            <Steps>
              {stepEle}
            </Steps>
          </div>
          <div className="amount-div">
            <div className="amount-one">
              <div className="amount-o-left">装修合同金额</div>
              <div className="amount-o-right">￥{decoOrder.contractTotalAmount}</div>
            </div>
            <div className="amount-one">
              <div className="amount-o-left">合计应付金额</div>
              <div className="amount-o-right">￥{decoOrder.payableAmount}</div>
            </div>
          </div>
          <div className="amount-paid">
            <div className="amount-p-left">合计已付金额</div>
            <div className="amount-p-right">￥{decoOrder.paidAmount}</div>
          </div>
          <div className="amount-times">
            <div className="order-number">订单编号：{decoOrder.serialNumber}</div>
            <div className="create-date">创建时间：{decoOrder.createDate}</div>
            {receiveEle}
          </div>
        </div>
      </div>
    );
  }
}

const store = (state) => {
  const decoOrder = state.get('order').toJS();
  return {
    ...decoOrder
  };
};

export default connect(store)(DecoOrder);
