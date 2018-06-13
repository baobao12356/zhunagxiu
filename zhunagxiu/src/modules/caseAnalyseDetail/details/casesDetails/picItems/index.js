/**
 * Created by junwei.yin on 2017/6/6.
 */
import React from 'react';
import Host from '../../../../../lib/scripts/config_host';
import RowComponent from './RowComp'
// import Hybrid from '../../../../../lib/scripts/hybrid';
import HybridBridge from 'rs-hybrid-bridge';
export default class DesignerInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      picInfo: {},
      casesId: "",
      caseTitle: ""
    }
  }
  componentWillReceiveProps(nextProps) {
    let picCounts = [];
    let picItems = [];
    nextProps.picInfo && [...nextProps.picInfo].map((rowData, idx) => {
      if (rowData.imageUrls) {
        picCounts.push(rowData.imageUrls.length)
        rowData.imageUrls.map((val, ids) => {
          picItems.push({ "url": val, "title": rowData.objectName })
        })
      } else {
        picCounts.push(1)
        picItems.push({ "url": rowData.imageUrl, "title": rowData.objectName })
      }
    });

    this.setState({
      picInfo: nextProps.picInfo,
      picCounts: picCounts,
      picItems: picItems,
      casesId: nextProps.casesId,
      caseTitle: nextProps.caseTitle.title
    })
  }

  goToNative(idx, num) {
    const { designerId, realName, designerLevel, designerImgUrl, designerBudget } = this.props.detailInfo;
    let casesId = this.props.casesId
    let countsArr = this.state.picCounts
    let picItems = this.state.picItems
    let newArr = countsArr.slice(0, idx)
    let casetitle = this.state.caseTitle
    let index = idx == 0 ? num - 1 : eval(newArr.slice(0, (idx)).join('+')) * 1 + num * 1 - 1
    const dataNative = {
      tag: '25',
      data: {
        "ID": casesId,
        "objectType": 'case',
        "currentIndex": index,
        "share": {
          "link": `${Host.path}/mainapp/caseAnalyseDetail.html?detailId=${casesId}`,
          "title": casetitle,
          "text": "快看看这个装修案例中的图片，我觉得设计得非常好。",
          "image": 'https://img3.mklimg.com/g1/M00/1E/57/rBBrBVnoWeiAOYodAABqz3u-384492.png!'
        },
        "photos": picItems,
        "designer": {
          "id": designerId,
          "name": realName,
          "level": designerLevel,
          "budget": designerBudget,
          "avatar": designerImgUrl
        }
      }
    }
    // Hybrid.callHybridMethod('selectImg', 'call_native', dataNative).then((data) => {});

    new HybridBridge(window).hybrid('call_native', dataNative);

  }

  render() {
    console.log(1111111, this.props.detailInfo)
    let arr = (<div></div>)
    if (this.state.picInfo) {
      arr = [...this.state.picInfo].map((rowData, idx) => {
        return (<RowComponent data={rowData} num={idx} clickPic={this.goToNative.bind(this)} key={idx} />)
        //return (<div>123</div>)
      });
    }
    console.log(arr)
    return (<div>{arr}</div>)
  }

}
