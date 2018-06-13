import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ImgResize } from 'rs-react-components';
import queryString from 'query-string';
import Swiper from 'swiper';
import cs from 'classnames';
import Env from 'rs-browser';
import 'swiper/dist/css/swiper.css';

import { buildingSitesMyhomeFetchConstructionById } from '../../../../actions';
import './style.scss';

const params = queryString.parse(location.search);
const { id } = params;
class MyHomeInfo extends PureComponent {
  constructor(p) {
    super(p);
    this.state = {};
    this.bannerSwiper = null;
    this.onLoad = this.onLoad.bind(this);
    this.phonePoint = this.phonePoint.bind(this);
    this.toConstruction = this.toConstruction.bind(this);
  }

  componentDidMount() {
    this.fetchConstructionById();
    this.onLoad();
  }

  async fetchConstructionById() {
    const { dispatch } = this.props;
    const action = await buildingSitesMyhomeFetchConstructionById(id);
    dispatch(action);
  }

  componentDidUpdate() {
    const status = parseInt(this.props.status, 10);
    const { myHomeInfo, construction } = this.props;
    let resourceVos = null;
    if (status === 1) {
      resourceVos = !!myHomeInfo && !!myHomeInfo.resourceVos ? myHomeInfo.resourceVos : [];
    } else {
      resourceVos = !!construction && !!construction.resourceVos ? construction.resourceVos : [];
    }

    if (resourceVos && resourceVos.length) {
      this.bannerSwiper ? this.bannerSwiper.update() :
        this.bannerSwiper = new Swiper('.banner-swiper', {
          autoplay: false,
          effect: 'slide',
          freeMode: false
        });
    }
  }

  onLoad() {
    const { onLoad } = this.props;
    if (onLoad) {
      const height = parseInt(window.getComputedStyle(this.rootElem).height.replace('px', ''), 10) - 90;
      onLoad({ critical: height });
    }
  }

  displayBanner(resourceVos) {
    const bannerList = resourceVos.length > 0 && resourceVos.map((item, index) => {
      const key = `banner-item-key-${index}`;
      let elem = null;
      if (!item.linkUrl) {
        elem = (
          <div className="banner-item swiper-slide" key={key}>
            <div className="banner-cover">
              <ImgResize width={750} height={750}>
                <img src={item.imgUrl} alt="" />
              </ImgResize>
            </div>
          </div>
        );
      } else {
        elem = (
          <div className="banner-item swiper-slide" key={key}>
            <a className="banner-cover" href={item.linkUrl}>
              <img src={item.imgUrl} alt="" />
            </a>
          </div>
        );
      }
      return elem;
    });

    return resourceVos.length > 0 ? (
      <div className="banner-swiper swiper-container">
        <div className="banner-list swiper-wrapper">
          {bannerList}
        </div>
      </div>
    ) : null;
  }

  toConstruction(param) {
    const _this = this;
    const { history, myHomeInfo } = _this.props;
    const status = parseInt(this.props.status, 10);
    if (!!myHomeInfo && myHomeInfo.status === 3 && status !== param) {
      history.push(`/myHome/${id}/${param}`);
    }
  }

  phonePoint() {
    const { f } = this.props;
    f && f({
      id: 3626
    });
  }

  render() {
    const outerClassName = cs({
      'my-home-info': true,
      'app-wrap': true,
      'ios-nav': Env.rsApp && Env.ios,
      'iPhone-x': Env.rsApp && Env.ios && Env.iPhoneX
    });
    const { construction, myHomeInfo } = this.props;
    const status = parseInt(this.props.status, 10);
    let resourceVos = [];
    if (status === 1) {
      resourceVos = myHomeInfo.resourceVos || [];
    } else {
      resourceVos = construction.resourceVos || [];
    }
    const { contractorTel, stewardTel, address } = construction;
    const cTelHref = Env.ios ? `phone://${contractorTel}` : `tel:${contractorTel}`;
    const sTelHref = Env.ios ? `phone://${stewardTel}` : `tel:${stewardTel}`;
    const tab1ClassName = cs({
      tab1: true,
      'tab-active': status === 1
    });
    const tab2ClassName = cs({
      tab2: true,
      'tab-active': status === 2
    });
    const tab3ClassName = cs({
      tab3: true,
      'tab-active': status === 3
    });
    const pointElem = [1, 2, 3].map((item) => {
      const isActive = status === item ? ' point-active' : '';
      const pointClassName = `point${item} ${isActive}`;
      const random = Math.random();
      return (
        <div className={pointClassName} key={random} />
      );
    });

    let addressElem = null;
    if (status !== 1) {
      addressElem = (<div className="mhi">
        <div className="mhi-address">装修地址：{address}</div>
        <div className="mhi-phone">
          <div className="phone1"><i /><a href={cTelHref} onClick={this.phonePoint}>项目经理</a></div>
          <div className="phone2"><i /><a href={sTelHref} onClick={this.phonePoint}>红星管家</a></div>
        </div>
      </div>);
    }

    const bannerElem = this.displayBanner(resourceVos);
    return (
      <div
        className={outerClassName}
        ref={(elem) => {
          this.rootElem = elem;
        }}
      >
        <div className="tabs">
          <div className={tab1ClassName}>量房设计</div>
          <a tabIndex={-42} className={tab2ClassName} onClick={() => this.toConstruction(2)}>施工</a>
          <a tabIndex={-42} className={tab3ClassName} onClick={() => this.toConstruction(3)}>竣工</a>
        </div>
        <div className="tab-point">{pointElem}</div>
        {addressElem}
        {bannerElem}
      </div>
    );
  }
}

const store = (state) => {
  const myHome = state.get('buildingSites').get('myHome').toJS();
  return {
    ...myHome
  };
};

export default connect(store)(withRouter(MyHomeInfo));
