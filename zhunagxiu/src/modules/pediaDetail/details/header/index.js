/**
 * Created by feifei on 2017/6/12.
 */
import React from 'react';
import HybridBridge from 'rs-hybrid-bridge';
import './style.scss';


export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagArr: [],
    }
    this.hybridBridge = new HybridBridge(window);
    this.selectLabel = this.selectLabel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tagArr: nextProps.detailInfo.labelPartVos || [],
      viewTimes: nextProps.viewTimes
    });
  }

  selectLabel(item, id) {
    console.log('点击tag:' + item);
    this.props.f({
      id: '3372',
      p_action_id: `tag=${id}`
    });
    let parameter = {
      title: item,
      id: id,
      tag: 77
    }

    this.hybridBridge.hybrid('call_native', parameter).then((result) => {
    }).catch((error) => {
      console.log('跳转native标签列表失败')
    });
  }

  render() {
    return (
      <header className="article-tit">
        <p>{this.props.detailInfo.title}</p>
        <div className="label">
          <div className="labelList">
            {
              this.state.tagArr.map((item, index) => {
                if (index > 2) {
                  return;
                }
                return (
                  <span key={index} onClick={() => this.selectLabel(item.labelName, item.labelId)}>{item.labelName}</span>
                )
              })
            }
          </div>
          <div className="labelRight" style={{ display: 'none' }}>
            <div className="labelRightImg"></div>
            <span className="views">{this.state.viewTimes}</span>
          </div>
        </div>
      </header>
    )
  }
}
