import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Accordion, Modal } from 'antd-mobile';
import RSBrowser from 'rs-browser';
import { padStart } from 'lodash';
import moment from 'moment';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import ResizeImg from '../../../../../lib/scripts/resizeImg';
import AddFixed from '../../../../../lib/scripts/addFixed';
import {
  buildingSitesMyhomeFetchCompletedById,
  buildingSitesMyhomeConstructionAgreePay
} from '../../../../../actions';
import './style.scss';

const AccordionPanel = Accordion.Panel;
const ModalAlert = Modal.alert;

class MyHomeCompleted extends PureComponent {
  constructor(props) {
    super(props);
    this.keyArray = {};
    // this.displayTitle = this.displayTitle.bind(this);
    this.displayData = this.displayData.bind(this);
    //this.displaystepData = this.displaystepData.bind(this);
    this.payPop = this.payPop.bind(this);
    this.openSummaryImgView = this.openSummaryImgView.bind(this);
    this.fixedFun = new AddFixed();
  }

  componentDidMount() {
    const { p, z } = this.props;
    p({
      id: 3640
    });
    z({
      id: 3641
    });
  }
  componentDidUpdate() {
    const { stepList } = this.props.completed;
    if (stepList.length > 0 && !stepList[0].summaryVo) {
      //   const { firstVos = [] } = construction;
      //   if (firstVos.length > 0) {
      //     const { nodeId } = firstVos[0];
      this.fetchMyhomeCompletedData(stepList[0].nodeId);
      //   }
    }
  }
  async fetchMyhomeCompletedData(nodeId) {
    const { dispatch, constructId } = this.props;
    const action = await buildingSitesMyhomeFetchCompletedById(constructId, nodeId);
    console.log('action', action);
    dispatch(action);
  }

  async constructPayment(nodeId) {
    const { dispatch, constructId } = this.props;
    const action = await buildingSitesMyhomeConstructionAgreePay(constructId, nodeId);
    dispatch(action);
    const { constructPayment } = this.props;
    if (constructPayment.data === '200') {
      //console.log('kkkkkkk');
      this.fetchMyhomeCompletedData(nodeId);
    }
  }

  //图片浏览
  openSummaryImgView(picArr, idx) {
    const { f } = this.props;
    f({
      id: 3643
    });
    const picData = [];
    picArr.map((item) => {
      const obj = {
        des: '',
        url: item,
        title: ''
      };
      picData.push(obj);
      return true;
    });
    const data = {
      ID: '',
      objectType: '',
      currentIndex: idx,
      photos: picData
    };
    console.log(data);
    new HybridOpenPageImagePreview().open(data).catch((e) => {
      console.log(e);
    });
  }

  onChange = (key) => {
    const { stepList } = this.props.completed;
    for (let i = 0; i < stepList.length; i++) {
      const stepItem = stepList[i];
      if (!stepItem.summaryVo && key.indexOf(`${i}`) !== -1) {
        this.fetchMyhomeCompletedData(stepItem.nodeId);
        break;
      }
    }
    console.log('key', key);
    // if (key.indexOf(1) && !this.keyArray[1]) { //水电阶段
    //   this.keyArray[1] = true;
    //   this.fetchMyhomeCompletedData(3)
    // } else if (key.indexOf(2) && !this.keyArray[2]) { //泥木阶段
    //   this.keyArray[2] = true;
    //   this.fetchMyhomeCompletedData(3)
    // } else if (key.indexOf(3) && !this.keyArray[3]) { //油漆阶段
    //   this.keyArray[3] = true;
    //   this.fetchMyhomeCompletedData(3)
    // } else if (key.indexOf(4) && !this.keyArray[4]) { //安装阶段
    //   this.keyArray[4] = true;
    //   this.fetchMyhomeCompletedData(3)
    // }
  }
  //展示各个阶段竣工数据
  displayData(item) {
    //console.log('ppppppppppppppppppppppppppppppp', item);
    let data = null;
    if (item) {
      const constructSitImg = item.constructSitImg.map((imgUrl, index) => {
        const key = index;
        return (
          <div
            className="completedImg"
            key={key}
            onClick={() => this.openSummaryImgView(item.constructSitImg, index)}
          >
            <img src={ResizeImg(imgUrl, '336', '192', '!')} alt="" />
          </div>
        );
      });
      const safeProtectionImg = item.safeProtectionImg.map((imgUrl, index) => {
        const key = index;
        return (
          <div
            className="completedImg"
            key={key}
            onClick={() => this.openSummaryImgView(item.safeProtectionImg, index)}
          >
            <img src={ResizeImg(imgUrl, '336', '192', '!')} alt="" />
          </div>
        );
      });
      data = (
        <div>
          <div className="itemInfo">
            <div className="infoTitle">照片说明</div>
            <div className="itemContent imgSwiper">
              <div className="imgContent">
                {
                  constructSitImg
                }
              </div>
            </div>
          </div>
          <div className="itemInfo">
            <div className="infoTitle">安全文明照片</div>
            <div className="itemContent imgSwiper">
              <div className="imgContent">
                {
                  safeProtectionImg
                }
              </div>
            </div>
          </div>
          <div className="itemInfo">
            <div className="infoTitle">工程总结</div>
            <div className="itemContent">{item.summary}</div>
          </div>
          <div className="itemInfo">
            <div className="infoTitle">完成时间</div>
            <div className="itemContent">{moment(item.submitTime).format('YYYY.MM.DD')}</div>
          </div>
        </div>
      );
    }
    return data;
  }
  // displaystepData(item, index) {
  //   return (
  //     <AccordionPanel
  //       header={this.displayTitle(index + 1)}
  //       key={index}>
  //       {this.displayData(item, index)}
  //     </AccordionPanel>
  //   );
  // }
  payPop() {
    const { f } = this.props;
    f({
      id: 3642
    });
    const topSize = document.documentElement.scrollTop || document.body.scrollTop;
    this.fixedFun.addFixed(topSize);

    const { stepList } = this.props.completed;
    const nodeId = stepList[stepList.length - 1].nodeId; //竣工nodeId
    console.log('this.props.completed', this.props.completed);
    const text = '恭喜竣工，确认验收合格后，支付尾款给家装公司';
    ModalAlert('', text, [
      { text: '取消', onPress: () => { this.fixedFun.removeFixed(); } },
      {
        text: '确定',
        onPress: () => {
          this.fixedFun.removeFixed();
          this.constructPayment(nodeId);
        }
      },
    ]);
  }
  render() {
    console.log('this.props', this.props);
    const { completed } = this.props;
    const { stepList: constructFirstVos } = completed;
    if (constructFirstVos.length === 0) {
      return null;
    }
    const buidingCircle = [];
    const paymentIsOut = constructFirstVos[constructFirstVos.length - 1].paymentIsOut || constructFirstVos[0].paymentIsOut;
    let payStatus = null;
    let iphoneXClassName = '';
    let iphoneXPadding = '';
    if (RSBrowser.iPhoneX) {
      iphoneXClassName = 'iphone-x';
      iphoneXPadding = 'iphoneXPadding';
    }
    if (paymentIsOut === 1) { //不显示支付按钮
      payStatus = null;
    } else if (paymentIsOut === 2) { //同意支付
      payStatus = (
        <div>
          <div className="bottom-Info">项目已竣工，支付尾款</div>
          <div className={`bottom-Btn ${iphoneXClassName}`} onClick={this.payPop}>同意支付</div>
        </div>);
    } else if (paymentIsOut === 3) { //已支付
      payStatus = <div className={`bottom-Btn payment ${iphoneXClassName}`}>支付完成</div>;
    }
    const stepElems = constructFirstVos.map((constructFirstVo, index, array) => {
      const key = index;
      let stepData = null;
      if (index === 0) {
        buidingCircle.push(moment(constructFirstVo.predictDate).format('YYYY.MM.DD'));
      }
      if (index === array.length - 1) {
        buidingCircle.push(moment(constructFirstVo.predictDate).format('YYYY.MM.DD'));
      }
      const headerElem = (
        <div className="item-title">
          <div className="item-number">{padStart(`${index + 1}`, 2, '0')}</div>
          <div className="item-word">{constructFirstVo.scheduleName}</div>
        </div>
      );
      if (index !== array.length - 1) {
        stepData = (
          <AccordionPanel
            header={headerElem}
            key={key}
          >
            {this.displayData(constructFirstVo.summaryVo)}
          </AccordionPanel>
        );
      }
      return stepData;
    });
    return (
      <div className={`completed-wrap ${iphoneXPadding}`}>
        <div className="completed-title">工程竣工验收报告</div>
        <div className="start-time">
          <div className="time-word">施工时间</div>
          <div className="time-value">
            {buidingCircle.join('-')}
          </div>
        </div>
        <div className="project-item">
          <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            {
              stepElems
            }
          </Accordion>
        </div>
        <div className="bottom">
          {payStatus}
        </div>
      </div>
    );
  }
}

const store = (state) => {
  const myHome = state.getIn(['buildingSites', 'myHome']).toJS();
  //const { completed } = myHome;
  return {
    //completed
    ...myHome
  };
};

export default connect(store)(MyHomeCompleted);
