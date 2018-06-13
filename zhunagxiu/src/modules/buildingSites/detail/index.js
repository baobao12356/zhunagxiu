import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Env from 'rs-browser';
import moment from 'moment';
import { Header as Nav } from 'rs-react-components';
import { Toast } from 'antd-mobile';
import QueryString from 'query-string';
import DetailModal from './detailModal';
import {
  buildingSitesMyhomeFetchStepInfoById,
  buildingSitesMyhomeFetchStepDetailInfoById
} from '../../../actions';
// import Nav from './../../../lib/components/nav';
import AddFixed from './../../../lib/scripts/addFixed';
import './style.scss';

function Header({ title = '' } = {}) {
  return (
    <Nav className="header">
      <div>{title}</div>
    </Nav>
  );
}

class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      modalShow: false,
      threeNodeName: ''
    };
    this.detailsPopUp = this.detailsPopUp.bind(this);
    this.onClose = this.onClose.bind(this);
    this.constructionDetailList = this.constructionDetailList.bind(this);
    const params = QueryString.parse(location.search);
    // this.id = params.id || '1265' || '1';
    this.id = params.id || '';
    this.name = params.name || '';
    this.threeNodeName = '';
    this.fixedFun = new AddFixed();
  }

  componentDidMount() {
    const { p, z } = this.props;
    p && p({
      id: '3632'
    });
    z && z({
      id: '3633'
    });
    this.getConstructionSecondDetail(this.id);
  }

  async getConstructionSecondDetail(id = '') {
    const { dispatch } = this.props;
    const action = await buildingSitesMyhomeFetchStepInfoById(id);
    dispatch(action);
  }

  async getConstructionThirdDetail(id = '') {
    const { dispatch } = this.props;
    const action = await buildingSitesMyhomeFetchStepDetailInfoById(id);
    const { payload = {} } = action;
    const { data = [] } = payload;
    if (data) {
      // const topSize = document.documentElement.scrollTop || document.body.scrollTop;
      // this.state.modalShow = true;
      // this.fixedFun.addFixed(topSize);
      dispatch(action);
      Toast.hide();
    }
  }

  detailsPopUp(logId, threeNodeName = '') {
    const { f } = this.props;
    f && f({
      id: 3634
    });
    this.setState({
      modalShow: true,
      threeNodeName
    });
    Toast.loading('Loading...', 1000);
    // this.threeNodeName=threeNodeName;
    // this.state.modalShow = true;
    const topSize = document.documentElement.scrollTop || document.body.scrollTop;
    this.fixedFun.addFixed(topSize);
    this.getConstructionThirdDetail(logId);
    // this.getConstructionThirdDetail(7467);
  }

  onClose() {
    const { dispatch } = this.props;
    this.setState({
      modalShow: false
    });
    dispatch(
      {
        type: 'CONS_THIRDDETAIL_CLEAR'
      }
    );
    this.fixedFun.removeFixed();
  }

  convResultStatusText(resultStatus) {
    let resultStatusText = '';
    switch (resultStatus) {
      case 0:
        resultStatusText = '未记录';
        break;
      case -1:
        // resultStatusText = '不合格'
        resultStatusText = '待整改';
        break;
      case 1:
        resultStatusText = '合格';
        break;
      case 2:
        resultStatusText = '跳过';
        break;
      default:
        resultStatusText = '';
    }
    return resultStatusText;
  }

  constructionDetailList(list) {
    const { data: dataMap = [] } = list;
    if (dataMap) {
      const detailList = dataMap.map((item, index) => {
        const key = `f_${index}`;
        const { resultStatus, threeNodeName = '',
          recordInfoVoList = [] } = item;
        const resultStatusText = this.convResultStatusText(resultStatus);
        let recordInfoVoElemList = [];
        if (recordInfoVoList.length > 0) {
          recordInfoVoElemList = recordInfoVoList.map((val, idx) => {
            const flag = `f_${idx}`;
            const { resultStatus: subResultStatus,
              userTypeName = '', submitTime = '', logId = '' } = val;
            let submitTimeView = null;
            if (submitTime) {
              submitTimeView = moment(submitTime).format('YYYY.MM.DD');
              // submitTimeView = moment(submitTime).format('YYYY年MM月DD日');
            }
            const subResultStatusText = this.convResultStatusText(subResultStatus);
            let csclassName = 'secondary_details_item item_three';
            if (subResultStatus === -1) {
              csclassName += ' correction_mark';
            }
            return (
              <div
                className="list_secondary_details" key={flag}
                onClick={(e) => {
                  e.stopPropagation();
                  if (subResultStatus === 0) {
                    return;
                  }
                  this.detailsPopUp(logId, threeNodeName);
                }}
              >
                <div className="secondary_details_item  item_one">
                  {userTypeName}
                </div>
                <div className="secondary_details_item item_two">
                  {submitTimeView}
                </div>
                <div className={csclassName}>
                  {subResultStatusText}
                  {subResultStatus !== 0 && <span className="arron_right" />}
                </div>
              </div>
            );
          });
        } else {
          recordInfoVoElemList = null;
        }
        let resultStatusTextClassName = 'list_two';
        if (resultStatus === -1) {
          resultStatusTextClassName += ' correction_mark';
        }
        return (
          <div
            className="my_list_row"
            key={key}
          >
            <div className="my_list">
              <div className="list_one">{threeNodeName}</div>
              <div className={resultStatusTextClassName}>
                {resultStatusText}
              </div>
            </div>
            {recordInfoVoElemList}
          </div>
        );
      });
      return (
        <section className="results_list">
          {detailList}
        </section>
      );
    }
    return null;
  }

  classNameFun() {
    let classNameContent = 'decoration_details';
    if (!Env.rsApp) {
      classNameContent += ' webPadding';
    }
    if (Env.rsApp) {
      classNameContent += ' app-wrap';
    }
    if (Env.rsApp && Env.ios) {
      classNameContent += ' app-wrap ios-nav';
    }
    if (Env.rsApp && Env.ios && Env.iPhoneX) {
      classNameContent += ' app-wrap ios-nav iPhone-x';
    }
    return classNameContent;
  }

  render() {
    const { modalShow, threeNodeName } = this.state;
    const { constructionDetail = {}, constructionitemThirdDetail = {}, f } = this.props;
    return (
      <div className={this.classNameFun()}>
        <Header title={this.name} />
        <section className="details_results">
          <div className="details_results_acceptance">
            验收结果
          </div>
        </section>
        {this.constructionDetailList(constructionDetail)}
        <DetailModal
          modalShow={modalShow} onClose={this.onClose}
          data={constructionitemThirdDetail.data} threeNodeName={threeNodeName}
          f={f}
        />
      </div>
    );
  }
}

const store = (state) => {
  const myHome = state.get('buildingSites').get('myHome').toJS();
  return {
    myHome: myHome || {},
    constructionDetail: myHome.constructionDetail || {},
    constructionitemThirdDetail: myHome.constructionitemThirdDetail || {}
  };
};

export default connect(store)(Detail);

/*    onClick={(e) => {
              e.stopPropagation();
              if (resultStatus === 0) {
                return;
              }
              if (recordInfoVoList.length === 0) {
                this.detailsPopUp(threeNodeId, threeNodeName);
              }
            }}
                  {recordInfoVoList.length === 0 && resultStatus !== 0 &&
                  <span className="arrons_right" />}
  */
