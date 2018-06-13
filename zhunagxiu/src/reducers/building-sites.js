// import { Toast } from 'antd-mobile';
import Immutable, { fromJS, List } from 'immutable';
import { ACTION_TYPES } from '../actions';
import { stat } from 'fs';

const DEFAULT_STATE = Immutable.fromJS({
  myHome: {
    // 我的家基本信息
    myHomeInfo: {},
    // 量房
    volumeRoom: {},
    // 施工中
    construction: {},
    // 施工中节点展开
    constructionItem: [],
    // 节点支付
    constructPayment: {},
    // 施工中二级
    constructionDetail: {},
    // 施工中三级
    constructionitemThirdDetail: {},
    // 竣工
    completed: {
      stepList: []
    },
  }
});

function buildingSites(state = DEFAULT_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.BUILDING_SITES_MYHOME_FETCH_STATUS:
      state = state.setIn(['myHome', 'myHomeInfo'], payload);
      break;
    case ACTION_TYPES.BUILDING_SITES_MYHOME_FETCH_VOLUME_ROOM_BY_ID:
      state = state.setIn(['myHome', 'volumeRoom'], payload);
      break;
    case ACTION_TYPES.BUILDING_SITES_MYHOME_FETCH_COMPLETED_BY_ID:
      const { nodeId } = payload;
      const completedObj = state.getIn(['myHome', 'completed']).toJS();
      //console.log('completedObj', completedObj)
      const { stepList } = completedObj;
      stepList.find((stepItem, index) => {
        const retVal = stepItem.nodeId === nodeId;
        if (retVal) {
          stepList[index] = {
            ...stepItem,
            ...payload.data
          };
        }
        //console.log('retVal', retVal, index, stepList[index])
        return retVal;
      });
      state = state.setIn(['myHome', 'completed'], fromJS(completedObj));
      break;
    case ACTION_TYPES.BUILDING_SITES_MYHOME_FETCH_CONSTRUCTION_BY_ID:
      state = state.setIn(['myHome', 'construction'], payload);
      const { firstVos } = payload;
      const completedPayload = {
        stepList: []
      };
      if (firstVos.length > 0) {
        completedPayload.stepList = firstVos;
        completedPayload.stepList.shift();
        //completedPayload.stepList.pop();
        // completedPayload.stepList = List.of(completedPayload.stepList);
      }
      state = state.setIn(['myHome', 'completed'], Immutable.fromJS(completedPayload));
      break
    case ACTION_TYPES.BUILDING_SITES_MYHOME_FETCH_STEP_INFO_BY_ID:
      state = state.setIn(['myHome', 'constructionDetail'], payload);
      break;
    case ACTION_TYPES.BUILDING_SITES_MYHOME_CONSTRUCTION_AGREE_PAY:
      state = state.setIn(['myHome', 'constructPayment'], payload);
      break;
    case ACTION_TYPES.BUILDING_SITES_MYHOME_FETCH_STEP_DETAIL_INFO_BY_ID:
      state = state.setIn(['myHome', 'constructionitemThirdDetail'], payload);
      break;
    case ACTION_TYPES.BUILDING_SITES_MYHOME_FETCH_FIRST_STEP_INFO_BY_ID:
      state = state.setIn(['myHome', 'constructionItem'], payload);
      break;
    case 'CONS_THIRDDETAIL_CLEAR':
      state = state.setIn(['myHome', 'constructionitemThirdDetail'], {});
      break;
    default:
  }
  return state;
}

module.exports = buildingSites;
