import React,{Component} from 'react'
import './style.scss'
import cs from 'classnames'

export default class Dialog extends Component{
  constructor(props){
    super(props)

    console.log(this)
  }

  componentWillUnmount(){
    // clearTimeout(this.timer)
  }

  render(){
    return(
      <div className={cs({"dialog":true,"showDialog":this.props.isShow})}>
        <div>{this.props.msgs}</div>
      </div>
    )
  }


}
