import React, {Component} from 'react';
import './style.scss';
import cs from 'classnames'
// import SlideBar from '../slideBar';
import { Range, WingBlank, WhiteSpace } from 'antd-mobile';

export default class SelectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleImg: false,
      styleDisplay: false,
      typeImg: false,
      typeDisplay: false,
      styleIsPress: "",
      typeIsPress: "",
      typeList: "",
      styleList: "",
      designStyle: "",
      houseCategory: "",
      aptitudeDisplay: false,
      aptitudeImg:false,
      range:'',
      soer:'',
      aptitudePress:0,
      slideLeft:0,
      slideRight:2000,
    };
     this.styleClick = this
      .styleClick
      .bind(this);
     this.typeClick = this
      .typeClick
      .bind(this);
      this.aptitudeClick=this.aptitudeClick.bind(this);
      this.resetValClick=this.resetValClick.bind(this);
  }




  componentWillReceiveProps(nextProps) {
    this.setState({styleList: nextProps.styleTypeList[0], typeList: nextProps.styleTypeList[1]})
  }


  styleClick() {
    this.setState({
      styleImg: !this.state.styleImg,
      styleDisplay: !this.state.styleDisplay,
      typeImg: false,
      typeDisplay: false,
      aptitudeDisplay: false,
      aptitudeImg:false,
    })
    console.log(this.props)
    console.log(!this.props.styleShadow)
    this
      .props
      .shadowShow(!this.state.styleImg);
  }


   typeClick() {
    this.setState({
      typeImg: !this.state.typeImg,
      typeDisplay: !this.state.typeDisplay,
      styleImg: false,
      styleDisplay: false,
      aptitudeDisplay: false,
      aptitudeImg:false,
    })

    this.props.shadowShow(!this.state.typeImg);
  }



  aptitudeClick() {
    this.setState({
      typeImg: false,
      typeDisplay: false,
      styleImg: false,
      styleDisplay: false,
      aptitudeDisplay: !this.state.aptitudeDisplay,
      aptitudeImg:!this.state.aptitudeImg,
    })

    this.props.shadowShow(!this.state.typeImg);
  }




  styleBabel(e,styleCsid, designStyle='',houseCategory='') {
    e.stopPropagation();
    e.preventDefault();
  console.log('designStyle, houseCategory',styleCsid,designStyle)

    this.setState({
      styleIsPress: styleCsid,
      styleImg: false,
      styleDisplay: false,
      typeImg: false,
      typeDisplay: false,
      aptitudeDisplay: false,
      aptitudeImg:false,
      designStyle: designStyle
    })

      this.props.shadowShow(false);
      this.props.getCaseList(2001,1, designStyle, this.state.houseCategory,this.state.range,this.state.sort,1);

  }



  typeBabel(e,typeCsid, designStyle='', houseCategory='') {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
   typeIsPress: typeCsid,
   styleImg: false,
   styleDisplay: false,
   typeImg: false,
   typeDisplay: false,
   aptitudeDisplay: false,
   aptitudeImg:false,
   houseCategory: houseCategory
 })
 this.props.shadowShow(false);
 this.props.getCaseList(2001,1, this.state.designStyle, houseCategory,this.state.range,this.state.sort,1);

}



aptitudeBabel(e,designStyle='', houseCategory='',range,sort) {
  e.stopPropagation();
  e.preventDefault();

  this.setState({
 styleImg: false,
 styleDisplay: false,
 typeImg: false,
 typeDisplay: false,
 aptitudeDisplay: false,
 aptitudeImg:false,
 range:range,
 sort:sort,
})

this.props.shadowShow(false);
 this.props.getCaseList(2001,1, this.state.designStyle, this.state.houseCategory,range,sort,1);

}




selectAptitude(range){
    this.setState({
      range: `${range[0]?range[0]:0}-${range[1]?range[1]:2000}`,
      slideLeft:Number(range[0]),
      slideRight:Number(range[1]),
    })

}

selectCaseCount(sort,num){
    this.setState({
      sort: sort,
      aptitudePress:num,
    })
}

resetValClick(e){
  e.stopPropagation();
  e.preventDefault();
    this.setState({
      range :'',
      sort: 'designerPrice:desc;weightValue:desc',
      aptitudePress:0,
      slideLeft:0,
      slideRight:2000,
    })


}
  render() {
    let styles,types;
    const {
      styleList,
      styleImg,
      typeImg,
      styleDisplay,
      styleIsPress,
      typeDisplay,
      houseCategory,
      designStyle,
      typeIsPress,
      typeList,
      aptitudeDisplay,
      aptitudeImg,
      range,
      sort,
      aptitudePress,
      slideLeft,
      slideRight,
    } = this.state;
     styleList?styleList:(this.props.styleTypeList[0]);
     typeList?typeList:(this.props.styleTypeList[1]);
    if (styleList) {
      styles = Object
        .values(styleList.typeData)
        .map((item, i) => {
          return (
            <li
              objectId={item.objectId}
              key={i + 1}
              className={cs({'click_active': styleIsPress == i + 1})}

              onClick={(e) => this.styleBabel(e,i + 1, item.objectVal,houseCategory)}>{item.objectVal}</li>
          )
        })

    }

    if (typeList) {
      types = Object
        .values(typeList.typeData)
        .map((item, i) => {
          return (
            <li
              objectId={item.objectId}
              key={i + 1}
              className={cs({'click_active': typeIsPress == i + 1})}

              onClick={(e) => this.typeBabel(e,i + 1, designStyle, item.objectVal)}>{item.objectVal}</li>
          )
        })
    }

    return (
      <div id="topSelect" className="select_more">

        <div className="aptitudeTab" onClick={this.aptitudeClick}>
          <span className={aptitudeImg
            ? "icon-up"
            : "icon-down"}>{sort=='caseCount:desc'?'精选案例最多':'智能筛选'}</span>
        </div>

        <div className="styleTab" onClick={this.styleClick}>
          <span className={styleImg
            ? "icon-up"
            : "icon-down"}>{designStyle?designStyle:'擅长风格'}</span>
        </div>

        <div className="typeTab" onClick={this.typeClick}>
          <span className={typeImg
            ? "icon-up"
            : "icon-down"}>{houseCategory?houseCategory:'擅长户型'}</span>
        </div>

        {styleDisplay && <div className="styleDropDown">
          <ul>
            <li
              objectId={0}
              key={0}
              className={cs({'click_active': styleIsPress ==0})}

              onClick={(e) => this.styleBabel(e,0, '',houseCategory)}>不限</li>
            {styles}
          </ul></div>}

        {typeDisplay && <div className="typeDropDown">
              <ul>
                <li
                  objectId={0}
                  key={0}
                  className={cs({'click_active': typeIsPress ==0})}
                  onClick={(e) => this.typeBabel(e,0, designStyle, '')}>不限</li>
                {types}
              </ul>
            </div>
          }

        {aptitudeDisplay && <div className="aptitudeDropDown">
          <div className="aptitudeRange">
            <div>智能筛选</div>


            <div>
              <span   className={cs({'click_active':aptitudePress==0})}
               onClick={()=>{this.selectCaseCount('designerPrice:desc;weightValue:desc',0)}}>智能筛选</span>
              <span   className={cs({'click_active':aptitudePress==1})}
              onClick={()=>{this.selectCaseCount('caseCount:desc',1)}}>精选案例最多</span>
            </div>
            <div>价格区间(元)</div>
            <div>
              <div>
                  <div>&yen;{slideLeft?slideLeft:0}</div>
                  <div>&yen;{slideRight?slideRight:2000}</div>
              </div>

              <div>

                <div className="am-slider-example">
                        <WingBlank size="lg">
                      <Range
                        style={{ marginLeft: 30, marginRight: 30 }}
                        min={Number(0)}
                        max={Number(2000)}
                        defaultValue={[this.state.slideLeft,this.state.slideRight]}
                        value={[this.state.slideLeft,this.state.slideRight]}
                        onChange={(values)=>this.selectAptitude(values)}
                        trackStyle={[{ backgroundColor: '#F85959' }]}
                        handleStyle={[{ backgroundColor: '#fff' }, { backgroundColor: '#fff' }]}
                      />
                    </WingBlank>
                      </div>
              </div>

              <div>
                <div>&yen;{'0'}</div>
                <div>&yen;{'2000'}</div>
              </div>


            </div>

          </div>

          <div>
            <div onClick={(e)=>this.resetValClick(e)}>重置</div>
            <div
            className={cs({'click_active':true})} onClick={(e)=>{
                 this.aptitudeBabel(e,designStyle,this.state.houseCategory,range,sort)
            }}>完成</div>
          </div>
        </div>
           }
      </div>
    )
  }
}



