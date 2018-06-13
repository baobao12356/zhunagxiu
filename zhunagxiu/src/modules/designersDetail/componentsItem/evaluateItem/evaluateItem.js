import React,{Component} from 'react';
import './style.scss'
import HeadPic from '../../componentsItem/headPic/headPic'
export default class EvaluateItem extends Component{
  constructor(props){
    super(props)
  }

  starFun(score){
    let star =[];
    for(let i=0;i<5;i++){
      i<score?star.push(<span key={i} className="star"></span>):star.push(<span key={i} className="halfStar"></span>)
    }
    return star
  }

  render(){
    const {nickName,headerUrl,comment,createDate,totalScore,score} = this.props,
            setHead = {
            imgUrl:headerUrl,
            sizeIdx:1,
            clsName:"designerHeaderPic"
          },
    stars = this.starFun(totalScore)
    return (
      <div className="evaluateItem"  >
        <div className="user">
          <HeadPic {...setHead} />
          <div className="userInfo">
            <div>{nickName}</div>
            <div className="score">
              {stars}
              {score}
            </div>
          </div>
        </div>
        <div className="content">
          {comment}
        </div>
        <div className="evaluateTime">{createDate}</div>
      </div>
    )
  }



}
