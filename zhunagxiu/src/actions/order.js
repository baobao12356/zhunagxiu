import DecoOrderModel from '../models/decoOrderModel'
import { checkStatus } from './util';

const DECO_ORDER_FETCH_DETAIL = 'DECO_ORDER_FETCH_DETAIL';
const model = new DecoOrderModel();


// 获取装修订单详情
async function decoOrderFetchDetail(orderId) {
  const detailInfo = await model.getDecoOrderDetail(orderId);
  const result = checkStatus(detailInfo);
  return {
    type: DECO_ORDER_FETCH_DETAIL,
    payload: result.data || {}
  };
}

export default {
  ACTION_TYPES: {
    DECO_ORDER_FETCH_DETAIL
  },
  ACTION: {
    decoOrderFetchDetail
  }
};
