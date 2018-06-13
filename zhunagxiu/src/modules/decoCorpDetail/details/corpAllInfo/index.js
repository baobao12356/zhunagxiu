/**
 * Created by feifei on 2017/12/16.
 */
import React from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';
import Env from 'rs-browser';
import cs from 'classnames';

export default class CorpAllInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: '',
      praiseScore: 0,
      companyName: '',
      aboutUsBoxLabel: false,
      getIos9: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      detailInfo: nextProps.detailInfo,
      companyName: nextProps.companyName
    }, () => {
      let _this = this;
      //let aboutUsBox = document.getElementsByClassName('aboutUsBox');
      !this.state.aboutUsBoxLabel &&
        setTimeout(function () {
          let clientWidth = document.body.clientWidth;
          //if (!!aboutUsBox && aboutUsBox[0].clientHeight > 0.2133333 * clientWidth) {
          if (_this.aboutUsBox && _this.aboutUsBox.clientHeight > 0.2133333 * clientWidth) {
            _this.setState({
              aboutUsBoxLabel: true
            })
          }
        }, 2000);
    })
  }

  componentDidMount() {
    let _this = this;
    // let aboutUsBox = document.getElementsByClassName('aboutUsBox');
    // !this.state.aboutUsBoxLabel &&
    // setTimeout(function(){
    //   let clientWidth = document.body.clientWidth;
    //   if(!!aboutUsBox && aboutUsBox[0].clientHeight>0.2133333*clientWidth){
    //     _this.setState({
    //       aboutUsBoxLabel:true
    //     })
    //   }
    // },2000);
    this.getIos9();
  }

  getIos9() {
    // 判断是否 iPhone 或者 iPod
    if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
      // 判断系统版本号是否小于 9，下面条件成立就表示<=9否则>9
      this.setState({
        getIos9: Boolean(navigator.userAgent.match(/OS [3-9]_\d[_\d]* like Mac OS X/i))
      });
    }
  }
  render() {
    const { boxShow } = this.state;
    let companyName = '';
    if (!this.state.companyName || String(this.state.companyName) == 'undefined') {
      companyName = '';
    } else {
      companyName = this.state.companyName;
    }

    //alert(this.state.getIos9)
    return (
      <div className="corpAllInfo">
        <div>
          <span style={{ 'color': '#000' }}>基础信息</span>
        </div>
        <div className="allInfoName">
          <span>公司全称：</span>
          <span>{this.state.detailInfo.companyName}</span>
        </div>
        {
          this.state.detailInfo.shopNumber || this.state.detailInfo.constructionScale ? <div className="allInfoName">
            <span>公司规模：</span>
            <span>
              {this.state.detailInfo.shopNumber ? ('门店数' + this.state.detailInfo.shopNumber) + '   ' : ''}
              {this.state.detailInfo.shopNumber && <i>&nbsp;&nbsp;</i>}
              {this.state.detailInfo.constructionScale ? ('施工队规模' + this.state.detailInfo.constructionScale) : ''}
            </span>
          </div> : ''
        }
        {
          this.state.detailInfo.setUpDate ? <div>
            <span>成立年限：</span>
            <span>{this.state.detailInfo.setUpDate}</span>
          </div> : ''
        }
        {
          this.state.detailInfo.acceptPriceStr ? <div>
            <span>承接价位：</span>
            <span>{this.state.detailInfo.acceptPriceStr ? (String(this.state.detailInfo.acceptPriceStr).replace(/,/, "，")) : ''}</span>
          </div> : ''
        }
        {
          this.state.detailInfo.companyRemark ? <div className="allInfoRemark" style={{ "height": this.state.getIos9 ? "auto" : "" }}>
            <input type="checkbox" id="aboutUs" className={cs({ "dis": this.state.getIos9 })} />
            <div className={cs({ "aboutUsBox": !this.state.getIos9 })} ref={(aboutUsBox) => { this.aboutUsBox = aboutUsBox; }}>
              <span>公司简介：</span>
              <span>{this.state.detailInfo.companyRemark}</span>
            </div>
            {this.state.aboutUsBoxLabel ? <label htmlFor="aboutUs" className="more"></label> : ''}
          </div> : ''
        }
      </div>
    )
  }
}
