import React,{Component} from 'react';
import './style.scss'
import Host from '../../../../lib/scripts/config_host'
export default class CaseItem extends Component{
  constructor(props){
    super(props)

  }

  toCaseDetail(caseId){

      if(window.location.protocol != 'file:'){
        window.location = Host.path+`/mainapp/caseAnalyseDetail.html?detailId=${caseId}&back=h5`;
      }else{
        window.location = Host.path+`/mainapp/caseAnalyseDetail.html?detailId=${caseId}&back=file`;
      }



  }

  render(){
    const {area,designStyleStr,houseTypeStr,title,imgUrl,caseId} = this.props
    return (
      <div className="caseItem" onClick = {this.toCaseDetail.bind(this,caseId)} >
        <div className="casePic" style = {{background:`url(${imgUrl}.750x420.png!) no-repeat center`}}></div>
        <div className="caseTitle">{title}</div>
        <div className="desc">
          <span>{houseTypeStr+` /` || ""}</span>
          <span>{designStyleStr+` /` || ""}</span>
          <span>{area || "" }</span></div>
      </div>
    )
  }



}
