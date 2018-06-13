import React, { Component } from 'react';
import onfire from 'onfire.js';
import HybridOpenPageNewEvaluationList from 'rs-hybrid-open-page-new-evaluation-list';
import Http from '../../scripts/http';
import cs from 'classnames';
import changeNumber from '../../scripts/changeNumber';
import './style.scss';

/*
 * type - string, 查询评论列表的type值，参考http://wiki.corp.rs.com/pages/viewpage.action?pageId=6064652
 * id - string, 当前页面的id
 * count - number 外部传入评论数，非必传
 * noCount
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
          totalElements: changeNumber(data.dataMap.totalElements)
        });
        if (dispatch) {
          onfire.fire('totalCommentChange', data.dataMap.totalElements);
        }
      }
    });
  }

  constructor(props) {
    super(props);
    console.log('comment component');

    const _this = this;

    _this.state = {
      totalElements: 0
    };

    _this.commentList = _this.commentList.bind(_this);
    this.hasMounted = true;
    this.hasMounted && onfire.on('articleTotalCommentChange', (res) => {
      _this.hasMounted && _this.setState({
        totalElements: changeNumber(res)
      });
    });
  }

  componentDidMount() {
    const _this = this;
    const { type, id, count } = _this.props;

    if (!count && count != 0) {
      Footer.checkComment(_this, id, type);
    } else {
      _this.setState({
        totalElements: changeNumber(_this.props.count)
      });
    }
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  commentList() {
    const _this = this;
    if (this.props.f) {
      const { pointComment } = this.props;
      this.props.f && pointComment && this.props.f(pointComment);
    }
    const { type, id } = _this.props;
    new HybridOpenPageNewEvaluationList().open(id, type).then((res) => {
      if (res.type == type) {
        Footer.checkComment(_this, id, type, true);
      }
    }).catch((e) => {
      throw e;
    });
  }

  render() {
    let { count, noCount, caseDetail } = this.props;
    let temp = '';
    let words = '';
    if (noCount) {
      temp = this.state.totalElements == 0 ? '' : <em>{this.state.totalElements}</em>;
    } else if (!count && count != 0) {
      temp = <em>{this.state.totalElements}</em>;
    } else {
      temp = <div className="com-comment-count-wrap"><span className='com-comment-count'></span><em>{this.state.totalElements == 0 ? '' : this.state.totalElements}</em></div>
    }
    if (caseDetail) {
      words = <b className="theWords">评论</b>
    }
    return (
      <span className={cs({ 'com_padding': true, 'com-comment': !count && count != 0 })} onTouchStart={this.commentList}>
        {temp}
        {words}
      </span>
    )
  }
}
