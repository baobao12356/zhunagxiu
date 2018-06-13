/**
 * Created by junwei.yin on 2017/6/6.
 */
import React from 'react';
import './style.scss';
import ReactDOM from 'react-dom';

  export default class CasesDesc extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      designNote:""
    }

  }

  componentDidMount(){
    // ReactDOM.findDOMNode(this).lastChild.style.height='auto'
    // console.log(ReactDOM.findDOMNode(this).lastChild.style.-webkit-line-clamp)
    // ReactDOM.findDOMNode(this).lastChild.offsetHeight
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      designNote:nextProps.detailInfo.designNote
    })

  }

  render(){
    return(
    <div className="caseDesc">
      <h3>案例描述</h3>
      <input type="checkbox"  id="more"/>
      <div className="content">{this.state.designNote}</div>
      <label htmlFor="more"></label>
    </div>
      )


  }

}
