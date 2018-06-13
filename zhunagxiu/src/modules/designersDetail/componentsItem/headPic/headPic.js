import React ,{Component} from 'react';
import cs from 'classnames'
import './style.scss'
import {SIZE} from '../config'
import HeaderUrl from '../../img/admin1.png'

export default class HeadPic extends Component{
  constructor(props){
    super(props)

  }

  componentWillReceiveProps(nextProps){
  }

  render(){
    const {imgUrl,clsName,sizeIdx} = this.props
    this.style = {
      background:`url(${HeaderUrl}) no-repeat center`,
      height:SIZE[sizeIdx],
      width:SIZE[sizeIdx]
    }

    return (
      <div className={cs("headPic",clsName)} style = {this.style}>
        {!!imgUrl &&
        <img src={imgUrl+`.300x300.png!`}  />
        }
        
      </div>
    )
  }



}
