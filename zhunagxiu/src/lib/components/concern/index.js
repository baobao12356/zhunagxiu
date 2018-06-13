import React, {Component} from 'react';
import {Toast} from 'antd-mobile';
import Host from '../../scripts/config_host';
import Http from '../../scripts/http';
import Login from '../../scripts/login';
import GetUserInfo from '../../scripts/getUserInfo';
//import './style.scss';

/* concern 关注
 * props: id
 * id - 关注接口所需的objectId
 * concern - 关注所需数据
 * initConcernData - 关注所需参数是否初始化完成
 * concernBigData -  回调。在父级元素调用大数据接口
* */


export default class Concern extends Component {

  constructor(props) {
    super(props);
    console.log('concern component');
    this.state = {
      pattern: ''
    };

    this.handleConcern = this.handleConcern.bind(this);

    this.course = {
      init: false,
      handle: false,
      checking: false
    };
    this.hasMounted = true;

  }

  componentWillReceiveProps(nextProps) {
    const _this = this;
    const {initConcernData} = nextProps;
    if (!initConcernData || _this.course.checking || _this.course.init) {
      return;
    }
    _this.course.checking = true;
    const objectId = nextProps.id;
    GetUserInfo().then((res) => {
      Http.post('/api-user/api/userAttention/IsItemUserAttention', {
        body: {
          appId: Host.appId,
          objectId,
          sourceType:15
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        requestSerializerType: '0'
      }, false).then((resp) => {
        if (resp.code == 200 && resp.dataMap) {
           _this.setState({
            pattern: ' concerned'
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

  handleConcern(e) {
    e.stopPropagation();
    //是否回调大数据
    this.props.concernBigData && this.props.concernBigData()
    const _this = this;
     if (!_this.course.init) {
       return false;
     }
    if (_this.course.handle) {
      Toast.info('哎哟喂，操作失败', 1);
      return false;
    }
    _this.course.handle = true;
    GetUserInfo().then((res) => {
      const objectId = _this.props.id;
      let url;
      const body = {
        appId: Host.appId,
        objectId,
        sourceType:15,
        channel:"deco"
      };
      if (_this.state.pattern == ' concerned') {
        url = '/api-user/api/userAttention/cancelUserAttention';
      } else if (_this.state.pattern == '') {
        url = '/api-user/api/userAttention/addUserAttention';
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
              pattern: ' concerned'
            });
            Toast.success('关注成功', 1);
          } else {
            _this.hasMounted && _this.setState({
              pattern: ''
            });
            Toast.success('取消关注', 1);
          }
        } else if (data.code == -401) {
          Login();
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
    const pattern = `com-concern${this.state.pattern}`;
    return (
      <div className={pattern} onClick={this.handleConcern}>{this.state.pattern==""?"关注TA":"已关注"}</div>
    );
  }
}
