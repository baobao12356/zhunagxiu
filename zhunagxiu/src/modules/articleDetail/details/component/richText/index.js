import React, { Component } from 'react';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import lozad from 'lozad'
import GoodsRow from '../goods';
import RichTextPro from '../../../../../lib/components/richText';
import './style.scss';
import { stringify } from 'querystring';


/* 展示富文本内容
 * props: description
 * description - string, 富文本内容
 * */
export default class RichText extends Component {

  static defaultProps = {
    preview: true
  }

  constructor(p) {
    super(p);
    this.previewImg = this.previewImg.bind(this);
  }

  /**
   * 预览图片
   *
   * @param {event} e
   */
  previewImg(e) {
    e.stopPropagation();
    const target = e.target;
    if (target.tagName.toLowerCase() != 'img') {
      return;
    }

  }
  componentDidMount() {
    //  console.log(  this.previewImg,'子类')

  }


  procesContent(content, cityId) {
    // let subContent= content.replace(/(RSGoods(&nbsp;)*\d+(&nbsp;)*\/RSGoods)/g, '&split&$1&split&').split('&split&');
    // let subContent= content.replace(/(<RSTag type="goods" value="\d+"\/>)/mg, '&split&$1&split&').split('&split&');
    let subContent = content.replace(/(<RSTag type=['|"]?goods['|"]? value=['|"]?\d+['|"]?\/>)/mg, '&split&$1&split&').split('&split&');
    const _this = this;
    subContent.forEach((v, i) => {
      // if (v.match(/RSGoods(&nbsp;)*([^&]+)(&nbsp;)*\/RSGoods/)) {
      // if (v.match(/<RSTag type="goods" value="(\d+)"\/>/)) {
      if (v.match(/<RSTag type=['|"]?goods['|"]? value=['|"]?(\d+)['|"]?\/>/)) {
        subContent[i] = <GoodsRow skuId={RegExp.$1} key={i} cityId={cityId} f={_this.props.f} articleId={_this.props.articleId}></GoodsRow>;
      }
    })
    return subContent;

  }

  componentDidUpdate() {
    const observer = lozad(); // lazy loads elements with default selector as '.lozad'
    observer.observe();
  }
  /**
   * 优化富文本图片
   *
   * @param {string} content 富文本内容
   */
  performContentImgs(content) {
    let itemStr = content.replace(/<img[^>]+>/g, (str) => {
      const retStr = str.replace(/src *= *"([^"]+)"/, (matchStr, url) => {
        let classContent = '';
        if (matchStr.indexOf('class') !== -1) {
          const repClassContent = matchStr.replace(/class *= *"([^"]+)"/, (matchClassStr, classStr) => {
            return `${classStr} lozad`
          });
          classContent = repClassContent;
        } else {
          classContent = 'lozad';
        }
        return `class="${classContent}" data-src="${url}"`;
      });
      return retStr;
    });
    return itemStr;
  }

  render() {
    let { preview, cityId } = this.props;
    if (preview === 'true') {
      preview = true;
    }
    console.log('richText render preview', preview)
    // console.log(this.props.description,cityId,'传过来的.....')
    if (!this.props.description) {
      return null;
    }
    let cityCode = this.props.cityId ? this.props.cityId : '';
    const performContent = this.performContentImgs(this.props.description);
    const contents = this.procesContent(performContent, cityCode);
    // console.log(contents,'内容')
    const viewContents = contents.map((item, index) => {
      if (typeof item === 'string') {
        const retElem =
          <div
            key={index} className="com-rich-text"
            dangerouslySetInnerHTML={{ __html: item }}
            onClick={preview == true ? this.previewImg.bind(this) : ''}
          />;
        return retElem;
      } else {
        return item;
      }
    })
    return (
      <div>
        {viewContents}
      </div>
    );
  }
}
