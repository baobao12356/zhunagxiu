import React ,{Component} from 'react'
import Appointment from './componentsItem/appointment/appointment'
import CaseItem from './componentsItem/caseItem/caseItem'
import Header from './componentsItem/header/header'
import Scroll  from 'react-scroll';
import Env from 'rs-browser';
import Concern from '../../lib/components/concern'
import back from '../../lib/scripts/back';
var Link       = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;
import './style.scss'


export default class DesignerMaster extends Component{

  constructor(props){
    super(props)
    this.state = {
      moveDown:false,
      moveUp:false,
      pageIndex:0,
      pageY:0,
      changeY:true,
      id:""
    }
  }




  componentDidMount() {

    Events.scrollEvent.register('begin', function(to, element) {
      console.log("begin", arguments);
    });
    Events.scrollEvent.register('end', function(to, element) {
      console.log("end", arguments);
    });
    scrollSpy.update();
    this.setState({
      id:this.props.id
    })
  }


  scrollToEle() {
    let moveHeight = window.screen.height
    scroll.scrollTo(moveHeight);
  }
  scrollToTopEle() {
    scroll.scrollToTop();
  }

  startTouch(e){
    this.setState({
      pageY:e.touches[0].screenY
    })
  }

  moveTouch(e){
    e.stopPropagation();
    if(this.state.changeY){
      if(e.touches[0].screenY<this.state.pageY){
        this.setState({
          moveDown:true,
          changeY:false
        })
      }else{
        this.setState({
          moveDown:false,
          changeY:false
        })
      }
    }


  }

  endTouch(e){

    e.stopPropagation();
    this.scrollTime = setTimeout(()=>{
      if(this.state.moveDown){
        this.scrollToEle()
      }else{
        let moveHeight = window.screen.height
        if(window.scrollY<moveHeight){
          this.scrollToTopEle()
        }
      }
      this.setState({
        changeY:true
      })
    },450)
  }


  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
    clearTimeout(this.scrollTime )
  }

  goBack(){
    console.log(this)
    back();
  }


  render(){
    const {caseList,openid,converImg,level} = this.props;
       let caseList0 = String(caseList);
    let style,style2;
    if(caseList0 == '' || caseList0 == 'undefined'){

      style2 = {'display':'none'};
    }
    return(
          <div className="master">
            <div className="header_3" style={{paddingTop:Env.ios?"20px":""}}>
              <div className="desginerBack" onClick={this.goBack.bind(this)}>
                <div className="back"></div>
              </div>
              <div className="designerPic">设计大师</div>
              <div className="btn">
                <Concern id = {this.state.id}  initConcernData={true} />
              </div>
            </div>
            <div id="sliderItemBox" className="sliderItemBox"
                 onTouchStart = {this.startTouch.bind(this)}
                 onTouchMove = {this.moveTouch.bind(this)}
                 onTouchEnd= {this.endTouch.bind(this)}
            >
              <div id="pic" className={Env.ios?`itemSilder`:`itemSilder-andriod`}  style={{background:`url(${converImg}!) no-repeat`}}>
                  <div className="masterAppointments" >
                    <Appointment text="约TA设计" id={this.state.id} openid = {openid}/>
                  </div>
                  <div className="nextPage" onClick = {this.scrollToEle.bind(this)} style={style2}></div>
              </div>
              {
                !!caseList &&
                <div name="myScrollToElement" className="itemSilder caseItems" style={{webkitOverflowScrolling: `touch`}}>
                  <div className="headerFix"></div>
                  {
                    (caseList && caseList.length>0) ?caseList.map((val,idx)=>{
                      return <CaseItem {...val} level={level} key = {idx} />
                    }): ""
                  }
                </div>
              }



            </div>
          </div>
    )
  }












}
