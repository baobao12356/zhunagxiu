/**
 * Created by feifei on 2017/6/12.
 */
import React from 'react';
import './style.scss';

export default class Footer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      recommends:[],
      designers:[],
      starScores:0
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      recommends: nextProps.detailInfo.recommends,
      designers: nextProps.detailInfo.designerVoList
    })
  }

  render(){
    let directPage = String(window.location).split('=')[0]+'=';
    let style1,styleState = 0;
    if(this.state.recommends == ''){
      style1 = {display:'none'};
      styleState = 1;
    }
    return(
      <footer>
        <div className="line"></div>
        <div className={"designerList"+styleState}>
          {
            this.state.designers.map(function (item) {
              return (
                <div className="articleDesigner">
                  <div className="articleDesignerInfor">
                    <img className="designer_head" src={item.avatarUrl}/>
                    <div className="articleDesignerRight">
                      <span className="articleDesignerName">{item.realName}</span>
                      <div className="articleDesignerStarDad">
                        <div className={"articleDesignerStar starScores"+item.commentCntScore}>
                          <div></div><div></div><div></div><div></div><div></div>
                        </div>
                        <span className="articleDesignerWord">已接<span className="articleDesignerNum">{item.designerBookingCount}</span>单</span>
                      </div>
                    </div>
                  </div>
                  <div className="articleDesignerFee">
                    设计费：<span className="articleDesignerFeeBegin">{item.designerBudgetStart}</span>-<span className="articleDesignerFeeEnd">{item.designerBudgetEnd}</span>元/m²
                  </div>
                </div>
              )})
          }
        </div>
        <div style={style1}>
          <div className="details">相关推荐</div>
          <div className="detailsLine"></div>
          <ul>
            {
              this.state.recommends.map(function (item) {
                return (
                  <a data-articleId ={item.articleId} href={directPage+item.articleId}>
                    <img className="detailListLeft" src={item.cover}/>
                    <div className="detailListRight">
                      <p>{item.title}</p>
                      <span>{item.categoryTag}</span>
                    </div>
                  </a>
                )})
            }
          </ul>
        </div>
      </footer>
      )
  }
}
