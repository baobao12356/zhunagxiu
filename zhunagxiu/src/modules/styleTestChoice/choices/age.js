/**
 * Created by feifei on 2017/9/17.
 */
import React from 'react';
import cs from 'classnames';
import '../style.scss';
import ageTitle from '../img/ageTitle.png'

export default class Age extends React.Component {
  constructor(props) {
    super(props);
    let _this = this;
    _this.state = {
      shadowPagePercentageArr:[],
      shadowPagePercentage:'0%',
      shadowHide:true,
      ageHide:false,
    }
  }

  componentWillReceiveProps(nextProps){
    //this.setState({
    //  shadowPagePercentageArr:nextProps.agePercentage
    //})
    if(nextProps.agePercentage !== undefined){
      this.setState({
        shadowPagePercentageArr:nextProps.agePercentage
      })
    }
  }


  onClickOption(val,key){
    sessionStorage.setItem('ageId',key);
    event.preventDefault();
    this.setState({
      shadowHide:false,
      shadowPagePercentage:val,
    })
    setTimeout(()=>{
      //this.setState({
      //  shadowHide:true,
      //})
      //调用父级传过来的函数，改变houseType状态
      this.props.changeState(1,0);
      this.setState({
        ageHide:true
      })
    },2000)
    this.props.bigData("110.300.49.58.68.78.44","p_quitdecorationTest2");
  }

  render() {
    //let ageList = [];
    //
    //if(this.state.shadowPagePercentageArr){
    //  let shadowPagePercentageArrLength = this.state.shadowPagePercentageArr.length;
    //  this.state.shadowPagePercentageArr.map((val,idx)=>{
    //    ageList.push(
    //      <div key={idx} onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[idx],idx)}></div>
    //    )
    //  })
    //}

    return (
      <div className={cs({'ageHeight':true,'hide':this.state.ageHide})}>
        <div className={cs({"shadowPage":true,"shadowHide":this.state.shadowHide})}>
          <div>
            {this.state.shadowPagePercentage}
            <p>用户也选择了此答案</p>
          </div>
        </div>
        <div className="ageTitle"><img src={ageTitle}/></div>
        <div className="ageBox">
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[0],1)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[1],2)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[2],3)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[3],4)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[4],5)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[5],6)}></div>
        </div>
      </div>
    )
  }

}
