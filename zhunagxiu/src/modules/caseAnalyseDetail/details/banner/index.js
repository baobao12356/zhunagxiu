/**
 * Created by junwei.yin on 2017/6/6.
 */
import React from 'react';
import './style.scss';
import cs from 'classnames';
import Env from 'rs-browser';

export default class Banner extends React.Component{
  constructor(props){
    super(props)

  }
  componentWillReceiveProps(nextProps){
    this.styles = {
      background:`url(${nextProps.detailInfo.caseImgUrl}.750x410.png!) 50% 50% no-repeat`,
    }
  }
  render(){

    return  (
          <div  className={cs({"banner":true})} style={this.styles}>
            {/*<div>{this.props.detailInfo.title}</div>*/}
          </div>
    )
  }

}
