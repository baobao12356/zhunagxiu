import React, {Component} from 'react';
import Host from '../../scripts/config_host';
import Http from '../../scripts/http';
import './style.scss';

/* 文章浏览量
 * props: pageview
 * pageview - obj, 接口所需参数中的operation和ids
* */
export default class PageViews extends Component {

  constructor(props) {
    super(props);

    this.state = {
      views: 0
    };
    this.hasMounted = true;
  }

  componentDidMount() {
    const {pageview} = this.props;
    Object.assign(pageview, {
      owner: 'h5_app_c',
      datatypes: 'history',
      fields: 'pv',
      appId: Host.appId
    });

    Http.get('/api-bigdata/', {
      body: pageview
    }).then((res) => {
      if (res.code == 200 && res.info[0].history && res.info[0].history.pv) {
        this.hasMounted && this.setState({
          views: res.info[0].history.pv
        });
      }
    });
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  render() {
    const {views} = this.state;
    return (
      <p className="com-page-views" style={{opacity: views ? '1' : '0'}}>
        {views}
      </p>
    );
  }
}
