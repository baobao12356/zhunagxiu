import React ,{Component} from 'react'
import Appointment from './componentsItem/appointment/appointment'
import CaseItem from './componentsItem/caseItem/caseItem'
import Header from './componentsItem/header/header'
import Scroll  from 'react-scroll';
import cs  from 'classnames';
import Env from 'rs-browser';


var Link       = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;
import _ from 'lodash'
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

  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(this.props, nextProps) || !_.isEmpty(this.props)) {
      return false
    }
    return true
  }



  render(){
    const {caseList,openid,id,converImg} = this.props
    let caseList0 = String(caseList);
    let style1,style2;
    if(caseList0 == '' || caseList0 == 'undefined'){
      style1 = {'overflow':'hidden'};
      style2 = {'display':'none'};
    }

    const pointAeservation = {
      id: '2790',
    };

    return(
          <div className="master">
            <Header text="约TA设计" cls="header_3" openid = {openid} id={id}  />
            <div id="sliderItemBox" className="sliderItemBox" style={style1}
                 onTouchStart = {this.startTouch.bind(this)}
                 onTouchMove = {this.moveTouch.bind(this)}
                 onTouchEnd= {this.endTouch.bind(this)}
            >
              <div id="pic" className={Env.ios?`itemSilder`:`itemSilder-andriod`} style={{background:`url(${converImg}) no-repeat center`,backgroundSize:`auto 100%`}}>
                  <div className="masterAppointments" >
                    <Appointment text="约TA设计" id={id} openid = {openid} pointAeservation={pointAeservation} f={this.props.f}/>
                  </div>
                  <div className="nextPage" onClick = {this.scrollToEle.bind(this)} style={style2}></div>
              </div>

              <div name="myScrollToElement" className="itemSilder caseItems">

                          {
                            (caseList && caseList.length>0) ?caseList.map((val,idx)=>{
                              return <CaseItem {...val} key = {idx} />
                            }): ""
                          }
              </div>
            </div>
          </div>
    )
  }












}
