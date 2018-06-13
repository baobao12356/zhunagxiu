import React from 'react';
import cs from 'classnames';
import LazyLoad from 'react-lazy-load';
import Host from '../../../../../lib/scripts/config_host';
import { getShopGoods } from '../../../../../models/ArticleDetailModel';
import ResizeImg from '../../../../../lib/scripts/resizeImg';
export default class GoodsRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skuId: '',
      goods:{},
      itemInfo:{},
      itemPromotionInfo:{},
    }
    this.getItemAndPromotionDetail=this.getItemAndPromotionDetail.bind(this);
    this.enterDetails = this.enterDetails.bind(this);

  }
  componentWillReceiveProps(next) {
    // console.log(next,next.skuId,'ssssss ');
    // this.setState({
    //   skuId: next.skuId,
    // },()=>{
    //   this.getItemAndPromotionDetail(this.state.skuId);
    // })

  }
  componentDidMount(){
    this.props.skuId&& this.getItemAndPromotionDetail(this.props.skuId);
  }

   //获取商品数据
   getItemAndPromotionDetail(skuId) {
    // console.log(skuId,'调接口传过来的id,,,,,,,,');
       getShopGoods(skuId).then((res) => {
       if (res && res.code == 200 && res.dataMap) {
         let itemInfo=res.dataMap.itemInfo ? res.dataMap.itemInfo : {};
          let cityCode=itemInfo.shopInfoBrief&&itemInfo.shopInfoBrief.cityId?itemInfo.shopInfoBrief.cityId:'';
        //  console.log(this.props.cityId,'定位,,,,,,,');
        //  console.log(itemInfo.cityId,'接口的,,,,,,,');
         if(this.props.cityId==cityCode){
          this.setState({
            goods: res.dataMap || {},
            itemInfo: itemInfo,
            itemPromotionInfo: res.dataMap.itemPromotionInfo ? res.dataMap.itemPromotionInfo : {},
          })
         }else{
           console.log(res,cityCode,'不是上海的',cityCode)
           return
         }

       }
     }).catch((e) => {
       console.log(e)
     })

   }

   enterDetails(id) {
    console.log(id, '商品sku');
    const {articleId}=this.props;
    this.props.f({
      id:'3461',
      p_action_id:`tag=文章&contentid=${articleId||''}&skuid=${id?id:''}`
    })

    id?window.location.href = `${Host.hostname}/shopGoods/?id=${id}&__open=1`:'';

  }


  render() {
    const {itemInfo}=this.state;
    console.log(itemInfo,'单个商品......')
    return (
      <div>{ Object.keys(itemInfo).length>0 ?
        <div className="goods_style" onClick={()=>{this.enterDetails(itemInfo.pdtSku)}}>
        <div className="goods_all_stytle">
          <div className="goods_picturl_left">
            {/* (itemInfo && itemInfo.picUrl) ? <img src={ResizeImg(itemInfo.picUrl, '326', '246.6', '!')} /> : '' */}
            <LazyLoad height={246}>
             {(itemInfo && itemInfo.picUrl) ? <img src={ResizeImg(itemInfo.picUrl, '326', '246.6', '!')} /> : ''}
           </LazyLoad>
          </div>

          <div className="goods_product_right">
            <div>
              <div className="pdt_name"> {itemInfo && itemInfo.pdtName}</div>
              <div className="product_second_name">  {itemInfo && itemInfo.productSecondName}</div>
            </div>
            {itemInfo && itemInfo.onlinePrice &&itemInfo.salePrice&& itemInfo.onlinePrice!=itemInfo.salePrice ?
              <div className="product_price">
                <span className="product_sale_price"> &yen;{itemInfo && itemInfo.onlinePrice || ''} </span>
                <span className="product_online_price" > &yen;{itemInfo.salePrice || ''}</span>
              </div> : <div className="product_price"> <span className="product_sale_price"> &yen;{itemInfo && itemInfo.salePrice || ''} </span> </div>}

          </div>

        </div>

      </div>:''
      }

      </div>
    );
  }
}
