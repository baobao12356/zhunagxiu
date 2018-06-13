import React, { Component } from 'react';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import lozad from 'lozad'
import './style.scss';
/* 展示富文本内容
 * props: description
 * description - string, 富文本内容
 * */
export default class richText extends Component {
  constructor(props){
    super(props);
    this.previewImg=this.previewImg.bind(this);
  }
  static defaultProps = {
    preview: 'true'
  }
  previewImg(e) {
    e.stopPropagation();
    const target = e.target;
    if (target.tagName.toLowerCase() != 'img') {
      return;
    }
    const data = {
      ID: '',
      objectType: '',
      currentIndex: '0',
      photos: []
    };
    const imgs = document.querySelectorAll('.com-rich-text img');
    let i = 0;
    const len = imgs.length;
    for (; i < len; i++) {
      if (imgs[i] == target) {
        data.currentIndex = i;
      }
      data.photos.push({
        des: '',
        title: '',
        url: imgs[i].src
      });
    }
    new HybridOpenPageImagePreview().open(data).catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate() {
    const observer = lozad('.lozad', {
      threshold: 0.75
    }); // lazy loads elements with default selector as '.lozad'
    observer.observe();
  }

  /**
   * 优化富文本图片
   *
   * @param {string} content 富文本内容
   */
  performContentImgs(content) {
    if (!content) {
      return content;
    }
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
        if (!/\d+x\d+/.test(url)) {
          if (url.indexOf('.jpg') != -1) {
            url = `${url}.750x750.jpg`
          } else if (url.indexOf('.png') != -1) {
            url = `${url}.750x750.png`
          }
        }
        return `class="${classContent}" data-src="${url}"`;
      });
      return retStr;
    });
    return itemStr;
  }

  render() {
    const { preview, description } = this.props;
    const content = this.performContentImgs(description);
    const contentElem = (
      <div
        className="com-rich-text"
        dangerouslySetInnerHTML={{ __html: content }}
        onClick={preview == 'true' ? this.previewImg.bind(this) : ''}
      />
    );
    return contentElem;
  }
}
