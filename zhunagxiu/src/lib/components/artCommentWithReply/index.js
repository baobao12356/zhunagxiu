import React, {Component} from 'react';
import HybridOpenPageNewEvaluationList from 'rs-hybrid-open-page-new-evaluation-list';
import onfire from 'onfire.js';
import LazyLoad from 'react-lazy-load';
import Http from '../../scripts/http';
import ResizeImg from '../../scripts/resizeImg';
import DefaultUser from '../defaultUser';
import GetUserInfo from '../../scripts/getUserInfo';
import GetNativeInfo from '../../scripts/getNativeInfo';
import Like from '../like';
import Hybrid from '../../scripts/hybrid';
import './style.scss';

/*文章评论列表页，带有回复列表和评论点赞
 *props: id type
* */
export default class ArtCommentWithReply extends Component {

  static checkComment(context, id, type, dispatch = false) {
    Http.post('/api-alibi/api/review/common/list', {
      body: {
        page: 1,
        pageSize: 10,
        type,
        id
      }
    }).then((res) => {
      if (res.code == 200 && res.dataMap && res.dataMap.totalElements) {
        context.hasMounted && context.setState({
          lists: res.dataMap.data,
          totalElements: res.dataMap.totalElements
        });
        if (dispatch) {
          onfire.fire('articleTotalCommentChange', res.dataMap.totalElements);
        }
      }
    });
  }

  constructor(props) {
    super(props);
    console.log('ArtCommentWithReply');

    const _this = this;
    _this.state = {
      lists: [],
    };
    this.hasMounted = true;
    this.hasMounted && onfire.on('totalCommentChange', () => {
      const {id, type} = _this.props;
      ArtCommentWithReply.checkComment(_this, id, type);
    });
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    const _this = this;
    const {id, type} = this.props;

    ArtCommentWithReply.checkComment(_this, id, type);
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  handleTouch() {
    const _this = this;
    const {id, type} = this.props;
    new HybridOpenPageNewEvaluationList().open(id, type).then((res) => {
      if (res.type == type) {
        ArtCommentWithReply.checkComment(_this, id, type, true);
      }
    }).catch((e) => {
      throw e;
    });
  }

  render() {
    const {lists, totalElements} = this.state;
    if (!lists.length) {
      return null;
    }
    const comment = lists.map(list => {
      let likeClassName = 'like-wrapper';
      if(list.userLiked){
        likeClassName += ' liked-wrapper';
      }
      let replyList = list.redstarReviewReplies;
      return (
        <li key={list.id}>
          <div className="author-info">
            <DefaultUser src={ResizeImg(list.headerUrl, 88, 88, '!')} />
            <div className="name">
              <h4>{list.nickName}</h4>
              <p>{list.createDate}</p>
            </div>
            <div className="like-wrapper">
              <Like id={list.id} likeType="review" countShow="true" isLiked={list.userLiked} comLikeCount={list.likedNumber}/>
            </div>
          </div>
          <div className="conmment-content">
            {list.comment}
          </div>
          { replyList.length > 0 &&
            <div className="comment-replybox">
              <ul>
                {
                  replyList.map(item => {
                    return(
                      <li key={item.id}>
                        <strong>{`${item.replyXingMing}：`}</strong>
                        {item.content}
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          }
        </li>
      )
    });
    let styleHide;
    if(this.props.divHide || lists.length < 10){
      styleHide = {
        'display': 'none'
      }
    }

    return (
      <div>
        <div className="line"></div>
        <div className="com-art-comment-list">
          <h4 className="title">最新评论<span>({totalElements})</span></h4>
          <ul>
            {comment}
          </ul>
          <div className="more" style={styleHide}>
            <span onTouchStart={this.handleTouch}>查看更多</span>
          </div>
        </div>
      </div>
    );
  }
}
