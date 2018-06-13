const Consts = {
  SERVICE_ROOT: {
    NORMAL: '/api'
  },
  EVENT_KEY: {
    ERROR: 'ERROR',
    EVENT_PROCESS: {
      CHANGE_TITLE: 'EVENT_PROCESS_CHANGE_TITLE'
    },
    NET_COMMUNICATION: {
      ERROR: 'NET_COMMUNICATION_ERROR',
      BUSINESS_ERROR: {
        NOT_200: 'NET_COMMUNICATION_BUSINESS_ERROR_NOT_200',
        ERROR_401: 'NET_COMMUNICATION_BUSINESS_ERROR_NOT_401'
      },
      NORMAL_ERROR: {
        ERROR_500: 'NET_COMMUNICATION_NORMAL_ERROR_ERROR_500'
      }
    }
  },
  SERVICE_PATH:{
    JIAZHUANG:'/api-jiazhuang',
    //营销中心二期C端http接口
    BIGDATA:'/api-bigdata',
    LONGYAN:'/api-longyan',
    USER:'/api-user'
  }
};
export default Consts;
