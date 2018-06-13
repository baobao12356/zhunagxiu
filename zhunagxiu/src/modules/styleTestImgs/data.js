/**
 * Created by feifei on 2017/9/17.
 */

export default class Data {

  //style:"禅意日式","活力北欧","现代简约","现代中式","休闲美式"

  static styleImgArr = [
    {
      style:2,
      imgSrc:"http://img2.mklimg.com/g1/M00/1B/77/rBBrBVm_apiALL7MAADK-bhSlO0004.jpg!"
    },
    {
      style:1,
      imgSrc:"http://img1.mklimg.com/g2/M00/1B/6B/rBBrCVm_ahOAHEtrAAEf7AbLTok650.jpg!"
    },
    {
      style:0,
      imgSrc:"http://img1.mklimg.com/g2/M00/1B/7A/rBBrClm_aTWALW3CAAGl0st2XgU624.jpg!"
    },
    {
      style:3,
      imgSrc:"http://img1.mklimg.com/g1/M00/1B/78/rBBrBVm_a46ANRSIAAFnJ67lnWI908.jpg!"
    },
    {
      style:4,
      imgSrc:"http://img1.mklimg.com/g1/M00/1B/78/rBBrBVm_a-mAE-CpAAFYpPfe63U162.jpg!"
    },
    {
      style:1,
      imgSrc:"http://img1.mklimg.com/g1/M00/1B/7B/rBBrBlm_aimAZA4nAAEmnRBkWvQ403.jpg!"
    },
    {
      style:2,
      imgSrc:"http://img1.mklimg.com/g1/M00/1B/78/rBBrBVm_asqAFCzQAAqMtcQW3lM689.jpg!"
    },
    {
      style:0,
      imgSrc:"http://img3.mklimg.com/g1/M00/1B/77/rBBrBVm_aXyAbEvBAAExXsSloyI570.jpg!"
    },
    {
      style:2,
      imgSrc:"http://img2.mklimg.com/g1/M00/1B/78/rBBrBVm_atmAAAprAACsB3wd-60689.jpg!"
    },
    {
      style:3,
      imgSrc:"http://img3.mklimg.com/g2/M00/1B/7B/rBBrClm_azGALNFbAACS_2VagT8240.jpg!"
    },
    {
      style:4,
      imgSrc:"http://img3.mklimg.com/g2/M00/1B/6C/rBBrCVm_bACAblFuAAGJLnx6r3w097.jpg!"
    },
    {
      style:1,
      imgSrc:"http://img3.mklimg.com/g1/M00/1B/77/rBBrBVm_aj2AKIzSAADmQIyoHwU538.jpg!"
    },
    {
      style:0,
      imgSrc:"http://img3.mklimg.com/g1/M00/1B/77/rBBrBVm_aZSAcVg3AADLOEWCbOc803.jpg!"
    },
    {
      style:3,
      imgSrc:"http://img2.mklimg.com/g1/M00/1B/E0/rBBrBVnCLyWAGn9pAAFiKbhqErk419.jpg!"
    },
    {
      style:4,
      imgSrc:"http://img2.mklimg.com/g1/M00/1B/78/rBBrBVm_bBSALbrVAAE3MJxweMM580.jpg!"
    }
  ];

  static shuffle = function (arr){
    return arr.sort(function(){
      return Math.random() - 0.5;
    });
  };

  static styleTitleArr = [
    "http://img2.mklimg.com/g2/M00/1B/73/rBBrClm_PVSARX6kAABuESyVI9c247.png!",
    "http://img1.mklimg.com/g1/M00/1B/74/rBBrBlm_PXaAPHfnAABwoTpR34k937.png!",
    "http://img3.mklimg.com/g2/M00/1B/73/rBBrClm_PYuAce4xAAB5Cer5zfY441.png!",
    "http://img3.mklimg.com/g1/M00/1B/70/rBBrBVm_PZ6AKXziAABsRFiUqwU069.png!",
    "http://img1.mklimg.com/g2/M00/1B/64/rBBrCVm_Pa2AZs9zAABxavImEXE184.png!"
  ]
}
