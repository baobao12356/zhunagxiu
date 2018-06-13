import React from 'react';
import { ListView } from 'antd-mobile';
import queryString from 'query-string';
import Env from 'rs-browser';
import cs from 'classnames';
import Nav from '../../lib/components/nav';
import { caseList } from '../../models/supervisionCaseListModel';
import './style.scss';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.companyId = params.companyId;
    this.fetchCaseList = this.fetchCaseList.bind(this);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      caseListData: [],
      pageNo: 1,
      hasMore: false
    };
  }

  componentDidMount() {
    this.fetchCaseList(this.state.pageNo, this.companyId);
  }

  fetchCaseList(pageNo, companyId) {
    caseList(pageNo, companyId).then((res) => {
      if (res.code == 200 && res.dataMap) {
        const ALLData = this.state.caseListData.concat(res.dataMap.records);
        //console.log('oooooooooooo', res.dataMap.records);
        this.setState({
          caseListData: ALLData,
          dataSource: this.state.dataSource.cloneWithRows(ALLData),
          pageNo: this.state.pageNo + 1,
          hasMore: res.dataMap.hasNextPage
        })
      } else {
        console.log(res.message)
      }
    });
  }

  onEndReached = (event) => {
    //console.log('more', this.state.hasMore);
    if (this.state.hasMore) {
      this.fetchCaseList(this.state.pageNo, this.companyId);
    }
  }

  render() {
    const { caseListData } = this.state;
    const row = (rowData, sectionID, rowID) => {
      //console.log("行数据", rowData, sectionID, rowID);
      return (
        <div className="caseItem" key={rowID}>
          <div className="caseImg"><img src={rowData.cover} /></div>
          <div className="caseTitle">{rowData.title}</div>
        </div>
      );
    };
    const footer = () => {
      return (
        <div className="bottom-line">
          {this.state.hasMore ? '上拉加载更多' : '已经到底了哦'}
        </div>
      );
    };
    return (
      <div className={cs({"pageWrapper": true, "ios-top": Env.ios && Env.rsApp, 'img-center': true})}>
        <Nav title='全部案例' shareIcon={false} />
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          // renderHeader={() => <span>header</span>}
          renderFooter={footer}
          renderRow={row}
          //className="am-list"
          //pageSize={4}
          useBodyScroll
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </div>

    );
  }
}
