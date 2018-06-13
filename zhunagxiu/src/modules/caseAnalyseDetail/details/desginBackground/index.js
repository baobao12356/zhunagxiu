import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './style.scss';

export default class DesginBackgrund extends Component {

  init() {
    if (this.plot) {
      this.plot.innerHTML = this.plot.innerHTML.substring(0, 8);
    }
  }

  componentDidUpdate() {
    this.init()
  }

  render() {
    const { detailInfo } = this.props;
    const { buildingName, costOfLabor, materialsExpenses, softExpenses, designNote } = detailInfo;
    return (
      <div className="desgin-background-comp">
        <h2>
          <span className='cut'></span>
          <span className='title'>设计背景</span>
        </h2>
        <div className='desgin-background-info'>
          {buildingName ? <div className='info-plot'>小区名称：<span ref={(plot) => { this.plot = plot }}>{buildingName}</span></div> : ''}
          {costOfLabor ? <div className='info-labour-cost'>人工费用：<span>{costOfLabor}</span></div> : ''}
          {materialsExpenses ? <div className='info-building-cost'>建材费用：<span>{materialsExpenses}</span></div> : ''}
          {softExpenses ? <div className='info-soft-cost'>软装费用：<span>{softExpenses}</span></div> : ''}
        </div>
        <div className='desgin-background-note'>
          {designNote ? <div className='info-explain'>设计说明：<span>{designNote}</span></div> : ''}
        </div>
      </div>
    )
  }
}
