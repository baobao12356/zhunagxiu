
let ScrollFunc = {

  ifScroll(){
    let scrollTop = this.getScrollTop();
    let scrollHeight = this.getScrollHeight();
    let clientHeight = document.documentElement.clientHeight;
    let ifScrollBottom = scrollTop + clientHeight == scrollHeight;
    return ifScrollBottom;
  },
  getScrollTop(){
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
      bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  },
  getScrollHeight(){
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
      bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  scrollToTop(height){
    document.documentElement.scrollTop = document.body.scrollTop = height;
  },
}

export default ScrollFunc;
