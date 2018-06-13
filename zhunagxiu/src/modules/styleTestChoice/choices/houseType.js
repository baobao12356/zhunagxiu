/**
 * Created by feifei on 2017/9/17.
 */
import React from 'react';
import cs from 'classnames';
import '../style.scss'
import huoseTitle from '../img/huoseTitle.png'

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
    console.log(nextProps)
    this.setState({
      houseTypeHide:nextProps.houseTypeHide
    })
    if(nextProps.housePercentage !== undefined){
      this.setState({
        shadowPagePercentageArr:nextProps.housePercentage
      })
    }
  }


  onClickOption(val,key){
    sessionStorage.setItem('houseId',key);
    this.setState({
      shadowHide:false,
      shadowPagePercentage:val
    })
    document.getElementsByTagName('html')[0].setAttribute("class", "overHidden");

    setTimeout(()=>{
      this.setState({
        houseTypeHide:true,
      })
      console.log(this.props)
      this.props.changeState(0,1);
      document.getElementsByTagName('html')[0].removeAttribute("class", "overHidden");
      window.scrollTo(0,0);
    },2000)
    this.props.bigData("110.300.49.58.68.79.39","p_quitdecorationTest3");
}

  render() {
    //let houseList = [];
    //if(this.state.shadowPagePercentageArr){
    //this.state.shadowPagePercentageArr.map((val, idx)=> {
    //  houseList.push(
    //      <div key={idx} onClick={this.onClickOption.bind(this,val,idx)}></div>
    //  )
    //})
    //}
    return (
      <div className={cs({'housePage':true,"hide":this.state.houseTypeHide})}>
        <div className={cs({"shadowPage":true,'shadowHide':this.state.shadowHide})}>
          <div>
            {this.state.shadowPagePercentage}
            <p>用户也选择了此答案</p>
          </div>
        </div>
        <div className= {cs({"houseTitle":true,"hide":this.props.huoseWord})}><img src={huoseTitle}/></div>
        <div className="houseTypeBox">
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[0],1)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[1],2)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[2],3)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[3],4)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[4],5)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[5],6)}></div>
          <div onClick={this.onClickOption.bind(this,this.state.shadowPagePercentageArr[6],7)}></div>
          <p></p>
        </div>
      </div>
    )
  }

}
