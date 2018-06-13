/**
 * Created by feifei on 2017/10/23.
 */
import React from 'react';
import Swiper from 'swiper';
import BigData from '../../../../lib/scripts/bigData';
import HybridBridge from 'rs-hybrid-bridge';
import Env from 'rs-browser';
import ResizeImg from '../../../../lib/scripts/resizeImg';
import './style.scss';


export default class Cases extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cases: [],
      detailId: ''
    }
    //this.point = new BigData();
    this.goToNative = this.goToNative.bind(this)
    this.goToCase = this.goToCase.bind(this)
  }
  componentWillReceiveProps(nextProps) {

    this.setState({
      cases: nextProps.detailInfo.cases,
      caseCounts: nextProps.detailInfo.caseCounts,
      detailId: nextProps.detailId
    }, () => {
      this.swiperCaseImgs = new Swiper('.swiper-wrapper-case', {
        slidesPerView: 'auto',
        freeMode: true,
      });
    })
  }

  goToNative() {
    if (this.state.cases && this.state.cases.length != 0) {
      //this.point.f('110.300.55.59.68.78.77', 'deco', 'page.detail.company','page_companydetailcasemore', 'page_companydetailcasemore','p_action_id');
      this.props.f({
        id: '1777',
      });
      const dataNative = {
        tag: '64',
        companyID: this.state.detailId
      };
      new HybridBridge(window).hybrid('call_native', dataNative);
    }

  }

  goToCase(caseId) {
    //this.point.f('110.300.55.59.68.78.78', 'deco', 'page.detail.company','page_companydetailcasedetail', 'page_companydetailcasedetail','p_action_id');
    this.props.f({
      id: '1778',
    });
    // window.location.href='/mainapp/caseAnalyseDetail.html?detailId='+caseId+'&back=h5'
    window.location.href = '/mainapp/caseAnalyseDetail.html?detailId=' + caseId + '&__open=1'

  }

  render() {
    return (
      <div>
        {this.state.cases && this.state.cases.length > 0 &&
          <div className="cases">
            <div>案例展示
            {
                Env.rsApp && this.state.caseCounts > 1 && <div><div></div><span onClick={this.goToNative.bind(this)}>查看全部<span style={{ 'color': '#dfaf7D' }}>{this.state.caseCounts}</span> 个案例</span></div>
              }
            </div>
            {this.state.cases ?
              <div className="swiper-wrapper-case">
                <div className="case_picture_all swiper-wrapper">
                  {
                    this.state.cases.map((item, idx) => (
                      <div className="case_one swiper-slide" key={idx} onClick={this.goToCase.bind(this, item.caseId)}>
                        <div className="case_picture">
                          <img src={ResizeImg(item.caseCoverImage, '336', '252', '!')} />
                        </div>
                        <div className="caseName">{item.caseTitle}</div>
                        <div className="caseTag">{item.designStyleStr}</div>
                      </div>
                    ))
                  }
                </div>
              </div> : <div className="blockNothing">暂无案例</div>
            }
          </div>
        }
      </div>
    )
  }

}
