/**
 * Created by junwei.yin on 2017/6/6.
 */
import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
//import Hybrid from '../../../../common/hybrid';
import './style.scss';
import PicItems from './picItems';
export default class CasesDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      caseUrls: {},
      casesId: "",
      caseTitle: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      caseUrls: nextProps.detailInfo.caseImgVo,
      casesId: nextProps.detailInfo.casesId,
      caseTitle: nextProps.detailTitle
    })

  }
  render() {
    return (
      <div className={cs({ "caseDetails": true, 'caseDetails_wap': Env.rsApp })}>
        {/*<div className="caseDetails_title"><b></b>案例详情</div>*/}
        <PicItems picInfo={this.state.caseUrls} casesId={this.state.casesId} caseTitle={this.state.caseTitle} detailInfo={this.props.detailInfo} />
      </div>
    )
  }

}
