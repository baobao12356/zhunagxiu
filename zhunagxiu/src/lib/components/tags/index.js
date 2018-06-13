import React, {Component} from 'react';
import './style.scss';

/* 展示标签
 * props: tags
 * tags - Array, 列表
 * */
export default class Tags extends Component {
  render() {
    const {tags} = this.props;
    const tagList = tags.map((tag, idx) => (
      <span key={idx}>{tag}</span>
      ));

    return (
      <div className="com-tags">
        {tagList}
      </div>
    );
  }
}
