
import React,{Component} from 'react';
import cs from 'classnames';
import './style.scss';
import noCase from '../../img/noCase.png'
import Host from '../../../../lib/scripts/config_host';
import BigData from '../../../../lib/scripts/bigData';

export default class Details extends Component{
  constructor(props){
    super(props);
    console.log(this.props.noCase)
  }

 /* goCaseDetails(caseId){
    window.location = `/mainapp/caseAnalyseDetail.html?detailId=${caseId}`;
  }*/
  goDesignerDetails(id){
    this.point = new BigData();
    this.point.f('83022626-4bce-4707-a1b8-744deb090683', 'home', 'page_softdesigner_list','','softdesigner',id, id);
    if(window.location.protocol != 'file:'){
      window.location = Host.path+`/mainapp/designerNormalDetail.html?detailId=${id}&serviceShowFlag=1&back=h5`;
    }else{
      window.location = Host.path+`/mainapp/designerNormalDetail.html?detailId=${id}&serviceShowFlag=1&back=file`;
    }
  }

  render(){
    const imgList = this.props.imgList;
    let imgItems,num=0;
    if(!!this.props.imgList&&this.props.imgList.length){
      imgItems =imgList.map((item,idx)=>{
          num++
          return (
            <section className="desiger_detail" key={idx}>
             <div className="designerBox" >
              <div className="designerInfo"  onClick={this.goDesignerDetails.bind(this,item.id)}>
                <div>
                  <img src={item&&item.image_url&&`${item.image_url}`} alt=''/>
                </div>
                <div>
                  <div className="tags">
                    <span>{item&&item.name}</span>
                    <span></span>
                    <span>{`从业${item&&item.years}`}</span>
                  </div>
                  <div className="designerName">
                    <div>{item&&item.personalBrightSpot}</div>
                  </div>


                  <div className="style_list">
                    <ul>
                      {
                        item.knowledgeStyle&&item.knowledgeStyle.split(',')&&item.knowledgeStyle.split(',').map((v,i)=>{
                          return <li key={i}>{v}</li>
                        })
                      }

                    </ul>
                  </div>
                </div>

                <div className="designerpoint">
                  {item&&item.experiencePrice?<div>&yen; <span>{item&&item.experiencePrice }</span>/㎡</div>:''}
                  {item. designerBudget? <div className={cs({'under_line':!item.experiencePrice&&item. designerBudget})} >&yen; <span>{item&&item. designerBudget}</span>/㎡</div>:''}
                </div>

              </div>
              {/*<div className="casePic">
                <div>
                {  item.caseCoverUrls&&item.caseCoverUrls.map((imgurl,num)=>{
                  return <div className="img_arr" key={num} onClick={this.goCaseDetails.bind(this,imgurl.caseId)}>
                    <img src={imgurl&&`${imgurl.coverImage}.670x376.png!`} alt=''/>
                  </div>
                })
                }
                </div>
              </div>*/}
            </div>
            <div className="line_select"></div>
          </section>

          );

        });
    }

    return(
      <div id="details">
        <div className={cs({"shadow":this.props.shadowShowHide})} ></div>
        {imgItems}
        <div className={cs({"noCaseImg":true,"noCase":this.props.noCase})}>
          <img src={noCase}/>
          <p>没有搜索结果</p>
          <p>可以减少筛选内容试试</p>
        </div>
      </div>

    )
  }
}

