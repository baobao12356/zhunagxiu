import React, { Component } from 'react';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import Http from '../../scripts/http';
import GetUserInfo from '../../scripts/getUserInfo';
import GetNativeInfo from '../../scripts/getNativeInfo';
import ChangeNumber from '../../scripts/changeNumber';
import './style.scss';
/* like 点赞
 * props: id, likeType, isLiked, comLikeCount
 * id - 收藏接口所需的objectId
 * likeType - 点赞的type
 * isLiked - 点赞状态（非必填）
 * comLikeCount - 点赞数量（非必填）
 * countShow - 是否显示“赞”, true or false
 * */
export default class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pattern: '',
      likedCount: 0
    };
    this.handleLike = this.handleLike.bind(this);
    this.didAppearLike = this.didAppearLike.bind(this);
    this.initLike = this.initLike.bind(this);
    this.course = {
      init: false,
      handle: false
    };
    this.hasMounted = true;
  }

  //点赞初始化
  initLike() {
    const _this = this;
    const { id, likeType } = _this.props;
    function _query(userId) {
      Http.post('/api-alibi/api/review/common/likedCount', {
        body: {
          id,
          type: likeType,
          userId,
        }
      }).then((res) => {
        // alert(JSON.stringify(res)+'调接口')
        if (res.code == 200 && res.dataMap) {
          _this.setState({
            likedCount: parseInt(res.dataMap.likedCount),
            pattern: _this.hasMounted && res.dataMap.isUserLiked ? ' liked' : '',
          })
        }
        // if (res.code == 200 && res.dataMap && res.dataMap.isUserLiked) {
        //   _this.hasMounted && _this.setState({
        //     pattern: ' liked'
        //   });
        // }
      });
    }
    if (this.props.comLikeCount >= 0) {
      _this.setState({
        likedCount: this.props.comLikeCount
      })
      if (this.props.isLiked) {
        _this.setState({
          pattern: ' liked'
        })
      }
      _this.course.init = true;
    } else {
      _this.course.init = true;
      GetUserInfo().then((res) => {
        // alert(JSON.stringify(res))
        _query(res.openid);
      }).catch((e) => {
        console.log(e);
        GetNativeInfo().then((res) => {
          if (res.hxiphoneUUID) {
            _query(res.hxiphoneUUID);
          } else {
            throw new Error('like-未返回设备序列号');
          }
        }).catch((error) => {
          console.log(error);

        });
      }).then(() => {
        _this.course.init = true;
      });
    }
  }
  didAppearLike() {
    this.initLike();
  }
componentDidMount() {
  this.fireDidAppear && onfire.un(this.fireDidAppear);
  this.fireDidAppear = onfire.on('didAppearLike', this.didAppearLike);
}
componentWillReceiveProps(nextProps){
  this.initLike();
  // const _this = this;
  // const { id, likeType } = _this.props;
  // function _query(userId) {
  //   Http.post('/api-alibi/api/review/common/likedCount', {
  //     body: {
  //       id,
  //       type: likeType,
  //       userId,
  //     }
  //   }).then((res) => {
  //     // alert(JSON.stringify(res)+'调接口')
  //     if (res.code == 200 && res.dataMap) {
  //       _this.setState({
  //         likedCount: parseInt(res.dataMap.likedCount),
  //         pattern: _this.hasMounted && res.dataMap.isUserLiked ? ' liked' : '',
  //       })
  //     }
  //     // if (res.code == 200 && res.dataMap && res.dataMap.isUserLiked) {
  //     //   _this.hasMounted && _this.setState({
  //     //     pattern: ' liked'
  //     //   });
  //     // }
  //   });
  // }
  // if (this.props.comLikeCount >= 0) {
  //   _this.setState({
  //     likedCount: this.props.comLikeCount
  //   })
  //   if (this.props.isLiked) {
  //     _this.setState({
  //       pattern: ' liked'
  //     })
  //   }
  //   _this.course.init = true;
  // } else {
  //   _this.course.init = true;
  //   GetUserInfo().then((res) => {
  //     // alert(JSON.stringify(res))
  //     _query(res.openid);
  //   }).catch((e) => {
  //     console.log(e);
  //     GetNativeInfo().then((res) => {
  //       if (res.hxiphoneUUID) {
  //         _query(res.hxiphoneUUID);
  //       } else {
  //         throw new Error('like-未返回设备序列号');
  //       }
  //     }).catch((error) => {
  //       console.log(error);

  //     });
  //   }).then(() => {
  //     _this.course.init = true;
  //   });
  // }

}
componentWillUnmount() {
  this.hasMounted = false;
}
handleLike() {
  const _this = this;
  const { id, likeType, pointLike } = _this.props;
  //  alert(this.props.comLikeCount+'---'+JSON.stringify(_this.props)+'..'+_this.course.init);
  _this.props.f && _this.props.pointLike && _this.props.pointLike.id && _this.props.f(_this.props.pointLike)

  function _like(userId) {
    Http.post('/api-alibi/api/review/common/praise', {
      body: {
        type,
        id,
        objectType: likeType,
        userId
      }
    }).then((res) => {
      _this.course.handle = false;
      if (res.code == 200) {
        if (_this.state.pattern == '') {
          _this.hasMounted && _this.setState({
            pattern: ' liked',
            likedCount: parseInt(_this.state.likedCount) + 1
          });
          if (_this.props.addPraiseNum) {
            _this.props.addPraiseNum();
          }
        } else {
          _this.hasMounted && _this.setState({
            pattern: ''
          });
          if (_this.hasMounted && _this.state.likedCount > 0) {
            _this.setState({
              likedCount: parseInt(_this.state.likedCount) - 1
            })
          }
          if (_this.props.subtractPraiseNum) {
            _this.props.subtractPraiseNum();
          }
        }
      }
    });
  }
  let type = 'Cancel';
  if (!_this.course.init || _this.course.handle) {
    return false;
  }
  if (_this.state.pattern == '') {
    type = 'Add';
  }
  _this.course.handle = true;
  GetUserInfo().then((res) => {
    console.log('res.openid', res.openid);
    _like(res.openid);
  }).catch((e) => {
    console.log(e);
    GetNativeInfo().then((res) => {
      console.log('res.hxiphoneUUID', res.hxiphoneUUID);
      if (res.hxiphoneUUID) {
        _like(res.hxiphoneUUID);
      } else {
        throw new Error('like-未返回设备序列号');
      }
    }).catch((error) => {
      console.log(error);
    });
  });

  // _this.props.f && _this.props.pointLike && _this.props.pointLike.id && _this.props.f(_this.props.pointLike)
}
render() {
  let pattern = `com-like${this.state.pattern}`;
  let { caseDetail } = this.props;
  let temp = '';
  let words = '';
  let myLikeCount = ChangeNumber(this.state.likedCount);
  if (this.props.comLikeCount >= 0) {
    if (this.props.countShow) {
      if (!isNaN(myLikeCount)) {
        temp = <em>{myLikeCount > 0 ? myLikeCount : '赞'}</em>
      } else {
        temp = <em>{myLikeCount}</em>
      }
    } else {
      if (!isNaN(myLikeCount)) {
        temp = <em>{myLikeCount > 0 ? myLikeCount : ''}</em>
      } else {
        temp = <em>{myLikeCount}</em>
      }
    }
  }
  if (caseDetail) {
    words = <b className="theWords">点赞</b>
  }
  return (
    <span className={pattern} onClick={this.handleLike}>
      <span className="com-like-img"></span>
      {temp}
      {words}
    </span>
  );
}
}

/*   return (
      <span className={pattern} onClick={this.handleLike}>
        <span className="com-like-img"></span>
        {temp}
        {words}
      </span>
    ); */
/*  */
