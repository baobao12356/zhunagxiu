import React, {Component} from 'react';
import Http from '../../scripts/http';
import ResizeImg from '../../scripts/resizeImg';
import DefaultImg from '../defaultImg';
import Tags from '../tags';
import BigData from '../../scripts/bigData';
import GetUserInfo from '../../scripts/getUserInfo';
import './style.scss';

export default class RecoArt extends Component {

  constructor(props) {
    super(props);
    console.log('recoArt')

    this.state = {
      infos: []
    };

    this.hasMounted = true;
  }

  componentDidMount() {
    const _this = this;
    const {artInfo, artsort} = _this.props;

    GetUserInfo().then((res) => {
      artInfo.userid = res.openid;
    }).catch((e) => {
      console.log(e);
    }).then(() => {
      Http.get('/api-reco/', {
        body: artInfo
      }).then((res) => {
        if (res.code == 200 && res.sorts) {
          const ids = res.sorts.map((list) => {
            if (!list.sort) {
              return undefined;
            }
            return list.id;
          });
          artsort.ids = ids.join(',');

          Http.get('/api-bigdata/', {
            body: artsort
          }).then((data) => {
            if (data.code == 200 && data.info) {
              _this.hasMounted && _this.setState({
                infos: data.info
              });

              const {page, channel, type, title} = _this.props.p;
              _this.point = new BigData();
              _this.point.p(page, channel, type, title);
            }
          });
        }
      }).catch((e) => {
        console.log(e);
      });
    });
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  handleClick(recTitle, id) {
    const {page, channel, type, title, item} = this.props.f;
    this.point.f(page, channel, type, title, item, id, recTitle);
    location = 'picDetail.html?id=' + id + '&back=file';
  }

  render() {
    const {infos} = this.state;
    if (!infos.length) {
      return null;
    }
    const lists = infos.map((info) => {
      const tags = info.tags.split(',');
      return (
          <li key={info.id} onClick={this.handleClick.bind(this, info.title, info.id)}>
            <DefaultImg src={ResizeImg(info.cover_img_url, 280, 280)} />
            <div className="info">
              <h4>{info.title}</h4>
              <Tags tags={tags} />
            </div>
          </li>
      )
    });

    return (
      <div className="com-reco-art">
        <h4 className="title">相关推荐</h4>
        <ul className="lists">
          {lists}
        </ul>
      </div>
    );
  }
}

