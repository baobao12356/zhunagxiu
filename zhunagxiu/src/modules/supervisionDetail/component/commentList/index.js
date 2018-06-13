import React from 'react';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import ResizeImg from '../../../../lib/scripts/resizeImg';
import { dateFormat, formatTimes } from '../../../../lib/scripts/dateFormat';
import './style.scss';

export default class CommenList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    dateFormat();
    this.openCommentImgView = this.openCommentImgView.bind(this);
  }

  //评论图片浏览
  openCommentImgView(picArr, idx) {
    const picData = [];
    picArr.map((item) => {
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
      currentIndex: idx,
      photos: picData
    };

    console.log(data);
    new HybridOpenPageImagePreview().open(data).catch((e) => {
      console.log(e);
    });

  }


  render() {
    const {info,index}=this.props;
    let pictureList=[];
    console.log(info.imgList,'原始图片');
     pictureList=info&&info.imgList&&info.imgList.split(',')!=''?info.imgList.split(',').splice(0,3):'';
     console.log(pictureList,'3张图片');
   let commonPictureList=pictureList&&pictureList.map((item,i)=>{
      return(
        <div className="comment_picture_one" key={i}>
           <img onClick={() => { this.openCommentImgView(pictureList, i) }} src={item?ResizeImg(item, '186', '186', '!'):require('./img/default.png')} key={i} />;
        </div>
      )
    })
    return (
       <div className="comment_one">
       <div className="comment_left">
         <div className="comment_picture">
           <img src={info&&info.avatarUrl? info.avatarUrl:require('./img/default.png')} />
         </div>
       </div>
       <div className="comment_right">
         <div className="comment_author_time">
           <div className="comment_author">
             {info&&info.name ||"" }
                         </div>
           <div className="comment_time">
           {
            new Date(info&&info.createDate ).Format("yyyy-MM-dd")||""
            }
                         </div>
         </div>

         <div className="comment_content">
              {info&&info.commentContent  ||""  }
                     </div>
         <div className="comment_picture_all">
             {
              commonPictureList
             }

         </div>
       </div>
     </div>

    );
  }



}
