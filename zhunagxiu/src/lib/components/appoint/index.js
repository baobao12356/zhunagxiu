import React, { Component } from 'react';
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../scripts/bigData';
/* 调用hybrid方法 设计师预约
 * props:designerOpenId
 *
 * 样式：类名com-appoint
* */


export default class Appoint extends Component {

  constructor(props) {
    super(props);
    const that = this;

    this.state = {
      designerId: '',
      companyId: '',
      designAgencyId: '',
      text: '',
      pageFrom: "",
      roleType: '',
      sourceFrom: '',
      sourceType: ''
    };
    this.handleAppoint = this.handleAppoint.bind(this);
    that.hybridBridge = new HybridBridge(window);
    that.onHybridBridge = that.handleAppoint.bind(that);

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      roleType: nextProps.roleType || '1',
      designerId: nextProps.designerId || '',
      companyId: nextProps.companyId || '',
      designAgencyId: nextProps.designAgencyId || '',
      text: nextProps.text,
      pageFrom: nextProps.pageFrom,
      sourceFrom: nextProps.sourceFrom,
      sourceType: nextProps.sourceType
    })
  }

  handleAppoint() {
    const _this = this;
    if (this.props.f) {
      const { submitId } = this.props;
      this.props.f({
        id: submitId && submitId.id ? submitId.id : ""
      });
    }

    let parameter = {
      roleType: this.state.roleType,
      designerId: this.state.designerId,
      companyId: this.state.companyId,
      designAgencyId: this.state.designAgencyId,
      tag: 9,
      pageFrom: this.state.pageFrom || '',
      sourceFrom: this.state.sourceFrom || '',
      sourceType: this.state.sourceType || ''
    };
    console.log(parameter);
    this.hybridBridge.hybrid('call_native', parameter).then((result) => {
    }).catch((error) => {
      console.log('跳转native设计师预约失败')
    });
  }

  render() {
    return (
      <div className="com-appoint" onClick={this.handleAppoint}>{this.state.text || this.props.text}</div>
    );
  }

}
