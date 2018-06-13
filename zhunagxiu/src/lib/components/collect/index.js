import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import queryString from 'query-string';
import onfire from 'onfire.js';
import Host from '../../scripts/config_host';
import Http from '../../scripts/http';
import Login from '../../scripts/login';
import GetUserInfo from '../../scripts/getUserInfo';
import './style.scss';
import BigData from '../../scripts/bigData';

/* collect 收藏
 * props: id
 * id - 收藏接口所需的objectId
 * collect - 收藏所需数据
 * initCollectData - 收藏所需参数是否初始化完成
* */


export default class Collect extends Component {

  constructor(props) {
    super(props);
    console.log('collect component');

    const params = queryString.parse(location.search);
    this.detailId = params.detailId;

    this.state = {
      pattern: ''
    };

    this.handleCollect = this.handleCollect.bind(this);
    this.didAppearCollect = this.didAppearCollect.bind(this);

    this.course = {
      init: false,
      handle: false,
      checking: false
    };
    this.hasMounted = true;
  }

  didAppearCollect() {

    const _this = this;
    const { initCollectData } = _this.props;

    // if (!initCollectData || _this.course.checking || _this.course.init) {
    //   return;
    // }
    const objectId = _this.props.id;
    const { sourceType } = _this.props.collect;
    GetUserInfo().then((res) => {
      Http.post('/api-user/api/userCollection/IsItemCollectioned', {
        body: {
          appId: Host.appId,
          objectId,
          sourceType: sourceType,
          switchServer: 'jz'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        requestSerializerType: '0'
      }, false).then((resp) => {
        if (resp.code == 200 && resp.dataMap) {
          _this.hasMounted && _this.setState({
            pattern: ' collected'
          });
        } else {
          _this.hasMounted && _this.setState({
            pattern: ''
          });
        }
      });
    }).catch((e) => {
      console.log(e);
    }).then(() => {
      _this.course.checking = false;
      _this.course.init = true;
    });
  }
  componentDidMount() {
    this.fireDidAppear && onfire.un(this.fireDidAppear);
    this.fireDidAppear = onfire.on('didAppearCollect', this.didAppearCollect);
  }
  componentWillReceiveProps(nextProps) {
    // alert(JSON.stringify(nextProps))
    /*
    1.initCollectData上个组件传来的标示 一般是true
     2. */
    const _this = this;
    const { initCollectData } = nextProps;
    if (!initCollectData || _this.course.checking || _this.course.init) {
      return;
    }
    // _this.course.checking = true;
    //const objectId = this.detailId;
    const objectId = nextProps.id;
    const { sourceType } = nextProps.collect;
    // alert(JSON.stringify(2)+objectId+'objectId')
    GetUserInfo().then((res) => {
      // alert(JSON.stringify(res)+'初始化调登录借口')
      Http.post('/api-user/api/userCollection/IsItemCollectioned', {
        body: {
          appId: Host.appId,
          objectId,
          sourceType: sourceType,
          switchServer: 'jz'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        requestSerializerType: '0'
      }, false).then((resp) => {
        // alert(JSON.stringify(resp)+'调数据,初始化')
        if (resp.code == 200 && resp.dataMap) {

          _this.hasMounted && _this.setState({
            pattern: ' collected'
          });
        }
      });
    }).catch((e) => {
      console.log(e);
    }).then(() => {
      _this.course.checking = false;
      _this.course.init = true;
    });
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  handleCollect(e) {
    e.stopPropagation();
    this.props.f&&this.props.collectBigData&&this.props.collectBigData.id&& this.props.f(this.props.collectBigData)
    const _this = this;
    if (!_this.course.init) {
      return false;
    }
    if (_this.course.handle) {
      console.log('444');
      Toast.info('哎哟喂，操作失败', 1);
      return false;
    }
    _this.course.handle = true;
    GetUserInfo().then((res) => {
      const objectId = _this.props.id;
      const { sourceType, channel, title, picture, desc1 } = _this.props.collect;
      let url = '/api-user/api/userCollection/cancelUserCollection';
      const body = {
        appId: Host.appId,
        objectId,
        sourceType,
        switchServer: 'jz'
      };
      if (_this.state.pattern == '') {
        url = '/api-user/api/userCollection/addUserCollection';
        Object.assign(body, {
          channel,
          title,
          picture,
          desc1
        });
      }

      Http.post(url, {
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        requestSerializerType: '0'
      }, false).then((data) => {
        _this.course.handle = false;
        if (data.code == 200) {
          if (_this.state.pattern == '' && data.dataMap) {
            _this.hasMounted && _this.setState({
              pattern: ' collected'
            });
            if (_this.props.addCollectNum) { //收藏成功后，显示的收藏数加一
              _this.props.addCollectNum();
            }
            Toast.success('收藏成功', 1);
          } else {
            _this.hasMounted && _this.setState({
              pattern: ''
            });
            if (_this.props.subtractCollectNum) { //取消收藏后，显示的收藏数减一
              _this.props.subtractCollectNum();
            }
            Toast.success('取消收藏', 1);
          }
        } else if (data.code == -401) {
          Login();
        } else if (data.code == -9004 || data.code == -9005) {
          Toast.info('今日收藏已达最大次数', 1);
        } else {
          Toast.info('哎哟喂，操作失败', 1);
        }
      });
    }).catch((error) => {
      console.log(error);
      _this.course.handle = false;
      Login();
    });
    return this;
  }

  render() {
    const pattern = `com-collect${this.state.pattern}`;
    let { caseDetail } = this.props;
    let words = '';
    if (caseDetail) {
      words = <b className="theWords">收藏</b>
    }
    return (
      <span className={pattern} onClick={this.handleCollect}>
        {words}
      </span>
    );
  }
}
