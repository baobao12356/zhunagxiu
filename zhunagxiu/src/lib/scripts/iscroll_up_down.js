/* Created by Traven on 2017/2/7.*/

/*
    iscroll:iscroll实例
    up:上拉加载函数
    down:下拉刷新函数
    使用示例：
     import IScroll from "iscroll/build/iscroll-probe";
     import fetchMore from './iscroll_up_down'
     let myscroll = new IScroll('.now_movie_cnt',{
         click:true,
         probeType: 3,
         mouseWheel: true
     });
     let fetchMovie  = function(){};
     let refreshMovie = function(){};
     //下拉刷新，上拉加载
     fetchMore(myscroll,fetchMovie,refreshMovie);
*/

export default function fetchMore(iscroll,up,down){
    let pullDownFlag,pullUpFlag;
    iscroll.on('scroll', positionJudge);
    iscroll.on('scrollEnd', action);
    function positionJudge() {
        //判断下拉
        if (this.y > 20) {
            //console.log( "放开刷新页面");
            pullDownFlag = 1;
            //判断上拉
        } else if (this.y <= this.maxScrollY) {
            //console.log( "放开刷新页面");
            pullUpFlag = 1;
        }
    }
    function action(){
      console.log(pullUpFlag)
        if(pullDownFlag==1){
            if(typeof down == 'function'){
                down();
            }
            console.log('下拉刷新');
            pullDownFlag = 0;
        }else if(pullUpFlag==1){

            if(typeof up == 'function'){
                up();
              console.log(up)
            }
            console.log('上拉加载');
            pullUpFlag = 0;
        }
    }
}
