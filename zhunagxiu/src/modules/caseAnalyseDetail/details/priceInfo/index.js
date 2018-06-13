/**
 * Created by junwei.yin on 2017/6/6.
 */
import React from 'react';
import './style.scss';
export default class PriceInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      houseTypeStr: '',
      area: '',
      designStyleStr: '',
      prices: '',
      buildingName: '',
      cost: '',
      title: '',
      tag: ''
    }

  }
  componentWillReceiveProps(nextProps) {
    if (typeof (nextProps.detailInfo.costList) != "undefined") {
      let price1, price2
      nextProps.detailInfo.costList.map((item, index) => {
        if (item.split(":")[0] == "主材") {
          price1 = item.split(":")[1]
        }
        if (item.split(":")[0] == "工程费用") {
          price2 = item.split(":")[1]
        }
      })
      if (price1 && price2) {
        this.setState({
          prices: (Number(price1) + Number(price2)).toFixed(2),
          cost: '全包造价'
        })
      } else if (price1 && price2 == "") {
        this.setState({
          prices: price1,
          cost: '半包造价'
        })
      } else {
        this.setState({
          prices: "",
          cost: ""
        })
      }
    }
    this.setState({
      houseTypeStr: nextProps.detailInfo.houseTypeStr + "/" || "",
      area: nextProps.detailInfo.area + "/" || "",
      designStyleStr: nextProps.detailInfo.designStyleStr || "",
      buildingName: nextProps.detailInfo.buildingName || "",
      title: nextProps.detailInfo.title || '',
      tag: nextProps.detailInfo.style || '',
      tag2: nextProps.detailInfo.house || ''
    })

  }

  render() {
    return (
      <div className="priceInfo">
        <div className="case_title">
          {
            this.state.title
          }
        </div>
        <div className="case_tag">
          <b>{
            this.state.tag
          }</b>
          <b className="cate">|</b>
          <b>{
            this.state.tag2
          }</b>
        </div>
        {/*<div className="pItop">
          {
            this.state.houseTypeStr+this.state.area+this.state.designStyleStr
          }
          <span className="price">{this.state.prices}</span>
        </div>
        <div className="pIdown">
          <span>{this.state.buildingName}</span>
          <span>{this.state.cost}</span>
        </div>*/}
      </div>
    )


  }

}
