import React ,{Component} from 'react';
import cs from 'classnames'
import './style.scss'
import HybridBridge from 'rs-hybrid-bridge';
import BigData from '../../../../lib/scripts/bigData';

export default class Appointment extends Component{
  constructor(props) {
    super(props);
    this.point = new BigData()
    const that = this;
    this.state = {
      designerOpenId:'',
      text:''
    };
    this.handleAppoint = this.handleAppoint.bind(this)
    that.hybridBridge = new HybridBridge(window);
    that.onHybridBridge = that.handleAppoint.bind(that);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      designerOpenId:nextProps.designerOpenId,
      text:nextProps.text
    })
  }


  handleAppoint() {
    const {desName} = this.props.desName || ""
    //预约埋点
    this.point.f('110.300.49.58.68.78.91', 'deco', 'page.designer.reservation',desName, 'p_reservation');

    let parameter = {
      roleType: "1",
      designerId: this.props.id,
      tag: 9,
      pageFrom:"app-sjsdx-10001"
    }
    console.log(parameter)
    this.hybridBridge.hybrid('call_native', parameter).then((result)=> {}).catch((error)=> {
      console.log('跳转native设计师预约失败')
    });
  }

  render(){
    const {text} = this.props
    return (<div className="appointment" onClick={this.handleAppoint}><span>{text}</span></div>)
  }



}
