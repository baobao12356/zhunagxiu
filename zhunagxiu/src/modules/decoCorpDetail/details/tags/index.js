/**
 * Created by junwei.yin on 2017/6/6.
 */
import React from 'react';
import './style.scss';
// import Hybrid from '../../../../lib/scripts/hybrid';
import HybridBridge from 'rs-hybrid-bridge';

export default class Tags extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      tagList:""
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      tagList:nextProps.label
    })
  }

  goToNative(param){
    const dataNative = {
      tag:'43',
      type:param
    };
    // Hybrid.callHybridMethod('tagsList', 'call_native', dataNative).then((data) => {});
    new HybridBridge(window).hybrid('call_native', dataNative);
  }

  tagList(){
    const tags=[]
      if(this.state.tagList !=undefined && this.state.tagList){
        let tagArr = this.state.tagList.split(',');
        const Imgs1 = (data,idx)=>(<div className={data=='环保工地'?'hide':''} key={idx}>{data}</div>);
        return (
          (() => {
            tagArr.map((item,idx)=>{
              tags.push(Imgs1(item,idx))
            })
            return <div className="tags">{tags}</div>
          })()
        )
      }else{
        return tags
      }

  }

  render(){
    const List = this.tagList();

    return  (
      <div>
        {List}
      </div>
    )
  }

}
