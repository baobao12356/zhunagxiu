import React, { Component } from 'react';
import RSBrowser from 'rs-browser';
import Nav from '../../lib/components/nav';


export default class Layout extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      isH5,
      share,
      title,
      initShareData,
      f,
      pointShare,
      children,
      ...otherParams
    } = this.props;
    console.log('share', share)
    return (
      <div className={className}>
        <Nav
          onlyH5={isH5}
          title={title}
          share={share}
          initShareData={initShareData}
          showTip={true}
          hideNav={true}
          f={f}
          pointShare={pointShare}
          {...otherParams}
        />
        {children}
      </div>
    )
  }
}
