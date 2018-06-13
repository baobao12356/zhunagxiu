import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Env from 'rs-browser';
import { Header as Nav } from 'rs-react-components';
import { withRouter } from 'react-router';
import HybridBridge from 'rs-hybrid-bridge';
import MyHomeInfo from './my-home-info';
import MyHomeDetails from './my-home-details';
import { buildingSitesMyhomeFetchStatusById } from '../../../actions';
import './style.scss';

function Header({ critical, status, outerOrderNo, f }) {
  const decoOrderElem = () => (
    <div
      className="to-deco-order"
      onTouchStart={() => {
        f && f({
          id: 3627
        });
        location.assign(`order.html?id=${outerOrderNo}&type=construct&__open=1`);
      }}
    >装修订单</div>
  );
  const elem = status !== 1 && !!outerOrderNo && outerOrderNo !== 'undefined' ? decoOrderElem() : '';

  return (
    <Nav
      className="header"
      theme="transparent"
      critical={critical}
      rightContent={elem}
    >
      <div>我的家</div>
    </Nav>
  );
}

class MyHome extends PureComponent {
  constructor(p) {
    super(p);
    this.state = {};
    this.myHomeInfoOnLoad = this.myHomeInfoOnLoad.bind(this);
  }

  async componentDidMount() {
    const { match, dispatch, history } = this.props;
    const { status } = match.params;
    if (!status) {
      const cityCode = await this.getCityCode();
      const action = await buildingSitesMyhomeFetchStatusById(match.params.id, cityCode);
      const id = action.id;
      const newStatus = action.status;
      history.push(`/myHome/${id}/${newStatus}`);
      dispatch(action);
    }
  }

  myHomeInfoOnLoad({ critical }) {
    this.setState({
      critical
    });
  }

  getCityCode() {
    let cityCode = '310100';
    if (Env.rsApp) {
      new HybridBridge(window).hybrid('getter', {}).then((res) => {
        cityCode = res.ShowCityId;
      });
    }
    return cityCode;
  }

  render() {
    const { match, p, f, z } = this.props;
    const { status, id } = match.params;
    if (!status) {
      return null;
    }
    const { outerOrderNo } = this.props.myHomeInfo;
    // Cookies.set('outerOrderNo', outerOrderNo);
    const { critical } = this.state;
    return (
      <div className="myHome">
        <Header critical={critical} status={status} outerOrderNo={outerOrderNo} f={f} />
        <MyHomeInfo status={status} onLoad={this.myHomeInfoOnLoad} f={f} />
        <MyHomeDetails id={id} status={status} p={p} f={f} z={z} />
      </div>
    );
  }
}


const store = (state) => {
  const myHome = state.get('buildingSites').get('myHome').toJS();
  return {
    ...myHome,
  };
};

export default connect(store)(withRouter(MyHome));
