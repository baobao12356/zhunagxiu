import { QueryModelCore } from '../core/model.core';
import { getSessionId } from '../core/AuthUtil';

//const sessionId = getSessionId();

export default class BuildingSitesModel {
  async  FetchVolumeRoom() {
    const volumeRoomData = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/decorationCompany`).get()
    return volumeRoomData;
  }
  async getConstructItemSecond(id) {
    const constructItemSecond = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/itemSecond/${id}`).get();
    return constructItemSecond;
  }

  async getConstructItemThird(logId) {
    const constructItemThird = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/itemThird/${logId}`).get();
    return constructItemThird;
  }

  async getConstructItemFirst(constructId) {
    const constructItemFirst = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/itemFirst/${constructId}`).get();
    return constructItemFirst;
  }

  async myhomeFetchStatusById(id, cityCode) {
    const sessionId = getSessionId();
    const statusData = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/status`).get({}, {
      headers: {
        'x-auth-token': sessionId,
        'locationCode': cityCode
      }
    });
    return statusData;
  }

  async myHomeFetchConstructionById(constructId) {
    const constructData = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/info/${constructId}`).get();
    return constructData;
  }

  async myhomeFetchCompletedInfoById(constructId, nodeId) {
    const completedData = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/summary/${constructId}/${nodeId}`).get();
    return completedData;
  }
  async myHomeFetchConstructionAgreePay(constructId, nodeId) {
    const agreePayData = new QueryModelCore(`/api-jiazhuang/c/hxapp/construct/payment/${constructId}/${nodeId}`).get();
    return agreePayData;
  }

}
