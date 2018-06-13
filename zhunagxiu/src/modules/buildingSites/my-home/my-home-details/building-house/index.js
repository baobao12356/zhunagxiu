import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import { Accordion, List, WingBlank, Modal } from 'antd-mobile';
import { buildingSitesMyhomeFetchFirstStepInfoById,
         buildingSitesMyhomeConstructionAgreePay } from '../../../../../actions';
import './style.scss';

const Item = List.Item;
const alert = Modal.alert;
const AccordionPanel = Accordion.Panel;

class BuildingHouse extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isDisabled: 0
    };
    this.modelWords = [];
    this.modelObj = {};
  }

  componentDidMount() {
    const { myHomeInfo, p } = this.props;
    p && p({
      id: 3632
    });
    const constructId = myHomeInfo.constructId || queryString.parse(location.href.split('?')[1]).id;
    this.fetchMyhomeItemFirstData(constructId);
  }

  async fetchMyhomeItemFirstData(constructId) {
    const { dispatch } = this.props;
    const action = await buildingSitesMyhomeFetchFirstStepInfoById(constructId);
    dispatch(action);
  }

  onChange = (key) => {
    console.log(key);
  }

  toConstructionDetail = (nodeId, nodeName) => {
    const { f } = this.props;
    f && f({
      id: 3634
    });
    window.location.href = `buildingSites.html?type=detail&id=${nodeId}&name=${nodeName}&__open=1`;
  }

  agreePay(nodeId, step1) {
    const { myHomeInfo } = this.props;
    const constructId = myHomeInfo.constructId;
    const step2Index = this.modelWords.indexOf(step1);
    //最后一个阶段且不为竣工阶段
    const step2 = this.modelWords[step2Index + 1] || '下一';
    const arr = [
      '付款成功后，您的装修项目即可正式开工',
      `${step1}已验收合格，付款成功后，您将进入${step2}阶段`,
      '恭喜竣工，确认验收合格后，支付尾款给家装公司'
    ];
    const confirmWord = () => {
      switch (nodeId) {
        case 1:
          return arr[0];
          // break;
        case 7:
          return arr[2];
          // break;
        default:
          return arr[1];
      }
    };
    alert('', confirmWord(), [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: this.constructPayment.bind(this, constructId, nodeId) }
    ]);
    // console.log(nodeId, step1, this.modelWords, step2Index, step2);
  }

  async constructPayment(constructId, nodeId) {
    const { dispatch } = this.props;
    const action = await buildingSitesMyhomeConstructionAgreePay(constructId, nodeId);
    dispatch(action);
    const { constructPayment } = this.props;
    this.state.isDisabled = nodeId;
    // console.log('11111111' + constructPayment.data);
    if (constructPayment.data === '200') {
      this.fetchMyhomeItemFirstData(constructId);
      this.state.isDisabled = 0;
    }
  }

  render() {
    const { construction, constructionItem } = this.props;
    const { companyName, logo, startDate, endDate, constructFirstVos, contractAmount } = construction;
    const { isDisabled } = this.state;

    const constructFirstVosList = constructFirstVos && constructFirstVos.map((val) => {
      const predictDateM = moment(val.predictDate).format('YYYY.MM.DD');
      return (
        <div className="schedule-item" key={val.nodeId}>
          <span className="title">{val.scheduleName}</span>
          <span className="content">预计完成时间：{predictDateM}</span>
        </div>
      );
    });

    const constructionItemList = !!Object.keys(constructionItem).length && constructionItem.map((val, idx) => {
      //去重
      if (!this.modelObj[val.nodeName]) {
        this.modelObj[val.nodeName] = 1;
        this.modelWords.push(val.nodeName);
      }

      const itemSecondVoList = val.itemSecondVo && val.itemSecondVo.map((item) => {
        const styleName = item.resultStatus === 1 ? '' : 'red';
        return (
          <Item
            key={item.id}
            extra={<div className={styleName}>{item.resultStatusStr}</div>}
            onClick={() => this.toConstructionDetail(item.id, item.twoNodeName)}
            arrow="horizontal"
          >
            {item.twoNodeName}
          </Item>
        );
      });

      const isDisabledValue = (isDisabled === val.nodeId || val.paymentIsOut === 3);
      const paymentClass = isDisabledValue ? 'disabled' : '';
      const paymentWord = isDisabledValue ? '支付完成' : '同意支付';
      const paymentTip = isDisabledValue ? '' : `${val.nodeName}阶段验收完成，您将进入下一阶段`;

      const payOrNot = (val.paymentIsOut === 2 || val.paymentIsOut === 3) &&
        <Item
          className="agree-pay"
          extra={<button
            className={paymentClass}
            onClick={() => this.agreePay(val.nodeId, val.nodeName)}
            disabled={isDisabledValue}
          >{paymentWord}</button>}
        >
          {paymentTip}
        </Item>;

      const predictDateM = val.predictDate ? moment(val.predictDate).format('YYYY.MM.DD') : '待定';
      const submitDateM = val.submitDate ? moment(val.submitDate).format('YYYY.MM.DD') : '待定';

      const headerTime = val.resultStatus === 1 ? `完成时间：${submitDateM}` : `预计完成时间：${predictDateM}`;

      return (
        <Accordion defaultActiveKey={idx.toString()} key={val.nodeId} onChange={this.onChange}>
          <AccordionPanel header={<div className="flow-header-title">{val.nodeName}</div>}>
            <div className="flow-header-time">{headerTime}</div>
            <List className="flow-path-list">
              {itemSecondVoList}
              {payOrNot}
            </List>
          </AccordionPanel>
        </Accordion>
      );
    });

    const logoIn = !!logo && <img className="logo" src={logo} alt="logo" />;
    const startDateM = startDate ? moment(startDate).format('YYYY.MM.DD') : '待定';
    const endDateM = endDate ? moment(endDate).format('YYYY.MM.DD') : '待定';
    const contractAmountM = contractAmount ? contractAmount.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : '';

    return (
      <div className="building-house">
        <WingBlank>
          <Accordion defaultActiveKey="0" className="contract" onChange={this.onChange}>
            <AccordionPanel header="合同信息">
              <List className="contract-list">
                <Item extra={<div>{logoIn}{companyName}</div>}>签约公司</Item>
                <Item extra={<div>{contractAmountM}元</div>}>合同金额</Item>
                <Item className="no-border">施工计划时间表</Item>
                <Item wrap className="schedule">
                  <div className="schedule-item">
                    <span className="title">总施工时间</span>
                    <span className="content">{startDateM}-{endDateM}</span>
                  </div>
                  {constructFirstVosList}
                </Item>
              </List>
            </AccordionPanel>
          </Accordion>

          <div className="flow-path">
            <div className="layer" />
            {constructionItemList}
          </div>

        </WingBlank>

      </div>
    );
  }
}


const store = (state) => {
  const myHome = state.get('buildingSites').get('myHome').toJS();
  console.log('ttttt', myHome);
  return {
    ...myHome
  };
};

export default connect(store)(BuildingHouse);
