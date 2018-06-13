var commonFuns = {
  /*
   *换算播放数量
   * 数据显示规则：
   * 10000以内显示具体数值；
   * 10000-999999以万为单位，支持1位小数点；例如：1.0万~99.9万
   * 1000000以上（含），显示100+万；
   */
  playCounts(count){
    count = count * 1;
    if(count<10000){
      return count
    }else if(count => 10000 && count <= 999999){
      return Math.floor(count/10000*10)/10 +"万"
    }else if(count >= 1000000){
      return "100万+"
    }
  },
  /*
   *换算分钟
   * 数据显示规则：
   * 毫秒换算成分钟小时
   *
   *
   */

   secondToDate(msd) {
      // var time = parseFloat(msd) / 1000;//毫秒
      var time = parseFloat(msd) *1;//秒
      if (null != time && "" != time) {
        if(time > 0 && time < 60 ){
          time =  "00 : " + commonFuns.formattingTime(time);
        }else if (time >= 60 && time < 3600) {
          time = commonFuns.formattingTime(parseInt(time / 60.0)) + " : " + commonFuns.formattingTime(parseInt((parseFloat(time / 60.0) -
              parseInt(time / 60.0)) * 60)) + "";
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          console.log(time)
          time =
            //时
            parseInt(time / 3600.0) + " : " +
              //分
            commonFuns.formattingTime(parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60))
             + " : " +
              //秒
            commonFuns.formattingTime(parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
              parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60))
             + "";
        }else {
          console.log(time)
          // time = parseInt(time) + "";
          time = "99 : 99 : 99"
        }
      }else if(time == 0){
        console.log(time)
       time = "00:00"
     }
      return time;
   },

  /*
  * 格式化小于10补位0
  *如1=》01
  *
  * */
  formattingTime(ints){

    ints = ints *1
    if( ints >=0 && ints<10){
      ints = "0"+ints
    }else{
      ints = ints.toString()
    }
    return ints

  }




};
export default commonFuns
