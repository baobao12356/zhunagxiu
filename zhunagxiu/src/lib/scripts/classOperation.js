/**
 * Created by traven on 2017/9/8.
 */

export default {
  hasClass:function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },
  addClass:function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
  },
  removeClass:function removeClass(obj, cls) {
  if (this.hasClass(obj, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
  },
  toggleClass:function toggleClass(obj,cls){
    if(this.hasClass(obj,cls)){
      this.removeClass(obj, cls);
    }else{
      this.addClass(obj, cls);
    }
  }
}
