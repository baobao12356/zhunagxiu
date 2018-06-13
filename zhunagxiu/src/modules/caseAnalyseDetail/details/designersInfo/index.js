/**
 * Created by junwei.yin on 2017/6/6.
 */
import React from 'react';
import './style.scss';
import Host from '../../../../lib/scripts/config_host'
import BigData from '../../../../lib/scripts/bigData'
import HybridBridge from 'rs-hybrid-bridge';
import Concern from '../../../../lib/components/concern'
import Env from 'rs-browser';
import QueryString from 'query-string';
export default class DesignersInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      designerImgUrl: "",
      name: "",
      companyName: "",
      caseCounts: "",
      //评价条数待定
      EvaluateCounts: "",
      designerService: "",
      designerBudget: "",
      workingHours: '',
      cityName: '',
      caseId: '',
      designerId: '',
      designerLevel: '',
      personalBrightSpot: '',
      companyId: '',
      designAgencyId: '',
      pageFrom: '',
      companyId: '',
      roleType: ''
    }
    this.hybridBridge = new HybridBridge(window);
    this.handleAppoint = this.handleAppoint.bind(this);
    this.goCompanyDetail = this.goCompanyDetail.bind(this);
    this.toDesingerPage = this.toDesingerPage.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    console.log('1232132132132132131231', nextProps)
    this.setState({
      designerImgUrl: nextProps.detailInfo.designerImgUrl,
      name: nextProps.detailInfo.realName,
      cityName: nextProps.detailInfo.cityName,
      companyName: nextProps.detailInfo.companyName,
      caseCounts: nextProps.detailInfo.caseCounts,
      //评价条数待定
      EvaluateCounts: window.localStorage.getItem("evaluateCounts"),
      designerService: nextProps.detailInfo.designerService,
      designerBudget: nextProps.detailInfo.designerBudget,
      workingHours: nextProps.detailInfo.workingHours,
      caseId: nextProps.caseId,
      designerId: nextProps.detailInfo.designerId,
      designerLevel: nextProps.detailInfo.designerLevel,
      personalBrightSpot: nextProps.detailInfo.personalBrightSpot,
      designAgencyId: nextProps.detailInfo.designAgencyId,
      pageFrom: nextProps.pageFrom,
      companyId: nextProps.detailInfo.companyId,
      roleType: nextProps.detailInfo.roleType || '1'
    })
    window.localStorage.removeItem("evaluateCounts")
  }

  handleAppoint(e) {
    e.stopPropagation();
    console.log(e)
    let _this = this;
    this.props.handlePointF('3376', `tag='案例'&contentid=${QueryString.parse(window.location.search).detailId}&designer_id=${this.props.detailInfo.designerId}`)
    let parameter = {
      roleType: this.state.roleType,
      designerId: this.state.designerId,
      companyId: this.state.companyId,
      designAgencyId: this.state.designAgencyId,
      tag: 9,
      pageFrom: 'app-alxqdx-10001',
      sourceFrom: '27001'
    };
    console.log(parameter);
    this.hybridBridge.hybrid('call_native', parameter).then((result) => {
    }).catch((error) => {
      console.log('跳转native设计师预约失败')
    });
  }

  goCompanyDetail(companyId) {
    const { detailInfo } = this.props;
    const { companyType } = detailInfo;
    if (companyType === 0) {
      //装修公司详情
      window.location = `${Host.path}/mainapp/decoCorpDetail.html?detailId=${companyId}&__open=1`
    } else if (companyType === 2) {
      //设计机构
      window.location = `${Host.path}/mainapp/decoInstituteDetail.html?detailId=${companyId}&__open=1`
    }
    this.props.handlePointF('3377', `contentid=${QueryString.parse(window.location.search).detailId}&company_id=${this.props.detailInfo.companyId}`)
  }

  toDesingerPage() {
    let _this = this;
    this.props.handlePointF('1147', `tag='案例'&contentid=${QueryString.parse(window.location.search).detailId}&designer_id=${this.props.detailInfo.designerId}`);
    //window.location.href = Host.path+'/c/designerDetail.html?detailId='+this.props.detailInfo.designerId
    console.log(this.props.detailInfo.designerId)
    if (!!this.props.detailInfo.designerId && this.state.designerLevel == 7) {
      if (window.location.protocol != 'file:') {
        window.location = Host.path + `/mainapp/designerMasterDetail.html?detailId=${this.props.detailInfo.designerId}&__open=1`;
      } else {
        window.location = Host.path + `/mainapp/designerMasterDetail.html?detailId=${this.props.detailInfo.designerId}&__open=1`;
      }
    } else if (!!this.props.detailInfo.designerId && this.state.designerLevel != 7) {
      if (window.location.protocol != 'file:') {
        window.location = Host.path + `/mainapp/designerNormalDetail.html?detailId=${this.props.detailInfo.designerId}&__open=1`;
      } else {
        window.location = Host.path + `/mainapp/designerNormalDetail.html?detailId=${this.props.detailInfo.designerId}&__open=1`;
      }
    }
  }

  render() {
    const { detailInfo } = this.props;
    const { companyName, companyId } = detailInfo;
    this.styles = {
      //background:`url(${this.state.designerImgUrl}!) no-repeat`,
      background: `url(${this.state.designerImgUrl}) no-repeat`,
    }



    const designerImg = <div className="designerImg" style={this.styles}></div>,
      desingerInfo = <div>
        <div className="desingerName" >
          <span>{this.state.name}</span>
          {
            this.state.designerLevel && this.state.designerLevel == 7 ?
              "" :
              <span className="cityName_desinger">{this.state.cityName}</span>
          }

        </div>
        <div className="info_designer">
          {this.state.designerLevel && this.state.designerLevel == 7 ?
            (<span>{this.state.personalBrightSpot}</span>)
            :
            (<span className="hasYears">从业年限：
              <span className="years">{this.state.workingHours} </span>
              <span>
                {this.state.designerBudget}
              </span>
            </span>)
          }
        </div>
        {Env.rsApp && <div className="make" onClick={this.handleAppoint}>预约</div>}
      </div>
    return (
      <div className="desingerInfo">
        <div className="desinger-box">
          <div className="desinger-des clearfix" onClick={this.toDesingerPage.bind(this)}>
            {designerImg}
            {desingerInfo}
          </div>
          <div className="desinger-company" onClick={() => this.goCompanyDetail(companyId)}>
            <div className="company-box clearfix">
              所属公司: <span>{companyName}</span><i className="arrow"></i>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
