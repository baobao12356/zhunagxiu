import React, { Component } from 'react';
import onfire from 'onfire.js';
import HybridOpenPageNewEvaluationList from 'rs-hybrid-open-page-new-evaluation-list';
import HybridOpenPageEstimate from 'rs-hybrid-open-page-estimate';
import Http from '../../scripts/http';
import Collect from '../collect';
import Like from '../like';
import './style.scss';

/* footer 参考文章详情页
 * props: type，id, initCollectData, collect
 * type - string, 查询评论列表的type值，参考http://wiki.corp.rs.com/pages/viewpage.action?pageId=6064652
 * id - string, 当前页面的id
 * collect - 收藏所需的参数（不包含objectId）
 * initCollectData - 收藏所需参数是否初始化完成，为'none'时不展示收藏按钮
 * */
export default class Footer extends Component {

  static checkComment(context, id, type, dispatch = false) {
    Http.post('/api-alibi/api/review/common/list', {
      body: {
        type,
        id,
        page: 1,
        pageSize: 1
      }
    }).then((data) => {
      if (data.code == 200 && data.dataMap && data.dataMap.totalElements) {
        context.hasMounted && context.setState({
          totalElements: data.dataMap.totalElements
        });
        if (dispatch) {
          onfire.fire('totalCommentChange', data.dataMap.totalElements);
        }
      }
    });
  }

  constructor(props) {
    super(props);
    console.log('footer component');

    const _this = this;

    _this.state = {
      totalElements: 0
    };

    _this.commentList = _this.commentList.bind(_this);
    _this.submitComment = _this.submitComment.bind(_this);
    this.hasMounted = true;
    this.hasMounted && onfire.on('articleTotalCommentChange', (res) => {
      _this.hasMounted && _this.setState({
        totalElements: res
      });
    });
  }

  componentDidMount() {
    const _this = this;
    const { type, id } = _this.props;
    Footer.checkComment(_this, id, type);
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  commentList() {
    const _this = this;
    const { type, id, pointComment } = _this.props;
    this.props.f && pointComment && this.props.f({
      id: pointComment.id,
      p_action_id: `tag=${pointComment.tag}&collectid=${pointComment.collectId}`
    });
    new HybridOpenPageNewEvaluationList().open(id, type).then((res) => {
      if (res.type == type) {
        Footer.checkComment(_this, id, type, true);
      }
    }).catch((e) => {
      throw e;
    });
  }

  submitComment() {
    const _this = this;
    const { type, id } = _this.props;
    new HybridOpenPageEstimate().open(type, id).then((res) => {
      if (res.success) {
        Footer.checkComment(_this, id, type, true);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  render() {
    const { id, collect, initCollectData, likeType, pointLike } = this.props;
    return (
      <footer className="com-page-footer">
        {/*<div onClick={this.submitComment}>
          <p>发表评论</p>
    </div>*/}
        <div className="leftList">
          <span className="comment-content">
            <span className="comment" onTouchStart={this.commentList}>
              {
                this.state.totalElements > 0 &&
                <em>{this.state.totalElements}</em>
              }
            </span>
            <span className="comment-txt">评论</span>
          </span>
          <span className="like-content">
            <Like id={id} likeType={likeType} pointLike={pointLike} f={this.props.f}  />
            <span className="like-txt">点赞</span>
          </span>
          {initCollectData != 'none' ?
            <span className="collect-content">
              <Collect id={id} collect={collect} initCollectData={initCollectData} />
              <span className="collect-txt">收藏</span>
            </span>
            : null}
        </div>
        <div className="designAsk" onClick={this.props.forwardConsultPage}>设计咨询</div>
      </footer>
    );
  }
}
