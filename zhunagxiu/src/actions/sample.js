
const SAMPLE_FETCH = 'SAMPLE_FETCH';

//获取品牌优惠券列表
function sampleFetchById(id) {
  return {
    type: 'BRAND_COUPON_LIST',
    payload: {
      id: 1,
      data: []
    }
  };
}

export default {
  ACTION_TYPES: {
    SAMPLE_FETCH,
  },
  ACTION: {
    sampleFetchById,
  }
};
