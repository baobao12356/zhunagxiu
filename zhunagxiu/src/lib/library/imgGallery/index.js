/*
 | imagelist         | array      | 要预览的图片列表 | 是 | 无 |
 | current         | number      | 当前展示的图片序号（从0开始） | 否 | 0 |
 | close         | function      | 图片查看器关闭方法 | 是 | |
 | gap         | number      | 轮播图间距 | 否 | 30 |
 | maxScale         | number      | 最大缩放倍数 | 否 | 2 |
 | disablePinch      | bool       | 禁用缩小放大 | 否 | false |
 | enableRotate     | bool       | 启用旋转 | 否(默认关闭) | false |
 | disableDoubleTap  | bool       | 禁用双击放大 | 否 | false |
 | initCallback           | function   | 初始化后回调 | 否 | |
 | longTap           | function   | 长按回调 | 否 | |
 | movedCurrent(idx)           | function(idx)   | 轮播后回调 idx 图片索引 | 否 | |
 | onSingleTap           | function   | 组件单机事件 |否|
 | addPage| number| 除了图片外新增的滑动页面数量|否
 | noMark| Bool| 图片水印 非必填
*/

import React, { Component } from 'react';
import AlloyFinger from './libs/alloyfinger.js';
import Transform from './libs/transform.js';
import { CenterImage } from './components.js';
import Singleton from 'react-singleton';

import './style.scss';

const MARGIN = 30;

class ImageView extends Component {
  static defaultProps = {
    gap: MARGIN,
    current: 0,
    disablePageNum: false,
    desc: '',
    maxScale: 2
  }

  static propTypes = {
    gap: React.PropTypes.number,
    maxScale: React.PropTypes.number,
    current: React.PropTypes.number,
    imagelist: React.PropTypes.array.isRequired,
    disablePageNum: React.PropTypes.bool,
    disablePinch: React.PropTypes.bool,
    enableRotate: React.PropTypes.bool,
    disableDoubleTap: React.PropTypes.bool,
    longTap: React.PropTypes.func,
    close: React.PropTypes.func.isRequired,
    changeIndex: React.PropTypes.func,
    initCallback: React.PropTypes.func
  }

  constructor(props) {
    super();
    this.state = {
      current: props.current,
      imagelist: props.imagelist,
      arrLength: props.addPage ? props.imagelist.length + props.addPage : props.imagelist.length
    };
  }

  initScale = 1;
  screenWidth = window.innerWidth || window.screen.availWidth;
  screenHeight = window.innerHeight || window.screen.availHeight;
  list = null;
  ob = null;
  focused = null;

  render() {
    const { desc, disablePageNum, children, gap, noMark} = this.props;
      //console.log(children);
    return (
      <div className="imageview">
        <AlloyFinger
          onSingleTap={this.onSingleTap.bind(this)}
          onPressMove={this.onPressMove.bind(this)}
          onSwipe={this.onSwipe.bind(this)}
        >
          <ul ref="imagelist" className="imagelist">
            {
                        this.state.imagelist.map((item, i) => (
                          <li className="imagelist-item" style={{ marginRight: `${gap}px`}} key={`img${i}`}>
                            <AlloyFinger
                              onPressMove={this.onPicPressMove.bind(this)}
                              onMultipointStart={this.onMultipointStart.bind(this)}
                              onLongTap={this.onLongTap.bind(this)}
                              onPinch={this.onPinch.bind(this)}
                              onRotate={this.onRotate.bind(this)}
                              onMultipointEnd={this.onMultipointEnd.bind(this)}
                              onDoubleTap={this.onDoubleTap.bind(this)}
                            >
                              <CenterImage id={`view${i}`} className="imagelist-item-img" lazysrc={noMark ? `${item}!` : item} index={i} current={this.state.current}/>
                            </AlloyFinger>
                          </li>
                            ))
                    }
            <li className="imagelist-item" style={{ marginRight: `${gap}px`}} >
              {children }
            </li>
          </ul>
        </AlloyFinger>
        {
                    disablePageNum ? null : <div className="page" ref="page">{ this.state.current + 1 } / { this.state.arrLength }</div>
                }
        {
                    desc ? <div dangerouslySetInnerHTML={{__html: desc}} /> : null
                }
      </div>
    );
  }
  componentWillReceiveProps(nextProps) {
    let diff = false;
    const oldLen = this.props.imagelist.length;
    const newLen = nextProps.imagelist;
    if (oldLen != newLen) {
      diff = true;
    } else if (oldLen == newLen) {
      for (let i = 0; i < oldLen; i++) {
        if (this.props.imagelist[i] != nextProps.imagelist[i]) {
          diff = true;
          break;
        }
      }
    }
    if (diff) {
      //console.log('执行componentWillReceiveProps111');
      let { current } = this.state,
        { initCallback } = this.props;
      this.state = {
        current: nextProps.current,
        imagelist: nextProps.imagelist,
        arrLength: nextProps.addPage ? nextProps.imagelist.length + nextProps.addPage : nextProps.imagelist.length
      };
      Transform(this.list);
      current && this.changeIndex(current, false);
      this.bindStyle(current);
      initCallback && initCallback();
    }
  }
  componentDidMount() {
    let { current } = this.state,
      { initCallback } = this.props;

        //this.arrLength = this.state.imagelist.length;
    this.list = this.refs.imagelist;

    Transform(this.list);

    current && this.changeIndex(current, false);

    this.bindStyle(current);

    initCallback && initCallback();
  }

  onSingleTap() {
      //console.log('onSingleTap');
    this.props.onSingleTap && this.props.onSingleTap();
    this.props.close && this.props.close();
  }

  onPressMove(evt) {
      //console.log('onPressMove');
      //console.log('evt',evt);
    const { current } = this.state;

    this.endAnimation();

    if (!this.focused) {
      if ((current === 0 && evt.deltaX > 0) || (current === this.state.arrLength - 1 && evt.deltaX < 0)) {
              //console.log('1',this.list.translateX);
        this.list.translateX += evt.deltaX / 3;
              //console.log('2',this.list.translateX);
      } else {
              //console.log('3',this.list.translateX);
        this.list.translateX += evt.deltaX;
              //console.log('4',this.list.translateX);
      }
    }

    evt.preventDefault();
  }

  onSwipe(evt) {
      //console.log('onSwipe');
    const { direction } = evt;

    let { current } = this.state;
    if (this.focused) {
      return false;
    }
    switch (direction) {
    case 'Left':
      current < this.state.arrLength - 1 && ++current && this.bindStyle(current);
      break;
    case 'Right':
      current > 0 && current-- && this.bindStyle(current);
      break;
    }
    this.props.movedCurrent && this.props.movedCurrent(current);
    this.changeIndex(current);
  }

  onPicPressMove(evt) {
      //console.log('onPicPressMove');
    const { deltaX, deltaY } = evt,
      isLongPic = this.ob.getAttribute('long'),
      { scaleX, width } = this.ob;

    if (this.ob.scaleX <= 1 || evt.touches.length > 1) {
      return;
    }

    if (this.ob && this.checkBoundary(deltaX, deltaY)) {
      !isLongPic && (this.ob.translateX += deltaX);
      this.ob.translateY += deltaY;

      if (isLongPic && scaleX * width === this.screenWidth) {
        this.focused = false;
      } else {
        this.focused = true;
      }
    } else {
      this.focused = false;
    }
  }

  onMultipointStart() {
      //console.log('onMultipointStart');
    this.initScale = this.ob.scaleX;
  }

  onPinch(evt) {
      //console.log('onPinch');
    if (this.props.disablePinch || this.ob.getAttribute('long')) {
      return false;
    }
    this.ob.style.webkitTransition = 'cubic-bezier(.25,.01,.25,1)';

    const { originX, originY } = this.ob,
      originX2 = evt.center.x - this.screenWidth / 2 - document.body.scrollLeft,
      originY2 = evt.center.y - this.screenHeight / 2 - document.body.scrollTop;

    this.ob.originX = originX2;
    this.ob.originY = originY2;
    this.ob.translateX = this.ob.translateX + (originX2 - originX) * this.ob.scaleX;
    this.ob.translateY = this.ob.translateY + (originY2 - originY) * this.ob.scaleY;

    this.ob.scaleX = this.ob.scaleY = this.initScale * evt.scale;
  }

  onRotate(evt) {
      //console.log('onRotate');
    if (!this.props.enableRotate || this.ob.getAttribute('rate') >= 3.5) {
      return false;
    }

    this.ob.style.webkitTransition = 'cubic-bezier(.25,.01,.25,1)';

    this.ob.rotateZ += evt.angle;
  }

  onLongTap() {
      //console.log('onLongTap');
    this.props.longTap && this.props.longTap();
  }

  onMultipointEnd(evt) {
        //console.log('onMultipointEnd');
        // translate to normal
    this.changeIndex(this.state.current);

    if (!this.ob) {
      return;
    }

    this.ob.style.webkitTransition = '300ms ease';

    const { maxScale } = this.props,
      isLongPic = this.ob.getAttribute('long');
        // scale to normal
    if (this.ob.scaleX < 1) {
      this.restore(false);
    }
    if (this.ob.scaleX > maxScale && !isLongPic) {
      this.setScale(maxScale);
    }

        // rotate to normal
    let rotation = this.ob.rotateZ % 360,
      rate = this.ob.getAttribute('rate');

    if (rotation < 0) {
      rotation = 360 + rotation;
    }
    this.ob.rotateZ = rotation;

    if (rotation > 0 && rotation < 45) {
      this.ob.rotateZ = 0;
    } else if (rotation >= 315) {
      this.ob.rotateZ = 360;
    } else if (rotation >= 45 && rotation < 135) {
      this.ob.rotateZ = 90;
      this.setScale(rate);
    } else if (rotation >= 135 && rotation < 225) {
      this.ob.rotateZ = 180;
    } else if (rotation >= 225 && rotation < 315) {
      this.ob.rotateZ = 270;
      this.setScale(rate);
    }
  }

  onDoubleTap(evt) {
      //console.log('onDoubleTap');
    if (this.props.disableDoubleTap) {
      return false;
    }

    const { origin } = evt,
      originX = origin[0] - this.screenWidth / 2 - document.body.scrollLeft,
      originY = origin[1] - this.screenHeight / 2 - document.body.scrollTop,
      isLongPic = this.ob.getAttribute('long');

    if (this.ob.scaleX === 1) {
      !isLongPic && (this.ob.translateX = this.ob.originX = originX);
      !isLongPic && (this.ob.translateY = this.ob.originY = originY);
      this.setScale(isLongPic ? this.screenWidth / this.ob.width : this.props.maxScale);
    } else {
      this.ob.translateX = this.ob.originX;
      this.ob.translateY = this.ob.originY;
      this.setScale(1);
    }
  }

  bindStyle(current) {
      //console.log('bindStyle');
    this.setState({ current }, () => {
      this.ob && this.restore();
      this.ob = document.getElementById(`view${current}`);
      if (this.ob && !this.ob.scaleX) {
        Transform(this.ob);
      }
            // ease hide page number
      const page = this.refs.page;
      if (page) {
        page.classList.remove('hide');
        setTimeout(() => {
          page.classList.add('hide');
        }, 2000);
      }
    });
  }

  changeIndex(current, ease = true) {
      //console.log('changeIndex');
    ease && (this.list.style.webkitTransition = '300ms ease');
    this.list.translateX = -current * (this.screenWidth + this.props.gap);

    this.props.changeIndex && this.props.changeIndex(current);
  }

  setScale(size) {
      //console.log('setScale');
    this.ob.style.webkitTransition = '300ms ease-in-out';
    this.ob.scaleX = this.ob.scaleY = size;
  }

  restore(rotate = true) {
      //console.log('restore');
    this.ob.translateX = this.ob.translateY = 0;
    !!rotate && (this.ob.rotateZ = 0);
    this.ob.scaleX = this.ob.scaleY = 1;
    this.ob.originX = this.ob.originY = 0;
  }

  endAnimation() {
      //console.log('endAnimation');
    this.list.style.webkitTransition = '0';
    this.ob && this.ob.style && (this.ob.style.webkitTransition = '0');
  }

  checkBoundary(deltaX = 0, deltaY = 0) {
        //console.log('checkBoundary');
    const { scaleX, translateX, translateY, originX, originY, width, height } = this.ob,
      rate = this.ob.getAttribute('rate');

    if (scaleX !== 1 || scaleX !== rate) {
            // include long picture
      const rangeLeft = (scaleX - 1) * (width / 2 + originX) + originX,
        rangeRight = -(scaleX - 1) * (width / 2 - originX) + originX,
        rangeUp = (scaleX - 1) * (height / 2 + originY) + originY,
        rangeDown = -(scaleX - 1) * (height / 2 - originY) + originY;


      if (translateX + deltaX <= rangeLeft
                && translateX + deltaX >= rangeRight
                && translateY + deltaY <= rangeUp
                && translateY + deltaY >= rangeDown) {
        return true;
      }
    }
    return false;
  }
}

export const SingleImgView = new Singleton(ImageView);

export default ImageView;
