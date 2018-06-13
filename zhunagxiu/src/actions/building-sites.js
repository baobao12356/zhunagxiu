import BuildingSites from '../models/BuildingSites'
// import buildingSitesModel from '../models/buildingSitesModel';
import { checkStatus } from './util';

const BUILDING_SITES_MYHOME_FETCH_STATUS = 'BUILDING_SITES_MYHOME_FETCH_STATUS';
const BUILDING_SITES_MYHOME_FETCH_VOLUME_ROOM_BY_ID = 'BUILDING_SITES_MYHOME_FETCH_VOLUME_ROOM_BY_ID';
const BUILDING_SITES_MYHOME_FETCH_CONSTRUCTION_BY_ID = 'BUILDING_SITES_MYHOME_FETCH_CONSTRUCTION_BY_ID';
const BUILDING_SITES_MYHOME_FETCH_COMPLETED_BY_ID = 'BUILDING_SITES_MYHOME_FETCH_COMPLETED_BY_ID';
const BUILDING_SITES_MYHOME_FETCH_STEP_INFO_BY_ID = 'BUILDING_SITES_MYHOME_FETCH_STEP_INFO_BY_ID';
const BUILDING_SITES_MYHOME_FETCH_STEP_DETAIL_INFO_BY_ID = 'BUILDING_SITES_MYHOME_FETCH_STEP_DETAIL_INFO_BY_ID';
const BUILDING_SITES_MYHOME_FETCH_FIRST_STEP_INFO_BY_ID = 'BUILDING_SITES_MYHOME_FETCH_FIRST_STEP_INFO_BY_ID';
const BUILDING_SITES_MYHOME_CONSTRUCTION_AGREE_PAY = 'BUILDING_SITES_MYHOME_CONSTRUCTION_AGREE_PAY';
const BUILDING_SITES_MYHOME_COMPLETED_AGREE_PAY = 'BUILDING_SITES_MYHOME_COMPLETED_AGREE_PAY';
const model = new BuildingSites();

// 获取施工中展开节点数据
async function buildingSitesMyhomeFetchFirstStepInfoById(id) {
  const response = await model.getConstructItemFirst(id);
  const result = checkStatus(response);
  return {
    type: BUILDING_SITES_MYHOME_FETCH_FIRST_STEP_INFO_BY_ID,
    payload: result.dataMap || {}
  };
}

// 获取施工中的阶段三级详情数据
async function buildingSitesMyhomeFetchStepDetailInfoById(id) {
  const response = await model.getConstructItemThird(id);
  const result = checkStatus(response);
  return {
    type: BUILDING_SITES_MYHOME_FETCH_STEP_DETAIL_INFO_BY_ID,
    payload: {
      id,
      data: result.dataMap
    }
  };
}

// 获取施工中的二级阶段数据
async function buildingSitesMyhomeFetchStepInfoById(id) {
  const response = await model.getConstructItemSecond(id);
  const result = checkStatus(response);
  return {
    type: BUILDING_SITES_MYHOME_FETCH_STEP_INFO_BY_ID,
    payload: {
      id,
      data: result.dataMap
    }
  };
}

// 获取初始化状态
async function buildingSitesMyhomeFetchStatusById(id, cityCode) {
  console.log(cityCode);
  const myHomeInfoData = await model.myhomeFetchStatusById(id, cityCode);
  const result = checkStatus(myHomeInfoData);
  return {
    type: BUILDING_SITES_MYHOME_FETCH_STATUS,
    id: id,
    status: !!result.dataMap && !!result.dataMap.status ? result.dataMap.status : '',
    payload: result.dataMap || {}
  };
}
// 获取量设计中的数据
async function buildingSitesMyhomeFetchVolumeRoomById() {
  const response = await model.FetchVolumeRoom();
  const result = checkStatus(response);
  return {
    type: BUILDING_SITES_MYHOME_FETCH_VOLUME_ROOM_BY_ID,
    payload: result.dataMap
  };
}
// 获取施工中的数据
async function buildingSitesMyhomeFetchConstructionById(id) {
  const constructData = await model.myHomeFetchConstructionById(id);
  const result = checkStatus(constructData);
  return {
    type: BUILDING_SITES_MYHOME_FETCH_CONSTRUCTION_BY_ID,
    payload: result.dataMap || {}
  };
}
// 施工中-同意支付
async function buildingSitesMyhomeConstructionAgreePay(constructId,nodeId) {
  const response = await model.myHomeFetchConstructionAgreePay(constructId,nodeId);
  const result = checkStatus(response);
  return {
    type: BUILDING_SITES_MYHOME_CONSTRUCTION_AGREE_PAY,
    payload: {
      data: result.code || {}
    }
  };
}
// 获取竣工的数据
async function buildingSitesMyhomeFetchCompletedById(constructId, nodeId) {
  const completedData = await model.myhomeFetchCompletedInfoById(constructId, nodeId);
  const result = checkStatus(completedData);
  const data = result.dataMap || {};
  return {
    type: BUILDING_SITES_MYHOME_FETCH_COMPLETED_BY_ID,
    payload: {
      id: constructId,
      nodeId,
      data
    }
  };
}
// 竣工-同意支付
async function buildingSitesMyhomeCompletedAgreePay(id) {
  return {
    type: BUILDING_SITES_MYHOME_COMPLETED_AGREE_PAY,
    payload: {
      id,
      data: {}
    }
  };
}

export default {
  ACTION_TYPES: {
    BUILDING_SITES_MYHOME_FETCH_STATUS,
    BUILDING_SITES_MYHOME_FETCH_VOLUME_ROOM_BY_ID,
    BUILDING_SITES_MYHOME_FETCH_CONSTRUCTION_BY_ID,
    BUILDING_SITES_MYHOME_FETCH_COMPLETED_BY_ID,
    BUILDING_SITES_MYHOME_FETCH_STEP_INFO_BY_ID,
    BUILDING_SITES_MYHOME_FETCH_STEP_DETAIL_INFO_BY_ID,
    BUILDING_SITES_MYHOME_FETCH_FIRST_STEP_INFO_BY_ID,
    BUILDING_SITES_MYHOME_CONSTRUCTION_AGREE_PAY,
    BUILDING_SITES_MYHOME_COMPLETED_AGREE_PAY
  },
  ACTION: {
    buildingSitesMyhomeFetchStatusById,
    buildingSitesMyhomeFetchVolumeRoomById,
    buildingSitesMyhomeFetchConstructionById,
    buildingSitesMyhomeFetchCompletedById,
    buildingSitesMyhomeFetchStepInfoById,
    buildingSitesMyhomeFetchStepDetailInfoById,
    buildingSitesMyhomeFetchFirstStepInfoById,
    buildingSitesMyhomeConstructionAgreePay,
    buildingSitesMyhomeCompletedAgreePay
  }
};
