import React, {Component} from 'react';
import './style.scss';

/*展示图片 -- 设置默认图片
 * props: size src alt
 * src - img src
 * alt - img alt
 * */
export default class DefaultUser extends Component {

  static defaultProps = {
    alt: ''
  };

  constructor(props) {
    super(props);
    this.handleImgLoad = this.handleImgLoad.bind(this);
  }

  handleImgLoad(e) {
    e.target.style.opacity = '1';
  }

  render() {
    const {src, alt} = this.props;
    return (
      <div className="com-default-user-content">
        {src && <img src={src} alt={alt} onLoad={this.handleImgLoad}/>}
      </div>
    );
  }
}
