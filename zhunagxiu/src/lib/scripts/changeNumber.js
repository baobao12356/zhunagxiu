export default function changeNumber(data){
  let returndata;
  data = parseFloat(data);
  if(data<10000){
    returndata = data
  }else if(10000<=data&&data<=99999){
    returndata = JSON.stringify(data).slice(0,1)+'.'+JSON.stringify(data).slice(1,2)+'万'
  }else if(100000<=data){
    returndata = JSON.stringify(data).slice(0,2)+'万+'
  }else {
    returndata = data
  }
  return returndata
}
