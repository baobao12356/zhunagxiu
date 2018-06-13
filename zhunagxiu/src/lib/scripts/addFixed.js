
   export default class Fixed{
   constructor(x){
     this.topSize='';
   }

   addFixed(topSize){
     const bodyContent= document.querySelector('body');
     if(bodyContent){
      bodyContent.style.top = '-' + topSize + 'px';
      bodyContent.setAttribute('class', 'overHidden');
      this.topSize=topSize;
     }

   }
   removeFixed(topSize=''){
    const bodyContent= document.querySelector('body');
    if(bodyContent){
      let topSizeOld= this.topSize;
      bodyContent.setAttribute('class', '');
      window.scroll(0, topSizeOld);
      bodyContent.style.top = '';
    }

   }
 }
