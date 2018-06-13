import React, {Component} from 'react';
import cs from 'classnames';
import './style.scss';


/*展示图片 -- 设置默认图片
 * props: alt size bgc src cusClass
 * src - img src
 * alt - img alt
 * size - 默认图片大小
 * bgc - 默认背景色,
 * cusClass - 图片父容器class
 * */
export default class DefaultImg extends Component {

  static defaultProps = {
    alt: '',
    size: '50%',
    bgc: '#f5f5f5'
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.handleImgLoad = this.handleImgLoad.bind(this);
  }

  handleImgLoad() {
    this.setState(
      {
        show: true
      }
    );
  }

  render() {
    const {src, size, alt, bgc, cusClass} = this.props;
    return (
      <div className={cs({'com-default-img-content': true, 'img-show': this.state.show, [cusClass]: !!cusClass})} style={{backgroundSize: size, backgroundColor: bgc}}>
        <img className={cs({'img-show': this.state.show})} src={src} alt={alt} onLoad={this.handleImgLoad}/>
      </div>
    );
  }
}
