import { QueryModelCore } from '../core/model.core';
import { getSessionId } from '../core/AuthUtil';

export default class DecoOrderModel {
  async getDecoOrderDetail(orderId) {
    const sessionId = getSessionId();
    const decoOrderData = new QueryModelCore(`/api-order/p-trade-oc-web/orderApi/cApp/jz/order/detail/${orderId}`).get({}, {headers: {'x-auth-token': sessionId}});
    return decoOrderData;
  }
}
