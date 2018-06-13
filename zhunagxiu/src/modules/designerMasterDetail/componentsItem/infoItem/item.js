import React , { Component } from 'react';
import * as Conifg from '../config'
import './style.scss'

export default class InfoItem extends Component {
  constructor(props){
    super(props)
  }


  render(){
    const {vals,type} = this.props

    console.log(typeof vals)
    console.log(vals)


    const item = ()=>{
      if(type == "caseBox"){


      }else if(type == "personalHonor"){
        return(
          <div className="designerInfoItem">
            <div className="itemTitle">
              <span></span>
              <div>{Conifg.designerInfoItem[type]}</div>
            </div>
            <div className="itemText">
              {vals}
              <input type="checkbox"  id={type}/>
              <label htmlFor={type}>123</label>
            </div>
          </div>
        )
      }else if(type == "honorVos"){
        return(
          <div className="designerInfoItem">
            <div className="itemTitle">
              <span></span>
              <div>{Conifg.designerInfoItem[type]}</div>
            </div>
            <div className="itemText">
              {
                [...vals].map((val,idx)=>{
                  return (
                    <div key={idx}>
                      <div className="honorTitle">{val.awardName}</div>
                      <div className="honorContent">{val.awardDescription}</div>
                    </div>
                  )
                })
              }
              <input type="checkbox"  id={type}/>
              <label htmlFor={type}>123</label>
            </div>
          </div>
        )
      }


    }

    const _item = item()
    return(
      <div>
        {_item}
      </div>
    )
  }



}
