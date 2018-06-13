
//返回true表示appVersion>=comparedVersion, 返回false appVersion<comparedVersion  //3.4.0有错
// function judgeVersion(appVersion, comparedVersion) {
//   const appVersionArr = appVersion.split('.');
//   const compareVersionArr = comparedVersion.split('.');

//   for (let i = 0; i < 3; i++) {
//     if (parseInt(appVersionArr[i]) < parseInt(compareVersionArr[i])) {
//       return false;
//     }
//   }
//   return true;
// }

//假定字符串的每节数都在5位以下
function toNum(a) {
  var a = a.toString();
  //也可以这样写 var c=a.split(/\./);
  var c = a.split('.');
  var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
  for (var i = 0; i < c.length; i++) {
    var len = c[i].length;
    c[i] = r[len] + c[i];
  }
  var res = c.join('');
  return res;
};
function judgeVersion(appVersion, comparedVersion) {
  var _a = toNum(appVersion), _b = toNum(comparedVersion);
  if (_a > _b || _a == _b) {
    return true;
    console.log("appVersion>=comparedVersion" + appVersion);
  } else {
    return false;
  }
}


export default {
  judgeVersion,
};
