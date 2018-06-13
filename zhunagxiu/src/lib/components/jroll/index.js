import React from 'react'
const JRoll = require('jroll')

export default class Jroll extends React.Component {
  constructor(props) {
    super(props)
    this.jroll = null
    this.state = {
      moveStep:1,
    }
  }
  componentDidMount() {
    let wrappers = this.props.id || 'wrappers'
    this.jroll = new JRoll(`#${wrappers}`)
    // document.addEventListener('touchmove', this.handler, false);
    this.jroll.refresh()
  }



  componentWillMount(){
    // if(this.state.moveStep == 2){
    //   console.log(this.state)
    //   this.jroll.scrollToElement("#page2",1000);
    // }

    // this.jroll.on("touchEnd",function () {
      // if(this._s.startY>this._s.lastY){
      //   console.log(this)
      //   that.jroll.scrollToElement("#page2",1000);
      // }else{
      //   that.jroll.scrollTo(0,0, 1000);
      //
      // }
    // }).scrollToElement("#page2",1000);
  }


  // handler(e){
  //   console.log(123)
  //   event.preventDefault()
    // const that = this
    // this.jroll.on("touchEnd",function () {
    //   if(this._s.startY>this._s.lastY){
    //     console.log(this)
    //     this.setState({
    //       moveStep:2
    //     })
    //     // that.jroll.scrollToElement("#page2",1000);
    //   }else{
    //     this.setState({
    //       moveStep:3
    //     })
    //     // that.jroll.scrollTo(0,0, 1000);
    //   }
    // })
  // }



  componentDidUpdate() {
    this.jroll.refresh()
  }

  componentWillUnmount() {
    document.removeEventListener('touchmove', this.handler, false);
  }


  render() {

    const { height } = this.props
    return (
      <div id={this.props.id ? this.props.id : 'wrappers'} style={{height: height ? height : "100%"}}>
        <ul>
         {this.props.children}
        </ul>
      </div>
    )
  }
}
