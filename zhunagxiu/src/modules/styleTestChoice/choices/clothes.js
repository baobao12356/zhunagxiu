/**
 * Created by feifei on 2017/9/17.
 */
import React from 'react';
import cs from 'classnames';
import '../style.scss';
import Host from '../../../lib/scripts/config_host';
import clothesWord from '../img/clotherTitle.png';


export default class Clothes extends React.Component {
  constructor(props) {
    super(props);
    let _this = this;
    _this.state = {
      shadowPagePercentageArr:[],
      shadowPagePercentage:'0%',
      shadowHide:true,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      clothesHide:nextProps.clothesHide
    })
    if(nextProps.clothesPercentage !== undefined){
      this.setState({
        shadowPagePercentageArr:nextProps.clothesPercentage
      })
    }
  }

  onClickOption(val,key){
    //key = key+1;
    sessionStorage.setItem('dressingId',key);
    this.setState({
      shadowHide:false,
      shadowPagePercentage:val
    })
    document.getElementsByTagName('html')[0].setAttribute("class", "overHidden");
    setTimeout(()=>{
      //跳转下一 h6 测试页面
      window.location = '/mainapp/styleTestImgs.html';
    },2000)

  }

  render() {
    //let clothesList = [];
    //if(this.state.shadowPagePercentageArr) {
    //  this.state.shadowPagePercentageArr.map((val, idx)=> {
    //    clothesList.push(
    //        <div key={idx} onClick={this.onClickOption.bind(this,val,idx)}></div>
    //    )
    //  })
    //}
    return (
      <div className={cs({'clothesPage':true,"hide":this.state.clothesHide})}>
        <div className={cs({"shadowPage":true,'shadowHide':this.state.shadowHide})}>
          <div>
            {this.state.shadowPagePercentage}
            <p>用户也选择了此答案</p>
          </div>
        </div>
        <div className={cs({"clothesTitle":true,"hide":this.props.huoseWord})}><img src={clothesWord}/></div>
        <div className="clothesBox">
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[0],1)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[1],2)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[2],3)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[3],4)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[4],5)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[5],6)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[6],7)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[7],8)}></div>
        </div>
      </div>
    )
  }

}
