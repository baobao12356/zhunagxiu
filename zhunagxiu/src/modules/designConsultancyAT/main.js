import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import QueryString from 'query-string';
import AppointBox from '../../lib/components/appointBox';
import Nav from '../../lib/components/nav';
import './style.scss';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = QueryString.parse(location.search);
    this.source = params.source;
    this.selectedData = {};
    this.getSelectedData=this.getSelectedData.bind(this);
    this.state ={
      selectedData: {}
    }
  }

  componentDidMount() {
    this.getSelectedData();
  }
  //获取选择数据
  getSelectedData() {
    const selectedData = JSON.parse(localStorage.getItem('selectedData'));
    this.setState({
      selectedData: selectedData
    });
    //alert(this.state.selectedData);
  }
  render() {
    const {selectedData} =this.state;
    console.log('selectedData',this.state.selectedData);
    return (
      <div className={cs({ 'pageWrap': true, 'ios-top': Env.ios && Env.rsApp, 'img-center': true })}>
        <Nav title="设计咨询" shareIcon={false} />
        <div className="askWrap">
          <div className="askTitle"></div>
          <AppointBox selectedData={selectedData} source={this.source}/>
        </div>
      </div>

    );
  }
}
