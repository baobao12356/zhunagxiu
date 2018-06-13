import React, { Component } from 'react';
import './style.scss';

export default class TableComp extends Component {
  constructor(props) {
    super(props);
    this.handMore = this.handMore.bind(this);
  }

  handMore(e) {
    const box = e.target.parentNode;
    const trList = box.getElementsByClassName('table-tr');
    if (e.target.className == 'more') {
      for (let i = 0; i < trList.length; i++) {
        trList[i].style.display = 'block';
      }
      e.target.className = '';
      e.target.className = 'more-up'
      e.target.innerHTML = '收起<i></i>'
    } else if (e.target.className == 'more-up') {
      for (let i = 0; i < trList.length; i++) {
        if (i > 3) {
          trList[i].style.display = 'none';
        }
      }
      e.target.className = '';
      e.target.className = 'more'
      e.target.innerHTML = '更多<i></i>'
    }
  }

  render() {
    const { productVos } = this.props
    const title = productVos[0].fstCategoryName;
    const trList = productVos.map((tr, id) => (
      <div className="table-tr" key={id}>
        <div className="table-td">{tr.productName}</div>
        <div className="table-td">{tr.brandName}</div>
        <div className="table-td">{tr.productPrice}</div>
        <div className="table-td">{tr.priceUnit}</div>
      </div>
    ))
    const more = productVos.length > 4 ? <div className="more" onClick={this.handMore}>更多<i></i></div> : '';
    return <div className="table-comp">
      <div className="table-box">
        <div className="table-th">
          <div className="table-td">名称</div>
          <div className="table-td">品牌</div>
          <div className="table-td">价格</div>
          <div className="table-td">单位</div>
        </div>
        {trList}
        {more}
      </div>
    </div>
  }
}
