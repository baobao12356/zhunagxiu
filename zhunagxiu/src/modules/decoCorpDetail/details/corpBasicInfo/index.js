/**
 * Created by feifei on 2017/10/23.
 */
import React from 'react';
import HybridBridge from 'rs-hybrid-bridge';
import { Modal } from 'antd-mobile';
import EvaluateStars from '../../../../lib/components/evaluateStars';
import CouopnItem from '../couponItem';
import BigData from '../../../../lib/scripts/bigData';
import './style.scss';

export default class CorpBasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: '',
      praiseScore: 0,
      companyName: '',
      couponPop: false
    };
    //this.point = new BigData();
    this.goToMap = this.goToMap.bind(this);
    this.displayCouponPop = this.displayCouponPop.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      detailInfo: nextProps.detailInfo,
      companyName: nextProps.companyName
    })
  }

  goToMap() {
    //this.point.f('110.300.55.59.68.78.70', 'deco', 'page.detail.company','page_companydetailaddress', 'page_companydetailaddress','p_action_id');
    this.props.f && this.props.f({
      id: '1771',
    });
    const dataNative = {
      tag: '69',
      latitude: this.state.detailInfo.latitude,
      longitude: this.state.detailInfo.longitude,
      address: this.state.detailInfo.companyAddress,
      description: this.state.detailInfo.companyAppellation
    };
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  displayCouponPop() {

    const topSize = document.documentElement.scrollTop || document.body.scrollTop;
    const body = document.querySelector('body');
    this.setState({
      couponPop: !this.state.couponPop
    }, () => {
      if (this.state.couponPop) {
        body.style.top = `${-topSize}px`;
        body.setAttribute('class', 'overHidden');
      } else {
        const high = Math.abs(parseInt(body.style.top));
        body.setAttribute('class', '');
        window.scroll(0, high);
        body.style.top = '';
      }
    });
  }

  render() {
    const { couponList } = this.props;
    const { detailInfo } = this.state;
    let companyName = '';
    if (!this.state.companyName || String(this.state.companyName) == 'undefined') {
      companyName = '';
    } else {
      companyName = this.state.companyName;
    }

    return (
      <div className="corpBasicInfo">
        <div className="corpTop">
          {detailInfo.logoUrl ? <div className="corpTopLeft" style={{ 'backgroundImage': 'url(' + detailInfo.logoUrl + '.150x150.png!)' }}>
          </div> : ''}
          <div className="corpTopRight">
            <div>
              <div className="corpTitle">{this.state.companyName}</div>
            </div>
            {
              detailInfo.characteristicTab && <div>
                {
                  String(detailInfo.characteristicTab).split(",").map((item, idx) => {
                    return <span key={idx}>{item}</span>
                  })
                }
              </div>
            }
            {detailInfo.isPreference ? <div className="icon-isPreference"></div> : ''}
          </div>
          <div className="publicPraise"><div className="praise-num">{detailInfo.publicPraise}</div><div className="praise-text">口碑值</div></div>
        </div>
        <div className="corpMiddle">
          {detailInfo.halfcoverDecorationprice ?
            <div>
              <div className="corpMiddleTip">半包均价</div>
              <div
                className="corpMiddleInfo corpMiddleInfoPrice">{detailInfo.halfcoverDecorationprice} </div>
            </div> : ''
          }
          <div onClick={this.goToMap.bind(this)}>
            <div className="corpMiddleTip">公司地址</div>
            <div className="corpMiddleInfo">{detailInfo.companyAddress || ''}</div>
            <div className="corpOther"></div>
          </div>

          {detailInfo.subbranchs ?
            <div onClick={this.props.showShops}>
              <div className="corpMiddleTip">分部地址</div>
              <div className="corpMiddleInfo">{detailInfo.subbranchs.length}个分部</div>
              <div className="corpOther"></div>
            </div> : ''
          }
        </div>
        {
          // this.state.detailInfo.shopActivityTitle ?
          //   <div className="corpBottom">
          //     <div><div>惠</div></div>
          //     <div>{this.state.detailInfo.shopActivityTitle}</div>
          //     <div className="corpOther"></div>
          //   </div>
          //   : ''
        }
        {
          (couponList.length > 0 || detailInfo.shopActivityTitle) && <div className="corpBottom">
            {
              couponList.length > 0 &&
              <div className="promoteCoupon" onClick={this.displayCouponPop}>
                <div className="couponSign">券</div>
                <div className="couponDesc">{couponList[0].couponInfo.title}</div>
                <div className="corpOther"></div>
              </div>
            }
            {
              detailInfo.shopActivityTitle ?
                <div className="promoteActivity" onClick={this.props.showSale}>
                  <div><div>惠</div></div>
                  <div>{detailInfo.shopActivityTitle}</div>
                  <div className="corpOther"></div>
                </div>
                : ''
            }
          </div>
        }

        {/*优惠券弹窗*/}
        <Modal
          popup
          visible={this.state.couponPop}
          onClose={this.displayCouponPop}
          animationType="slide-up"
        >
          <div className="couponPop">
            <div className="popTitle">优惠券</div>
            <div className="couponList">
              {couponList.map((item, index) => {
                return <CouopnItem couponItem={item} key={index} couponIndex={index} f={this.props.f} />
              })
              }
            </div>
            <div className="popButton" onClick={this.displayCouponPop}>完成</div>
          </div>
        </Modal>
      </div>
    )
  }

}

//{
//  String(this.state.detailInfo.specialServiceStr).indexOf('环保工地')>-1?
//    <div className="corpTitle corpBox"><span className="corpDesc">环保工地</span></div>:''
//}


//<div className="corpPraise">{'口碑值：'+ (this.state.detailInfo.totalScore ? Number(this.state.detailInfo.totalScore ).toFixed(0) : '0')}</div>
//<div className="corpStar">
//  <EvaluateStars score={(this.state.detailInfo.overallScore ? Number(this.state.detailInfo.overallScore).toFixed(1) : '暂无评分')} totalScore={parseInt(this.state.detailInfo.overallScore)}/>
//</div>
