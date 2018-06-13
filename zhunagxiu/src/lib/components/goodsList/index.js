import React, {Component} from 'react';
import Host from '../../scripts/config_host';
import DefaultImg from '../defaultImg';
import BigData from '../../scripts/bigData';
import ResizeImg from '../../scripts/resizeImg';
import './style.scss';

/* 商品展示列表 参考好物清单页面
 * props: list nameReflect
 * list - array, 展示数据
 * nameReflect - object, 字段名称映射
 * */
class ListItem extends Component {

  static defaultProps = {
    nameReflect: {
      cover: 'cover',
      goodId: 'goodId',
      title: 'title',
      recommendWord: 'recommendWord',
      price: 'price'
    }
  }

  constructor(props) {
    super(props);
    console.log('goods list');
  }

  handleGoods(id, e) {
    const {page, type, title, item} = this.props;
    new BigData().f(page, 'home', type, title, item);
    location = Host.path + '/shopGoods?id=' + id + '&back=file';
    e.stopPropagation();
  }

  render() {
    const list = this.props.list;
    const {cover, goodId, title, recommendWord, price} = this.props.nameReflect;
    return (
      <li className="com-goods-list" onClick={this.handleGoods.bind(this, list[goodId])}>
        <DefaultImg src={ResizeImg(list[cover], 270, 270)} />
        <div className="info-content">
          <h4>{list[title]}</h4>
          <p>{list[recommendWord]}</p>
          <p>
            ￥<span>{list[price]}</span>
            <button>立即购买</button>
          </p>
        </div>
      </li>
    );
  }
}

const GoodsList = (props) => {
  const lists = props.lists;
  const listItems = lists.map(list =>
    <ListItem key={list.id.toString()} list={list} />
  );
  return (
    <ul className="com-goods-list-container">
      {listItems}
    </ul>
  );
};

export default GoodsList;
