import React from 'react';
import cs from 'classnames';
import Env from 'rs-browser';
import QueryString from 'query-string';
import AppointBox from '../../lib/components/appointBox';
import Nav from '../../lib/components/nav';
import './style.scss';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    const params = QueryString.parse(location.search);
    this.source = params.source;
  }

  render() {
    return (
      <div className={cs({ 'pageWrap': true, 'ios-top': Env.ios && Env.rsApp, 'img-center': true })}>
        <Nav title="设计咨询" shareIcon={false} />
        <div className="askWrap">
          <div className="askTitle"></div>
          <AppointBox source={this.source}/>
        </div>
      </div>

    );
  }
}
