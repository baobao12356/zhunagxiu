/**
 * Created by feifei on 2017/12/16.
 */
import React from 'react';
import './style.scss';
import BigData from '../../../../lib/scripts/bigData';
import HybridBridge from 'rs-hybrid-bridge';
import Env from 'rs-browser';



export default class Diaries extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      diaries:[],
      detailId:''
    }
    this.point = new BigData();
    this.goToNative = this.goToNative.bind(this);
    this.goToDiary = this.goToDiary.bind(this)


  }
  componentWillReceiveProps(nextProps){
    this.setState({
      diaries:nextProps.detailInfo.diaryList,
      diaryCounts:nextProps.detailInfo.diaryCounts,
      detailId:nextProps.detailId
    })
  }

  goToNative(){
    if(this.state.diaries && this.state.diaries.length!=0){
      // this.point.f('110.300.55.59.68.78.79', 'deco', 'page.detail.company','page_companydetailbookmore', 'page_companydetailbookmore','p_action_id');
      const dataNative = {
        tag:'71',
        companyId:this.state.detailId
      };
      new HybridBridge(window).hybrid('call_native', dataNative);
    }
  }
  goToDiary(diaryId){
    // this.point.f('110.101.55.64.68.78.79', 'deco', 'page.detail.company','page_companydetailbookdetail', 'page_companydetailbookdetail','p_action_id');
    window.location.href='/mainapp/decoDiaryDetails.html?detailId='+diaryId+'&__open=1'
  }

  render(){
    let item;
    if(this.state.diaries){
      item = this.state.diaries[0];
    }
    return  (
      <div>
        {this.state.diaries && this.state.diaries.length>0 &&
        <div className="diaries">
          <div>业主日记
            {
              Env.rsApp && this.state.diaryCounts>1 && <div><div></div><span onClick={this.goToNative.bind(this)}><span style={{'color':'#dfaf7D'}}>{this.state.diaryCounts}</span> 个日记</span></div>
            }
          </div>
          {this.state.diaries ?
            <div>
              <div onClick={this.goToDiary.bind(this,item.id)}>
                {item.stage?<div className="diaryTag">
                  {item.stage}
                </div>:''}
                <div className="diaryCover"
                     style={{'backgroundImage':'url('+item.cover+'.750x420.png!)'}}></div>
                <div className="diaryName">{item.title}</div>
                <div className="diaryTips">
                  {item.amount?<span>{item.amount}万</span>:''}
                  {item.area?<span>{item.area}㎡</span>:''}
                  {item.houseType?<span>{item.houseType}</span>:''}
                  {item.decStyle?<span>{item.decStyle}</span>:''}
                </div>
              </div>
            </div>:<div className="blockNothing">暂无日记</div>
          }
        </div>
        }
      </div>
    )
  }

}
