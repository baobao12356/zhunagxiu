import React from 'react';
import cs from 'classnames';
import CorpDetailModel from '../../../models/CorpDetailModel';
import RichText from '../../../lib/components/richText';
import queryString from 'query-string';
import Host from '../../../lib/scripts/config_host';
import Nav from '../../../lib/components/nav';
import Env from 'rs-browser';
import onfire from 'onfire.js';
import './style.scss';
import '../../../lib/scss/base.scss';


export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(location.search);
    this.corpId = params.detailId;

    this.state = {
      detailInfo: {},
      webPadding: false   //切换padding-top
    };
  }


  componentDidMount() {
    let _this = this;
    this.handleAboutUs(this.corpId);

    if(!Env.rsApp){
      this.setState({
        webPadding:true
      })
    }

    onfire.on('closeTip',() => {
      this.setState({
        webPadding:false
      })
    })

  }
  handleAboutUs(corpId){
    CorpDetailModel.ReceiveAboutUs(corpId)
      .then((data)=> {//设置详情状态
        this.setState({
          detailInfo: data.dataMap
        });
      })
      .catch((error)=> {
        console.log('公司关于我们id不存在', error);
      });
  }



  render() {

    return (
        <div className={cs({"articleDetailBox":true,'app-wrap':Env.rsApp,'ios-nav': Env.rsApp && Env.ios,'box-bottom':Env.rsApp,'webPadding':this.state.webPadding, 'img-center': true})}>
          <Nav title='关于我们' initShareData="false" showTip={true} hideNav={true} shareIcon={false} />
          <div className="main">
            <RichText description = {this.state.detailInfo.introduction} preview="false"/>
          </div>
        </div>
    );
  }
}
