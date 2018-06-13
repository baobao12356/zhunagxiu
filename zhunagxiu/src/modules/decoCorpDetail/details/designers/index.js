/**
 * Created by feifei on 2017/10/23.
 */
import React from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../../../lib/scripts/bigData';
import Env from 'rs-browser';
import Host from '../../../../lib/scripts/config_host';


export default class Designers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      designers: [],
      detailId: ''
    };
    this.hybridBridge = new HybridBridge(window);

    //this.point = new BigData();
    this.goToNative = this.goToNative.bind(this);
    this.handleAppoint = this.handleAppoint.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      designers: nextProps.detailInfo.designers,
      detailId: nextProps.detailId,
      designerCounts: nextProps.detailInfo.designerCounts
    })
  }

  goToNative() {
    if (this.state.designers && this.state.designers.length != 0) {
      //this.point.f('110.300.55.59.68.78.75', 'deco', 'page.detail.company', 'page_companydetaildesignermore', 'page_companydetaildesignermore', 'p_action_id');
      this.props.f({
        id: '1776',
      });
      const dataNative = {
        tag: '65',
        companyID: this.state.detailId
      };

      new HybridBridge(window).hybrid('call_native', dataNative);
    }
  }

  handleAppoint(designerId) {
    //let _this = this;
    //_this.point = new BigData();
    //_this.point.f('110.300.55.59.68.78.74','deco','page.detail.company','page_companyorder','page_companyorder','','','',designerId);
    this.props.f({
      id: '1775',
      p_action_id: `designer_id=${designerId || ''}`,
    });
    // let parameter = {
    //   roleType: "1",
    //   designerId: designerId,
    //   pageFrom: "app-zxgsxq-10001",
    //   tag: 9
    // };
    // console.log(parameter);
    // this.hybridBridge.hybrid('call_native', parameter).then((result) => {
    // }).catch((error) => {
    //   console.log('跳转native设计师预约失败')
    // });
    window.location.href = `${Host.path}/mainapp/designerNormalDetail.html?detailId=${designerId}&__open=1`
  }

  render() {

    return (
      <div className="designerBlock">
        {this.state.designers &&
          <div className="designers">
            <div>设计师
            {
                Env.rsApp && this.state.designerCounts > 3 && <div><div></div><span onClick={this.goToNative.bind(this)} >查看全部<span style={{ 'color': '#dfaf7D' }}>{this.state.designerCounts}</span>个团队</span></div>
              }
            </div>
            {this.state.designers ?
              <div>
                {
                  this.state.designers.map((item, idx) => {
                    return <div className="designerTab" key={idx}>
                      {item.designerLevel == 7 ? <a href={'/mainapp/designerMasterDetail.html?detailId=' + item.designerId + '&back=h5'}>
                        <div className="designerIcon"><span style={{ 'backgroundImage': 'url(' + item.avatarUrl + '.150x150.png!)' }}></span></div>
                        <div className="designerName">{item.realName}</div>
                        <div className="designerWork" style={{ opacity: item.workingHours ? '1' : '0' }}>{'从业' + item.workingHours}</div>
                      </a> : <a href={'/mainapp/designerNormalDetail.html?detailId=' + item.designerId + '&back=h5'}>
                          <div className="designerIcon"><span style={{ 'backgroundImage': 'url(' + item.avatarUrl + '.150x150.png!)' }}></span></div>
                          <div className="designerName">{item.realName}</div>
                          <div className="designerWork" style={{ opacity: item.workingHours ? '1' : '0' }}>{'从业' + item.workingHours}</div>
                        </a>}
                      <div className="com-appoint" onClick={this.handleAppoint.bind(this, item.designerId)}>查看作品</div>
                    </div>
                  })
                }
              </div> : <div className="blockNothing">暂无设计师</div>
            }
          </div>
        }
      </div>
    )
  }

}
