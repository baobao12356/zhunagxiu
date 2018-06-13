import React from 'react';
import LazyLoad from 'react-lazy-load';
import TableComp from './TableComp';
import './style.scss';

export default class RowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counts: 0,
      imageUrl: "",
      imageUrls: [],
      objectName: "",
      typeId: "",
      num: 0,
      displaySpan: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      counts: nextProps.data.counts,
      imageUrl: nextProps.data.imageUrl,
      imageUrls: nextProps.data.imageUrls,
      objectName: nextProps.data.objectName,
      typeId: nextProps.data.typeId,
      num: nextProps.num
    })
  }

  onClickPic(num, idx) {
    this.props.clickPic(num, idx)
  }

  componentItem() {

    const Imgs1 = (data) => (<div className="picBox">
      <h3>{data.data.objectName}</h3>
      <div className="picAuto" onClick={this.onClickPic.bind(this, data.num, 1)}>
        <LazyLoad height={195}>
          <img src={`${data.data.imageUrl}!`} alt="" />
        </LazyLoad>
      </div>
      <p className="picText">{data.data.imageDesc}</p>
      {data.data.productVos && data.data.productVos.length ? <TableComp productVos={data.data.productVos} /> : ''}
    </div>)

    const Imgs2 = (data) => (<div className="picBox">
      <h3>{data.data.objectName}</h3>
      <div className="picAuto" onClick={this.onClickPic.bind(this, data.num, 1)}>
        <LazyLoad height={195}>
          <img src={`${data.data.imageUrls[0]}!`} alt="" />
        </LazyLoad>
      </div>
      <div className="picAuto" onClick={this.onClickPic.bind(this, data.num, 2)}>
        <LazyLoad height={195}>
          <img src={`${data.data.imageUrls[1]}!`} alt="" />
        </LazyLoad>
      </div>
      <p className="picText">{data.data.imageDesc}</p>
      {data.data.productVos && data.data.productVos.length ? <TableComp productVos={data.data.productVos} /> : ''}
    </div>)

    const Imgs3 = (data) => (<div className="picBox">
      <h3>{data.data.objectName}</h3>
      <div onClick={this.onClickPic.bind(this, data.num, 1)} style={{ 'backgroundImage': `url(${data.data.imageUrls[0]}!)` }}></div>
      <div className="smallPic">
        <div onClick={this.onClickPic.bind(this, data.num, 2)} style={{ 'backgroundImage': `url(${data.data.imageUrls[1]}!)` }}></div>
        <div onClick={this.onClickPic.bind(this, data.num, 3)} style={{ 'backgroundImage': `url(${data.data.imageUrls[2]}!)` }}></div>
      </div>
      <p className="picText">{data.data.imageDesc}</p>
      {data.data.productVos && data.data.productVos.length ? <TableComp productVos={data.data.productVos} /> : ''}
    </div>)

    const Imgs4 = (data) => (<div className="picBox">
      <h3>{data.data.objectName}</h3>
      <div onClick={this.onClickPic.bind(this, data.num, 1)} style={{ 'backgroundImage': `url(${data.data.imageUrls[0]}!)` }}></div>
      <div className="smallPic">
        <div onClick={this.onClickPic.bind(this, data.num, 2)} style={{ 'backgroundImage': `url(${data.data.imageUrls[1]}!)` }}></div>
        <div onClick={this.onClickPic.bind(this, data.num, 3)} style={{ 'backgroundImage': `url(${data.data.imageUrls[2]}!)` }}>
          <span className="shadow">{data.data.counts}+</span>
        </div>
      </div>
      <p className="picText">{data.data.imageDesc}</p>
      {data.data.productVos && data.data.productVos.length ? <TableComp productVos={data.data.productVos} /> : ''}
    </div>)
    return (
      (() => {
        if (this.props.data.counts == 1) {
          return (Imgs1(this.props))
        } else if (this.props.data.counts == 2) {
          return (Imgs2(this.props))
        } else if (this.props.data.counts == 3) {
          return (Imgs3(this.props))
        } else if (this.props.data.counts > 3) {
          return (Imgs4(this.props))
        }
      })()
    )
  }

  render() {
    const arr = this.componentItem();
    return (
      <div>
        {arr}
      </div>
    )
  }
}
