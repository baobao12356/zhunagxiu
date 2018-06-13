import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import Cookies from 'js-cookie';
import QueryString from 'query-string';
import Host from '../../lib/scripts/config_host';
import Nav from '../../lib/components/nav';
import disLikeImg from './img/disLike.png';
import { styleData, timeData, moneyData } from './choiceData';
import './style.scss';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = QueryString.parse(location.search);
    this.source = params.source;
    this.chooseStyle = this.chooseStyle.bind(this);
    this.chooseTime = this.chooseTime.bind(this);
    this.chooseMoney = this.chooseMoney.bind(this);
    this.chooseSex = this.chooseSex.bind(this);
    this.getArrayItems = this.getArrayItems.bind(this);
    this.forwardNextPage = this.forwardNextPage.bind(this);
    this.state = {
      randomStyleData: [],
      styleIndex: -1,
      styleValue: '',
      timeIndex: -1,
      timeValue: '',
      moneyIndex: -1,
      moneyValue: '',
      sexIndex: -1,
      sexValue: ''
    }
  }

  componentDidMount() {
    //var item =[1,2,3,4,5,6,7,8,9];
    //console.log('随机数',this.getArrayItems(styleData, 5))
    const randomStyleData = this.getArrayItems(styleData, 5);
    this.setState({
      randomStyleData: randomStyleData
    });
  }
  chooseStyle(name) {
    this.setState({
      //styleIndex: index,
      styleValue: name
    });
  }
  chooseTime(item) {
    this.setState({
      //timeIndex: index,
      timeValue: item.id
    });
  }
  chooseMoney(item) {
    this.setState({
      //moneyIndex: index,
      moneyValue: item
    });
  }
  chooseSex(index) {
    this.setState({
      sexIndex: index,
      sexValue: index == 1 ? "先生" : "女士"
    });
  }
  forwardNextPage() {
    const {styleValue, timeValue, moneyValue, sexValue} = this.state;
    if(!(styleValue&&timeValue&&moneyValue&&sexValue)) {
      this.button.disabled = true;
    } else {
      let selectedData = {};
      selectedData.styleValue =styleValue;
      selectedData.timeValue =timeValue;
      selectedData.moneyValue =moneyValue;
      selectedData.sexValue =sexValue;
      console.log(selectedData);
      localStorage.setItem('selectedData', JSON.stringify(selectedData));

     window.location = `${Host.path}/mainapp/designConsultancyAT.html?source=${this.source}&back=h5&__open=1`;
     //window.location = `http://192.168.223.78:9000/designConsultancyAT.html?source=${this.source}&back=h5&__open=1`;
    }
  }
  //从数组中随机选取num个元素
  getArrayItems(arr, num) {
    let temp_array = arr.map((item) => {
      return item;
    });
    let return_array = [];
    for (let i = 0; i < num; i++) {
      if (temp_array.length > 0) {
        let arrIndex = Math.floor(Math.random() * temp_array.length);
        return_array[i] = temp_array[arrIndex];
        temp_array.splice(arrIndex, 1);
      } else {
        break;
      }
    }
    return return_array;
  }

  render() {
    const { styleValue, timeValue, moneyValue, sexIndex, sexValue, randomStyleData } = this.state;
    const btnStatus = styleValue && timeValue && moneyValue && sexValue ? true : false;
    const style = randomStyleData.map((item, index) => {
      return <div className="styleItem" key={index} onClick={() => { this.chooseStyle(item.name) }}>
        <div className="styleImg"><img src={item.imgUrl} /><div className={cs({ "chosedStyle": styleValue == item.name })}></div></div>
        <div className="styleName">{item.name}</div>
      </div>
    });
    const time = timeData.map((item, index) => {
      return <div className={cs({ "boxItem": true, "choosedTime": timeValue == item.id })} key={index}
        onClick={() => { this.chooseTime(item) }}
      >{item.name}</div>
    });
    const money = moneyData.map((item, index) => {
      return <div className={cs({ "boxItem": true, "choosedMoney": moneyValue == item })} key={index}
        onClick={() => { this.chooseMoney(item) }}
      >{item}</div>
    });
    return (
      <div className={cs({ 'pageWrap': true, 'ios-top': Env.ios && Env.rsApp, 'img-center': true })}>
        <Nav title="设计咨询" shareIcon={false} />
        <div className="testBox">
          <div className="testBox-title"></div>
          <div className="testBox-Content">
            <div className="styleBox">
              <div className="styleTitle"></div>
              <div className="styleContent">
                {style}
                <div className="styleItem" onClick={() => { this.chooseStyle("都不喜欢") }}>
                  <div className="styleImg noLike">
                    <div className="imgBox"><img src={disLikeImg} /></div>
                    <div className={cs({ "chosedStyle": styleValue == "都不喜欢" })}></div>
                  </div>
                  <div className="styleName">都不喜欢</div>
                </div>
              </div>
            </div>
            <div className="timeBox">
              <div className="timeTitle"></div>
              <div className="timeContent">
                {time}
              </div>
            </div>
            <div className="moneyBox">
              <div className="moneyTitle"></div>
              <div className="moneyContent">
                {money}
              </div>
            </div>
            <div className="sexBox">
              <div className="sexTitle"></div>
              <div className="sexContent">
                <div className={cs({ "men": true, "choosedBox": sexIndex == 1 })} onClick={() => { this.chooseSex(1) }}>
                  <div className={cs({ "menImg": true, "choosedMen": sexIndex == 1 })}></div>
                </div>
                <div className={cs({ "women": true, "choosedBox": sexIndex == 2 })} onClick={() => { this.chooseSex(2) }}>
                  <div className={cs({ "womenImg": true, "choosedWomen": sexIndex == 2 })}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={cs({ "testBox-btn": true, "active-btn": btnStatus })}
          ref={(button) => { this.button = button; }} onClick={this.forwardNextPage} >下一步</div>
        </div>
      </div>

    );
  }
}
