/**
 * Created by feifei on 2017/12/20.
 */
import React from 'react';
import './style.scss';
import queryString from 'query-string';
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../../../lib/scripts/bigData';
import Env from 'rs-browser';
import cs from 'classnames';
import InstituteDetailModel from '../../../../models/instituteDetailModel';


export default class InstituteAllInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      designers: [],
      honor: [],
      intro: '',
      setUpDate: '',
      detailId: '',
      current: 0,
      studio: [],
      bodyScrollHeight: 0,
      hasNextPage: true
    };
    this.page = 1;
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.point = new BigData();
    this.goToNative = this.goToNative.bind(this);
    this.goToDesigner = this.goToDesigner.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      intro: nextProps.intro,
      setUpDate: nextProps.setUpDate,
      honor: nextProps.detailInfo.honorHxAppVos,
      detailId: nextProps.detailId,
      designerCounts: nextProps.detailInfo.designerCounts
    })
  }

  goToNative() {
    if (this.state.designers && this.state.designers.length != 0) {
      const dataNative = {
        tag: '65',
        companyID: this.state.detailId
      };

      //console.log(dataNative);
      new HybridBridge(window).hybrid('call_native', dataNative);
    }
  }

  changeTabs(index) {
    this.props.handlePointF('3020', `tag=${index+1}`);
    this.setState({
      current: index
    })

  }

  componentDidMount() {
    let studio = document.getElementById("infoBlock1");
    let _this = this;
    InstituteDetailModel.ReceiveInstituteStudio(_this.detailId, 1).then((data) => {//设置详情状态
      if (data.code == '200') {
        _this.setState({
          designers: data.dataMap.records,
          totalPages: data.dataMap.totalPages
        })
      }
    });
    window.onscroll = function () {
      //console.log(document.body.scrollTop+screen.height-studio.offsetTop-studio.clientHeight);
      if (_this.state.bodyScrollHeight < document.body.scrollTop) {
        _this.setState({
          bodyScrollHeight: document.body.scrollTop
        })
      }
      //console.log(document.body.scrollTop+screen.height-studio.offsetTop-studio.clientHeight);
      if ((_this.state.totalPages >= _this.page) && (document.body.scrollTop + screen.height - studio.offsetTop - studio.clientHeight > 0.1466667 * document.body.clientWidth)) {
        InstituteDetailModel.ReceiveInstituteStudio(_this.detailId, ++_this.page).then((data) => {//设置详情状态
          let studio = _this.state.studio;
          if (data.code == 200) {
            studio.push(data.dataMap.records);
            _this.setState({
              studio: studio,
              designers: _this.state.designers.concat(data.dataMap.records)
            })
          }
        })
      }
    }
  }

  goToDesigner() {
    this.point.f('110.300.49.58.68.78.338', 'deco', 'p_designCompanyInfo', 'p_designCompanyInfo', 'p_designerinfo', '', '', '', '', this.detailId);
  }
  render() {

    return (
      <div className="lastBlockDiv">
        <div className="designers">
          <div>
            <div className={cs({ "instituteInfoTab": true, "infoOn": (this.state.current == 0) })} onClick={this.changeTabs.bind(this, 0)}><span>设计工作室</span><span><i></i></span></div>
            <div className={cs({ "instituteInfoTab": true, "infoOn": (this.state.current == 1) })} onClick={this.changeTabs.bind(this, 1)}><span>公司介绍</span><span><i></i></span></div>
            <div className={cs({ "instituteInfoTab": true, "infoOn": (this.state.current == 2) })} onClick={this.changeTabs.bind(this, 2)}><span>公司荣誉</span><span><i></i></span></div>
          </div>
          <div>
            <div id="infoBlock1" className={cs({ "infoBlock": true, "infoBlockOn": (this.state.current == 0) })}>
              {this.state.designers.length !== 0 ?
                <div className="infoDesigners">
                  {
                    this.state.designers.map((item, idx) => {
                      return <div className="designerTab" key={idx}>
                        <a href={'/mainapp/designStudioDetail.html?detailId=' + item.studioId + '&back=h5'} onClick={this.goToDesigner.bind(this)}>
                          <div className="designerIcon">
                            {item.studioLogo ? <span style={{ 'backgroundImage': 'url(' + item.studioLogo + '.150x150.png!)' }}></span>
                              : <span style={{ 'backgroundImage': 'url(' + item.avatarUrl + '.150x150.png!)' }}></span>}
                          </div>
                          <div className="designerInfos">
                            <div className="designerName">{item.studioName}</div>
                            <div className="designerWork" style={{ opacity: item.workingHours ? '1' : '0' }}>{'从业' + item.workingHours}</div>
                            {item.knowledgeStype && <div className="designerStyleTab">{item.knowledgeStype.map((item, idx) => {
                              return <span key={idx}>{item}</span>
                            })
                            }</div>
                            }
                          </div>
                          {item.experiencePrice ? <div className="designerPrices"><div className={cs({ "designerPrice": true, "designerSale": true })}><span> ￥</span>{item.experiencePrice}<span>㎡</span></div>
                            <div className="designerOldPrice"><span> ￥</span>{item.budget}<span>㎡</span></div></div>
                            : <div className={cs({ "designerPrice": true, "designerSale": false })}><span> ￥</span>{item.budget}<span>㎡</span></div>
                          }
                        </a>
                      </div>
                    })
                  }
                </div> : <div className="instituteNothing"></div>
              }
            </div>
            <div id="infoBlock2" className={cs({ "infoBlock": true, "infoBlockOn": (this.state.current == 1) })}>
              {
                this.state.intro ? <div className="infoIntro com-rich-text" dangerouslySetInnerHTML={{ __html: this.props.setUpDate ? ('成立时间：' + this.state.setUpDate + '年<br/>') + this.state.intro : '' + this.state.intro }}></div> : <div className="instituteNothing"></div>
              }
            </div>
            <div id="infoBlock3" className={cs({ "infoBlock": true, "infoBlockOn": (this.state.current == 2) })}>
              {
                this.state.honor ?
                  <div className="infoHonor">
                    {
                      this.state.honor.map((item, idx) => {
                        return <div key={idx}><i></i>{item.awardsDate}&nbsp;&nbsp;&nbsp;{item.awardsDes}</div>
                      })
                    }
                  </div> : <div className="instituteNothing"></div>
              }
            </div>
          </div>

        </div>
      </div>
    )
  }

}
