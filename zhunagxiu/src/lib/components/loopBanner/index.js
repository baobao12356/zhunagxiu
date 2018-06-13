/**
 * Created by chunhua.yang on 2017/6/6.
 */
import React from 'react';
import { Carousel } from 'antd-mobile';
import './style.scss';

/*轮播图组件
 config{
 imgA:Array,[{},{},...] || ['','',...]（必填）
 imgUrl:String imgA中图片链接字段 （必填）
 linkUrl:String imgA中图片跳转字段（非必填）
 linkType:String imgA中图片跳转类型字段（非必填）
 dots:Bool 轮播图索引原点 default:false,
 noMark:Bool 图片水印 默认按照原始url(非必填)
 myClick:Function 图片点击事件
 initialHeight:轮播图初始高度
 }
 */

export default class LoopBanner extends React.Component {
  static propTypes = {
    imgA: React.PropTypes.array.isRequired
  };
  static defaultProps = {
    imgA: []
  };
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this)
    this.state = {
      initialHeight: parseFloat(this.props.initialHeight) || 205
    };
  }

  hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  };

  addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
  }

  onChange(current) {
    !!this.props.handleFun && this.props.handleFun(current)
  }

  componentDidMount() {

  }

  render() {
    const { imgA, imgUrl, linkUrl, linkType, linkId, dots, noMark, myClick, noAutoPlay, currentIndex, speed } = this.props;
    const BannerSet = {
      className: "hm-carousel",
      dots: dots ? (imgA.length == 1 ? false : true) : false,
      dragging: imgA.length == 1 ? false : true,
      autoplay: !noAutoPlay && (imgA.length == 1 ? false : true),
      swiping: imgA.length == 1 ? false : true,
      infinite: true,
      // easing: 'linear',
      autoplayInterval: 4000,
      selectedIndex: !!currentIndex ? currentIndex : 0,
      //speed: !!speed ? speed : 1000,
      //swipeSpeed: 100,
    };
    let content = null;
    if (typeof (imgA[0]) == 'string') {
      content = imgA.map((item, idx) => {
        return <div
          onClick={typeof myClick == 'function' ? myClick : () => { return; }}
          key={idx}
          className="com-default-img-content"
          style={{
            height: this.state.initialHeight,
            'backgroundSize': '50%',
            'backgroundColor': '#f5f5f5'
          }}>
          <img
            src={noMark ? item + '!' : item}
            className="v-item"
            key={idx}
            data-index={idx}
            onLoad={(e) => {
              window.dispatchEvent(new Event('resize'));
              this.addClass(e.target, 'img-show');
              this.setState({
                initialHeight: null
              });
            }}
          />
        </div>
      })
    } else {
      content = imgA.map((item, idx) => {
        return <div
          onClick={typeof myClick == 'function' ? myClick : () => { return; }}
          key={idx}
          className="com-default-img-content"
          style={{
            height: this.state.initialHeight,
            'backgroundSize': '50%',
            'backgroundColor': '#f5f5f5'
          }}>
          <img
            src={noMark ? item[imgUrl] + '!' : item[imgUrl]}
            className="v-item"
            data-linkType={item[linkType]}
            data-linkUrl={item[linkUrl]}
            data-id={item[linkId]}
            data-index={idx}
            onLoad={(e) => {
              window.dispatchEvent(new Event('resize'));
              this.addClass(e.target, 'img-show');
              this.setState({
                initialHeight: null
              });
            }
            }
          />
        </div>

      }
      )
    }
    return <Carousel
      afterChange={this.onChange}
      {...BannerSet}>
      {content}
    </Carousel>
  }
}
