/**
 * Created by feifei on 2017/6/12.
 */
import React from 'react';
import './style.scss';
import ChangeNumber from '../../../../lib/scripts/changeNumber';
import HybridBridge from 'rs-hybrid-bridge';


export default class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tagArr: [],
      lableIds:''
    }

    this.hybridBridge = new HybridBridge(window);
    this.onHybridBridge = this.selectLabel.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      tagArr: nextProps.detailInfo.lables || [],
      lableIds: nextProps.detailInfo.lableIds,
      viewTimes: nextProps.viewTimes||"",
    });
  }

  selectLabel(item,id){
    console.log('点击tag:'+item);
    this.props.f({
      id:'999',
      p_action_id:`tag=${id||''}`

    })
    let parameter = {
      label: item,
      labelId: id,
      tag: 57
    }

    this.hybridBridge.hybrid('call_native', parameter).then((result)=> {
    }).catch((error)=> {
      console.log('跳转native标签列表失败')
    });


  }

  render(){
    let myViewCount = ChangeNumber(this.state.viewTimes);
    return(
      <header className="article-tit">
        <p>{this.props.detailInfo.title}</p>
        <div className="label">
          <div className="labelList">
            {
              this.state.tagArr.map((item,index) => {
                if(index>2){
                  return
                }
                return (
                  <span key={index} onClick={this.selectLabel.bind(this,item,this.state.lableIds.split(',')[index],index)}>{item}</span>
                )
              })
            }
          </div>
          <div className="labelRight">
            <div className="labelRightImg"></div>
              <span className="views">{myViewCount?myViewCount:0}</span>
          </div>
        </div>
      </header>
      )


  }

}
