/**
 * Created by feifei on 2017/12/20.
 */
import React from 'react';
import './style.scss';
import BigData from '../../../../lib/scripts/bigData';
import HybridBridge from 'rs-hybrid-bridge';
import Env from 'rs-browser';
import queryString from 'query-string';


export default class Cases extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.detailId = params.detailId;
    this.state = {
      cases: [],
      detailId: ''
    }
    this.point = new BigData();
    this.goToNative = this.goToNative.bind(this);
    this.goToCase = this.goToCase.bind(this)


  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      cases: nextProps.detailInfo.caseVos,
      caseCounts: nextProps.detailInfo.caseCounts,
      detailId: nextProps.detailId
    })
  }

  goToCase(caseId) {
    this.props.handlePointF('3017', `tag=案例contentid=${caseId||''}`);
    window.location.href = '/mainapp/caseAnalyseDetail.html?detailId=' + caseId+'&__open=1'
  }

  goToNative() {
    this.props.handlePointF('3019');

    if (this.state.cases && this.state.cases.length != 0) {
      const dataNative = {
        tag: '72',
        designAgencyId: this.state.detailId
      };
      new HybridBridge(window).hybrid('call_native', dataNative);
    }

  }

  render() {
    return (
      <div>
        {this.state.cases && this.state.cases.length > 0 &&
          <div className="cases">
            <div>案例作品
            {
                Env.rsApp && this.state.caseCounts >= 0 && <div><div className="instituteOther"></div><span onClick={this.goToNative.bind(this)}><span style={{ 'color': '#dfaf7D' }}>{this.state.caseCounts}</span> 个作品</span></div>
              }
            </div>
            {this.state.cases ?
              <div>
                {
                  this.state.cases.map((item, idx) => {
                    return <a key={idx} onClick={this.goToCase.bind(this, item.caseId)}>
                      <div className="caseCover"
                        style={{ 'backgroundImage': 'url(' + item.imageUrl + '.750x420.png!)' }}></div>
                      <div className="caseName">{item.title}</div>
                      {
                        item.designStyleStr && <div className="caseStyleTab">
                          {item.designStyleStr.split(",").map((item, idx) => {
                            return <span key={idx}>{item}</span>
                          })
                          }
                        </div>
                      }
                    </a>
                  })
                }
              </div> : <div className="blockNothing">暂无案例</div>
            }
          </div>
        }
      </div>
    )
  }

}
