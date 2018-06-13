import React, {Component} from 'react';
import HybridOpenPageNewEvaluationList from 'rs-hybrid-open-page-new-evaluation-list';
import onfire from 'onfire.js';
import Http from '../../scripts/http';
import ResizeImg from '../../scripts/resizeImg';
import DefaultUser from '../defaultUser';
import './style.scss';

/*文章评论列表页
 *props: id type
* */
export default class ArtCommentList extends Component {

  static checkComment(context, id, type, dispatch = false) {
    Http.post('/api-alibi/api/review/common/list', {
      body: {
        page: 1,
        pageSize: 2,
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
    console.log('ArtCommentList');

    const _this = this;
    _this.state = {
      lists: []
    };
    this.hasMounted = true;
    this.hasMounted && onfire.on('totalCommentChange', () => {
      const {id, type} = _this.props;
      ArtCommentList.checkComment(_this, id, type);
    });

    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    const _this = this;
    const {id, type} = this.props;

    ArtCommentList.checkComment(_this, id, type);
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  handleTouch() {
    const _this = this;
    const {id, type} = this.props;
    new HybridOpenPageNewEvaluationList().open(id, type).then((res) => {
      if (res.type == type) {
        ArtCommentList.checkComment(_this, id, type, true);
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
    const comment = lists.map(list => (
      <li key={list.id}>
        <div className="author-info">
          <DefaultUser src={ResizeImg(list.headerUrl, 88, 88, '!')} />
          <div className="name">
            <h4>{list.nickName}</h4>
            <p>{list.createDate}</p>
          </div>
        </div>
        <div className="conmment-content">
          {list.comment}
        </div>
      </li>
      ));

    return (
      <div className="com-art-comment-list">
        <h4 className="title">网友点评({totalElements})<span className="more" onTouchStart={this.handleTouch} /></h4>
        <ul>
          {comment}
        </ul>
      </div>
    );
  }
}
