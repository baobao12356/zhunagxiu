import React, { PureComponent } from 'react';
import moment from 'moment';
import Env from 'rs-browser';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';
import { Modal } from 'antd-mobile';
import ResizeImg from '../../../../lib/scripts/resizeImg';
import './index.scss';

export default class DetailModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: '',
      datailImgList: []
    };
    this.onClose = this.onClose.bind(this);
    this.nativeImgShow = this.nativeImgShow.bind(this);
    this.swiperFunction = this.swiperFunction.bind(this);
    this.itemContent = this.itemContent.bind(this);
    this.detailSwiper = null;
  }

  onClose() {
    this.props.onClose();
  }

  nativeImgShow(index, itemThirdDataMap) {
    const { f } = this.props;
    f && f({
      id: '3637'
    });

    const hybridOpenPageImagePreview = new HybridOpenPageImagePreview();
    const picData = [];
    const { images = [] } = itemThirdDataMap;
    images.map((item) => {
      const obj = {
        des: '',
        url: item,
        title: ''
      };
      picData.push(obj);
      return true;
    });
    const data = {
      id: '',
      objectType: '',
      currentIndex: index,
      photos: picData,
      showDownloadBar: 'yes'
    };
    hybridOpenPageImagePreview.open(data).catch((error) => {
      console.log(error);
    });
  }

  swiperFunction(itemThirdDataMap) {
    const { images = [] } = itemThirdDataMap;
    let imgItem = null;
    if (images) {
      imgItem = images.map((item, index) => {
        const key = index;
        let imgNode = null;
        if (item) {
          imgNode = (<img
            alt="轮播图片"
            src={ResizeImg(item, '690', '392', '!')}
            onClick={
              () => {
                this.nativeImgShow(index, itemThirdDataMap);
              }
            }
          />);
        }
        return (
          <div className="swiper-slide" key={key}>
            <div className="img_wraper">
              {imgNode}
            </div>
          </div>
        );
      });
      return (
        <div className="body_container">
          <div className="body_swiper_container">
            <div className="swiper-wrapper">
              {imgItem}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  componentDidUpdate() {
    const { data = {}, modalShow } = this.props;
    const { images = [] } = data;
    if (images.length > 1 && modalShow) {
      if (this.detailSwiper) {
        this.detailSwiper.destroy();
      }
      this.detailSwiper = new Swiper('.body_swiper_container', {
        autoplay: {
          delay: 2000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        direction: 'horizontal', //横向
        // loop: true,
        observer: true,
        observeParents: true,
        // slidesPerView: 'auto',
        // freeMode: true
      });
    }
  }

  componentWillUnmount() {
    this.detailSwiper && this.detailSwiper.destroy();
  }

  itemContent(itemThirdDataMap) {
    const { nodeType = '', itemTitle = '', result = '', itemContent = '',
      checkerType = '', checkerName = '', checkTime = '',
      area = '', resultId = '', itemExtend = '' ,checkDescription =''} = itemThirdDataMap;
    let checkTimeRes = '';
    let nodeTypeName = '';
    // let checkTimeObj = {};
    if (checkTime) {
      // checkTimeObj = moment(checkTime).toObject();
      // checkTimeRes = `${checkTimeObj.years}年${checkTimeObj.months}月${checkTimeObj.date}日`;
      checkTimeRes = moment(checkTime).format('YYYY年MM月DD日');
    }
    if (nodeType === 0) { //:0：交底类型 1：验收类型 ,
      nodeTypeName = itemExtend;
    } else if (nodeType === 1) {
      nodeTypeName = itemContent;
    }
    const resultList = [
      { title: '具体内容', name: itemTitle, resultflag: result, resultId },
      { title: '工作标准', name: nodeTypeName },
      { title: '验收人', name: checkerType, checkerName, flag: true },
      { title: '验收时间', name: checkTimeRes },
      { title: '需要更改区域', name: area },
      { title: '验收描述', name: checkDescription  }
    ];
    const resultListArr = resultList.map((item, index) => {
      const key = index;
      let resultOut = null;
      let nameResult = null;
      let nameNode = null;
      if (item.name || item.checkerName) {
        if (item.flag) {
          nameNode = (<span>
            {itemThirdDataMap.checkerType}:
            &nbsp;
              {itemThirdDataMap.checkerName}
          </span>);
        } else {
          nameNode = (<span>
            {item.name}
          </span>);
        }
        if (item.resultflag) {
          let csclassName = 'body_title_reults';
          let resultIdRes = '';
          if (item.resultId === 0) {
            resultIdRes = '未记录';
          } else if (item.resultId === -1) {
            csclassName += ' relults_title';
            resultIdRes = '待整改';
          } else if (item.resultId === 1) {
            resultIdRes = '合格';
          } else if (item.resultId === 2) {
            resultIdRes = '跳过';
          }
          resultOut = (<div className={csclassName}>
            {resultIdRes}
          </div>);
        }
        nameResult = (<div className="body_subtitle body_common_subtitle">
          {nameNode}
        </div>);
        return (
          <div className="body_common_details" key={key}>
            <div>
              <div className="body_title  body_common_title">
                {item.title}
              </div>
              {nameResult}
            </div>
            {resultOut}
          </div>
        );
      }
      return null;
    });
    return (
      <div>
        {resultListArr}
      </div>
    );
  }

  render() {
    const { data = {}, modalShow, threeNodeName } = this.props;
    let footerClassName = 'modal_footer';
    let modalContent = 'modal_content';
    if (Env.iPhoneX) {
      footerClassName += ' iphone-x';
      modalContent += ' iphone-x';
    }


    return (
      <Modal
        popup
        visible={modalShow}
        onClose={this.onClose}
        animationType="slide-up"
      >
        <div className={modalContent}>
          <div className="modal_body_all">
            <div className="modal_header">
              {threeNodeName}
            </div>
            <div className="modal_body">
              <div className="body_details">
                {this.swiperFunction(data)}
                {this.itemContent(data)}
              </div>
            </div>
          </div>
          <div className={footerClassName} onClick={this.onClose}>
            关闭
          </div>
        </div>
      </Modal>
    );
  }
}

