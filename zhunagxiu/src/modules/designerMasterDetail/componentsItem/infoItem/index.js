import React , { Component } from 'react';
import * as Conifg from '../config'
import './style.scss'

export default class InfoItem extends Component {
  constructor(props){
    super(props)
  }


  render(){
    const {vals} = this.props
    const items = ()=>{
      if(vals[0] == 'caseBox'){
        return (
          <div className="caseBox">
            {
              vals[1].map((val,idx)=>{
                return(
                  <div className="caseItem" key={idx}>
                    <div className="casePic" style={{background:`url(${val.imgUrl}.750x420.png!) no-repeat`}}></div>
                    <div className="title">{val.title}</div>
                  </div>
                )
              })
            }
          </div>
        )
      }else{
        let contes = (data)=>{
          if(typeof data == "object"){
            return data.map((val,idx)=>{
               return (
                 <div key={idx}>
                   <div className="honorTitle">{val.awardName}</div>
                   <div className="honorContent">{val.awardDescription}</div>
                 </div>
               )
            })
          }else{
            return data
          }
        }
       let contents = vals[1] && contes(vals[1])
        return (
          <div className={vals[0]!="companyHonor"?"designerInfoItem":"designerInfoItem lastItem"}>
            <div className="itemTitle">
              <span></span>
              <div>{Conifg.designerInfoItem[vals[0]]}</div>
            </div>
            <div className="itemText">
              {contents}
              <input type="checkbox"  id={vals[0]}/>
              <label htmlFor={vals[0]}>123</label>
            </div>
          </div>
        )
      }
    }
    const _items = items()

    return(
      <div>
        {_items && _items}
      </div>
    )
  }






}
