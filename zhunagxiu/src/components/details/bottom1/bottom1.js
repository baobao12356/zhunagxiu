/**
 * Created by feifei on 2017/6/13.
 */
import React, {Component} from 'react';
import './bottom1.scss';
import HybridOpenPageNewEvaluationList from 'rs-hybrid-open-page-new-evaluation-list';
import BottomModel from '../../../models/BottomModel';
import HybridBridge from 'rs-hybrid-bridge';
import Hybrid from '../../../lib/scripts/hybrid';
import GetUserInfo from '../../../lib/scripts/getUserInfo';
//import HybridOpenPageLogin from 'rs-hybrid-open-page-login';


export default class Bottom1 extends Component {

  constructor(props) {
    super(props);
    const that = this;

    that.hybridOpenPageNewEvaluationList = new HybridOpenPageNewEvaluationList();
    that.onHybridOpenPageNewEvaluationList = that._onHybridOpenPageNewEvaluationList.bind(that);
    that.hybridBridge = new HybridBridge(window);
    that.onHybridBridge = that._onHybridBridge.bind(that);
    //that.hybridOpenPageLogin = new HybridOpenPageLogin();
    //that.onHybridOpenPageLogin = that._onHybridOpenPageLogin.bind(that);

    that.BottomModel = new BottomModel();

    this.state = {
      CommentLength: 0,
      likedCount: 0,
      likeState:0,
      collectState: 0,
      id: this.props.bottomInfo[0],
      likeType: this.props.bottomInfo[1],
      collectType: this.props.bottomInfo[2],
      channel: this.props.bottomInfo[3],
      commentType: this.props.bottomInfo[4],
      title: '',
      picture: '',
      userId: '',
      token: ''
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      title: nextProps.detailInfo.title,
      picture: nextProps.detailInfo.cover
    });
  }

  componentDidMount() {
    GetUserInfo().then((res) => {
      this.setState({
        userId:res.sessionid,
        token: res.sessionid
      });

      this.initBottomInfo(this.state.id,this.state.likeType,this.state.collectType,this.state.commentType,res.sessionid,res.sessionid);
    }).catch((e) => {
      console.log(e);
      Hybrid.callHybridBasicInfo('getPhoneUuid', 'getter').then((res) => {
        if ( !!res.hxiphoneUUID ) {
          this.setState({
            userId:res.hxiphoneUUID
          });
          this.initBottomInfo(this.state.id,this.state.likeType,this.state.collectType,this.state.commentType,res.hxiphoneUUID,'');
        }
      }).catch((e) => {
        console.log(e);
        let userNum0 = 'a_' + Date.now() + '_' + (Math.random() * Math.random()).toString(15).substr(2, 32),
          userNum1 = localStorage.getItem('userNum');
        let userNum = userNum1 || userNum0;
        localStorage.setItem('userNum',userNum);
        this.initBottomInfo(this.state.id,this.state.likeType,this.state.collectType,this.state.commentType,userNum,'');
      })
    });
  }

  initBottomInfo(id,likeType,collectType,commentType,userId,token) {
    this.BottomModel.ReceiveLikedInfo(id, likeType,userId)
    .then((data)=> {//设置详情状态
      this.setState({
        likedCount:data.dataMap.likedCount,
        likeState:data.dataMap.isUserLiked
      })
    })
    .catch((error)=> {
      console.log('接收点赞信息失败', error);
    });

    this.BottomModel.ReceiveCollectionInfo(id, collectType,userId)
      .then((data)=> {//设置详情状态
        this.setState({
          collectState:Number(data.dataMap)
        })
      })
      .catch((error)=> {
        console.log('接收收藏信息失败', error);
      });

    this.BottomModel.ReceiveCommentLength(id,commentType)
      .then((data)=> {//设置详情状态
        this.setState({
          CommentLength:data.dataMap.totalElements
        });
      })
      .catch((error)=> {
        console.log('接收评论数失败', error);
      });
  }

  _onCollect() {
      let currentState = this.state.collectState;
      let collectParams = {
        collectionType: this.state.collectType,
        id: this.state.id,
        channel: this.state.channel,
        title: this.state.title,
        picture: this.state.picture
      };
      if(currentState == 0){
        this.BottomModel.AddCollection(collectParams,this.state.userId)
          .then((data)=> {//设置详情状态
            if(data.code == -401){
              this._onHybridOpenPageLogin()
            }else{
              this.setState({
                collectState:Number(!Boolean(currentState))
              });
            }

          })
          .catch((error)=> {
            console.log('添加收藏失败', error);
          });
      }else{
        this.BottomModel.CancelCollection(collectParams.id,collectParams.collectionType,this.state.userId)
          .then((data)=> {//设置详情状态
            this.setState({
              collectState:Number(!Boolean(currentState))
            });
          })
          .catch((error)=> {
            console.log('取消收藏失败', error);
          });
      }

  }

  _onLike() {
    let likeAction,currentState = this.state.likeState;
    if(currentState == 0){
      likeAction = 'Add';
    }else{
      likeAction = 'Cancel';
    }
    this.BottomModel.ClickLike(this.state.id,this.state.likeType,likeAction,this.state.userId,this.state.userId)
      .then((data)=> {//设置详情状态
        let likedCountSignOut = this.state.likedCount;
          if(likeAction == 'Add'){
            this.setState({
              likedCount:likedCountSignOut+1,
              likeState: Number(!Boolean(currentState))
            })
          }else{
            this.setState({
              likedCount:likedCountSignOut-1,
              likeState: Number(!Boolean(currentState))
            })
          }
      })
      .catch((error)=> {
        console.log('点击点赞失败', error);
      });
  }

  _onHybridOpenPageNewEvaluationList() {
    // 使用方法
    let parameter = {
        tag:"30",
        type:"review_house_atical",
        targetID:this.state.id
    };

    if (Hybrid.os.android) {
      window.hybrid._app_call('getUuid', 'call_native', JSON.stringify(parameter));
    } else if (Hybrid.os.ios) {
      window._app_call('getUuid', 'call_native', JSON.stringify(parameter));
    }
    //this.hybridOpenPageNewEvaluationList.open(this.state.id, 'jz_baike').then((result)=> {
    //}).catch((error)=> {
    //  console.log('跳转评论列表失败')
    //});
  }

  _onHybridBridge() {
    /**
     *
     * 调用hybrid方法
     * 跳转评论
     * @param {String} action 与hybrid对应的关键字
     * @param {Object} parameter 参数
     * @param {Object} version 版本信息,可不传
     */
    let parameter = {
      targetID: this.state.id,
      type:'review_house_atical',
      tag:'14'
  }
    this.hybridBridge.hybrid('call_native', parameter).then((result)=> {
      // ...
    }).catch((error)=> {
      console.log('跳转native评论页面失败')
    });
  }

  _onHybridOpenPageLogin(){
    if (Hybrid.os.android) {
      window.hybrid._app_call('login', 'call_native', JSON.stringify({'tag':2}));
    } else if (Hybrid.os.ios) {
      window._app_call('login', 'call_native', JSON.stringify({'tag':2}));
    }
    this._onCollect()
  }


  render() {
    return (
      <div className="bottom1">
        <div className="comment" onClick={this._onHybridBridge.bind(this)}>发表评论</div>
        <div>
          <span className="commentList" onClick={this.onHybridOpenPageNewEvaluationList}>{this.state.CommentLength}</span>
          <span className={"clickLike likeClick"+this.state.likeClick+" likeState"+this.state.likeState} onClick={this._onLike.bind(this)}>{this.state.likedCount}</span>
          <span className={"clickCollect collectState"+this.state.collectState} onClick={this._onCollect.bind(this)}>收藏</span>
        </div>
      </div>
    )
  }
}
