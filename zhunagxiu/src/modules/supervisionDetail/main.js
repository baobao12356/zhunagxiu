import React from 'react';
import cs from 'classnames';
import onfire from 'onfire.js';
import Env from 'rs-browser';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import { Toast, Accordion, List, Modal } from 'antd-mobile';
// import { Swiper } from '../../lib/scripts/swiper/swiper-3.4.2.min.js';
import  Swiper from 'swiper';
import '../../lib/scripts/swiper/swiper-3.4.2.min.scss';
import QueryString from 'query-string';
import Nav from '../../lib/components/nav';
import Img from '../../lib/components/defaultImg';
import LoopBanner from '../../lib/components/loopBanner';
import { getSuperVisorDetail, getCommentList } from '../../models/getSuperVisorInfo';
import { dateFormat, formatTimes } from '../../lib/scripts/dateFormat';
import { getScrollTop, getWindowHeight, getScrollHeight } from '../../lib/scripts/getHeight';
import Like from '../../lib/components/like';
import Comment from '../../lib/components/comment';
import Host from '../../lib/scripts/config_host';
import BigData from '../../lib/scripts/bigData';
import DefaultUser from '../../lib/components/defaultUser';
import ResizeImg from '../../lib/scripts/resizeImg';
import MoreCities from './component/showModal';
import CommentList from './component/commentList';
import GetNativeInfo from '../../lib/scripts/getNativeInfo';
import './style.scss';
import { Style } from './../styleResult/config';
const AccordionPanel=Accordion.Panel;
export default class Details extends React.Component {
  constructor(props) {
    super(props);
    dateFormat();
    const params = QueryString.parse(location.search);
    // this.companyId = params.companyId||110 || 107 || 306||4;
    this.companyId = params.companyId ||'';
    this.cityCode = params.cityCode || '310100';

    this.state = {
      pageSize: 2,
      pageNo: 1,
      loading: false,
      dataInfo: {},
      showModal: false,
      commentList: {},
      hasNextPage: false,
      supervisorImageVos: [],
      supervisorVos: [],
      companyCaseVos: [],
      webPadding: false,
      topSize: '',
    };

    this.reservationNow = this.reservationNow.bind(this);
    this.getSuperVisorCompanyInfo = this.getSuperVisorCompanyInfo.bind(this);
    this.getSupervisorCompanyComment = this.getSupervisorCompanyComment.bind(this);
    this.onClose = this.onClose.bind(this);
    this.swiperCompany = this.swiperCompany.bind(this);
    this.swiperTeam = this.swiperTeam.bind(this);
    this.swiperCase = this.swiperCase.bind(this);
    this.getMoreComment = this.getMoreComment.bind(this);
    this.caseList=this.caseList.bind(this);
    this.onChange=this.onChange.bind(this);
    this.moreServices=this.moreServices.bind(this);
    this.companyBrand=this.companyBrand.bind(this);
    this.supervisionServiceTeam = null;
    this.supervisionCompanyBrand = null;
    this.supervisionCustomerCase = null;
    this.serviceMore=this.serviceMore.bind(this);
    //this.cityCode='';
    //this.getCityCode=this.getCityCode.bind(this);
  }

  // getCityCode() {
  //   GetNativeInfo().then((nativeInfoRes) => {
  //     console.log(nativeInfoRes,'native交互,.....');
  //     this.cityCode = nativeInfoRes.ShowCityId;
  //     console.log('city', this.cityCode);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  // }

  componentDidMount() {
    if (!Env.rsApp) {
      this.setState({
        webPadding: true
      })
    }
    //this.getCityCode();
    this.getSuperVisorCompanyInfo(this.companyId);
    this.getSupervisorCompanyComment(this.companyId, 1, 2000);




  }


  //品牌
  swiperCompany(res) {

    const _this = this;
    if (res && res.supervisorImageVos) {
      this.setState({
        supervisorImageVos: res.supervisorImageVos,
      }, () => {
        if (_this.supervisionCompanyBrand) {
          _this.supervisionCompanyBrand.update();
        } else {
          _this.supervisionCompanyBrand = new Swiper('.swiper-wrapper-company', {
            slidesPerView: 'auto',
            freeMode: true,
          });
        }

      })
    }

  }

  //团队
  swiperTeam(res) {

    const _this = this;
    if (res && res.supervisorVos) {
      this.setState({
        supervisorVos: res.supervisorVos,
      }, () => {
        if (_this.supervisionServiceTeam) {
          _this.supervisionServiceTeam.update();
        } else {
          _this.supervisionServiceTeam = new Swiper('.swiper-wrapper-team', {
            slidesPerView: 'auto',
            freeMode: true,
          });
        }
           const {supervisorVos}=this.state;
        if(supervisorVos&&supervisorVos.length>0){
           const supervisionTeam= document.querySelector('.supervision_team_memeber');
           if(supervisorVos.length<=3){
            supervisionTeam ? supervisionTeam.style.justifyContent='center':'';
           }else{
            supervisionTeam?supervisionTeam.style.justifyContent='':'';

           }
        }

      })
    }

  }

  //案例
  swiperCase(res) {
    console.log(res, res.companyCaseVos, '案例')
    const _this = this;
    if (res && res.companyCaseVos) {

      this.setState({
        companyCaseVos: res.companyCaseVos,
      }, () => {
        if (_this.supervisionCustomerCase) {
          _this.supervisionCustomerCase.update();
        } else {
          _this.supervisionCustomerCase = new Swiper('.swiper-wrapper-case', {
            slidesPerView: 'auto',
            freeMode: true,
          });
        }

      })
    }

  }

  getSuperVisorCompanyInfo(companyId) {
    // this.setState({
    //   loading: true
    // });
    Toast.loading('Loading...', 1);
    getSuperVisorDetail(companyId).then((res) => {
      Toast.hide();
      // this.setState({
      //   loading: false
      // });
      console.log(res, '数据,,,,,,,');
      if(res&&res.code ==200){
        this.setState({
          dataInfo: res.dataMap,
        },()=>{
          this.swiperCompany(res.dataMap);
          this.swiperTeam(res.dataMap);
          this.swiperCase(res.dataMap);
        });
      }else{
        Toast.info('该监理公司已下线!', 6);
      }
    }).catch((e)=>{
      console.log(e);
    })
  }

  getSupervisorCompanyComment(companyId, pageNo, pageSize) {

    this.setState({
      loading: true
    });
    Toast.loading('Loading...', 1);
    getCommentList(companyId, pageNo, pageSize).then((res) => {
      this.setState({
        loading: false
      });
      console.log(res, '数据评论,,,,,,,');
      Toast.hide();
      if (res.code == 200) {
        this.setState({
          commentList: res.dataMap,
        });
      }
    }).catch((e)=>{
      console.log(e);
    })
  }




  //  [Native 调用]
  nativeImgShow(flag, index, id) {

    let hybridOpenPageImagePreview = new HybridOpenPageImagePreview(), picData = [], nativeImg = [];

    const { supervisorImageVos, companyCaseVos } = this.state;
    if (flag == 'case') {
      nativeImg = companyCaseVos ? companyCaseVos : [];
    } else if (flag == 'brand') {
      nativeImg = supervisorImageVos ? supervisorImageVos : [];
    }
    nativeImg.map((item) => {
      const obj = {
        des: '',
        url: item.cover,
        title: flag == 'brand' ? item.name : item.title
      };
      picData.push(obj);
      return true;
    });
    const data = {
      id: '',
      objectType: '',
      currentIndex: index,
      photos: picData,
      showDownloadBar: 'yes',
    };
    hybridOpenPageImagePreview.open(data).catch((error) => {
      console.log(error);
    });
  }


  onChange(key) {
    console.log(key);
  }

  onClose() {
    this.setState({
      showModal: false,
    });
    this.popAfter();
  }



  //立即预约
  reservationNow() {
    window.location.href = `${Host.path}/mainapp/makeSupervisor.html?cityCode=${this.cityCode}&back=h5&__open=1`;
  }

   serviceMore(id){

    this.props.f({
      id: '3288',
      p_action_id:`tag=监理详情&contentid=${id}`,
    });
   }
  moreServices() {
    const {dataInfo}=this.state;
    if(dataInfo && dataInfo.serviceListVos){
      this.setState({
        showModal: true,
      });

      this.popBefore();
    }


  }

  popBefore() {
    document.querySelector('body').setAttribute('class', 'overHidden');
  }

  popAfter() {
    document.querySelector('body').setAttribute('class', '');
  }

  getMoreComment() {
    this.getSupervisorCompanyComment(1, 1, 200000);
  }

  //案例列表
  caseList() {

    window.location.href = `${Host.path}/mainapp/supervisionCaseList.html?companyId=${this.companyId}&back=h5&__open=1`;
  }
   companyBrand() {
   const _this=this;
    const {supervisorImageVos}=this.state;
    console.log(supervisorImageVos, '品牌.......')

    return supervisorImageVos&&supervisorImageVos.length>0 ?
      <div className="supervision_company">
        <div className="supervision_title">
          公司品牌
        </div>
        <div className="swiper-wrapper-company">
          <div className=" company_picture_all swiper-wrapper">
            {
             supervisorImageVos.map((item, i) => {
                return <div className="company_one swiper-slide" key={i}>
                  <div className="company_picture">
                   {(item && item.cover) ? <img src={ResizeImg(item.cover, '326', '246.6', '!')} onClick={() => _this.nativeImgShow('brand', i, item.id)} />: ''}
                  </div>

                  <div className="company_name">
                    {(item && item.name) || ''}
                  </div>
                </div>
              })
            }
          </div>

        </div>
      </div> : '';
  };

  render() {
    const _this = this;

    let { dataInfo, showModal, commentList, supervisorImageVos, supervisorVos, companyCaseVos } = this.state;


    function supervisorMoney(info) {
      return (
        <div className="supervision_money" onClick={()=>_this.serviceMore(info.id)}>
          <div className="supervision_process">{(info && info.productName) || ''}</div>
          <div className="supervision_freqency">
            <div className="supervision_all">
              <div className='supervision_freqency_one'>
                <div>上门次数 </div>
                <div>
                  {info && info.visitNum!=undefined?info.visitNum: ''}
                </div>
              </div>

              <div className='supervision_freqency_one'>
                <div>户型面积</div>
                <div>
                  {info && info.area!=undefined?info.area:''}
                </div>
              </div>

              <div className='supervision_freqency_one'>
                <div>远程附加费 </div>
                <div>
                  {info && info.surcharge!=undefined?info.surcharge: ''}
                </div>
              </div>
            </div>

          </div>
        </div>

      )
    };

    function supervisionService() {
      return dataInfo.productVos&& dataInfo.productVos.length>0 ? <div className="supervision_service">
        <div className="supervision_title"> 服务详情</div>
        <div className="supervision_content">
          <Accordion accordion onChange={_this.onChange}>
            { dataInfo.productVos.map((item, index) => {
              return item?<AccordionPanel header={supervisorMoney(item)} key={index} >
                <div className="supervision_article">
                  {item.serviceContent || ''}
                </div>
              </AccordionPanel>:''

            })}
          </Accordion>
        </div>


      </div> : '';
    };
    function supervisorVosTeam() {

      return supervisorVos&&supervisorVos.length>0 ?
        <div className="supervision_service_team">
          <div className="supervision_title supervision_title_team "> 服务团队</div>

          <div className=" swiper-wrapper-team">
            <div className=" supervision_team_memeber swiper-wrapper">
              {
               supervisorVos.map((item, index) => {
                  return <div className="memeber_one swiper-slide" key={index}>
                    <div className="memeber_picture">
                      {(item && item.avatarUrl) ? <img src={ResizeImg(item.avatarUrl, '120', '120', '!')} /> : ''}
                    </div>
                    <div className="memeber_name">
                      {(item && item.supervisorName) || ''}
                    </div>
                    <div className="memeber_year">
                      {(item && item.workingHours)?`从业${item.workingHours}`:''}
                    </div>
                  </div>
                })
              }

            </div>


          </div>
        </div> : '';
    };


    function supervisionServiceAll() {

      return (dataInfo && (dataInfo.productVos || dataInfo.supervisorVos)) ? <div className="supervision_service_all">
        {supervisionService()}
        {supervisorVosTeam()}
      </div> : '';
    };

    function supervisionCase() {

      return companyCaseVos&&companyCaseVos.length>0 ? <div className="supervision_case">
        <div className="case_more">
          <div className="supervision_case_title">
            客户案例
            </div>
          <div className="supervision_more_arrow" onClick={() => _this.caseList()}>

            <span className="supervision_more" >更多</span>
            <span className="supervision_arrow"></span>
          </div>
        </div>


        <div className=" swiper-wrapper-case">
          <div className="case_picture_all swiper-wrapper">
            {
              companyCaseVos.map((item, index) => {
                return <div className="case_one swiper-slide" key={index}>
                  <div className="case_picture">
                    {(item && item.cover) ? <img src={ResizeImg(item.cover, '670', '376', '!')} onClick={() => _this.nativeImgShow('case', index, item.id)} /> : ''}
                  </div>

                  <div className="case_name">
                    {(item && item.title) || ''}
                  </div>
                </div>

              })
            }


          </div>

        </div>



      </div> : '';
    };
    function supervisionComment() {
      return commentList && commentList.records&&commentList.records.length>0 ? <div className="supervision_comment">
        <div className="supervision_title">
          最新点评
    </div>
        <div className="comment_all">
          {
            commentList.records.map((item, i) => {
              return <CommentList index={i} info={item} key={i} />
            })

          }

        </div>
      </div> : '';

    };

    return (
      <div
        className={cs({ "supervision_home": true, 'app-wrap': Env.rsApp, 'ios-nav': Env.rsApp && Env.ios, 'webPadding': this.state.webPadding, 'img-center': true })}>
        {/*<Nav title='监理公司详情' initShareData="true" share={this.share} hideNav="true" showTip="true"/>*/}
        <Nav title='监理公司详情' shareIcon={false} />
        <div className="supervision_wrap">
          <div className="supervision_header">
            <div className="header_title">
              <div className="info_left">
                {dataInfo && dataInfo.companyLogo ? <img src={ResizeImg(dataInfo.companyLogo, '140', '140', '!')} /> : ''}
              </div>
              <div className="info_right">
                <div className="info_company">{(dataInfo && dataInfo.companyName) || ""}</div>
                <div className="info_housekeeper">{(dataInfo && dataInfo.serviceConcept) || ""}</div>
              </div>
            </div>
            <div className="header_city"  onClick={this.moreServices}>
              <span>服务城市</span>
              <span>{(dataInfo && dataInfo.serviceCity) || ""}</span>
              <span className="header_arrow"></span>
            </div>
          </div>
          {supervisionServiceAll()}
          {this.companyBrand()}
          {supervisionCase()}
          {supervisionComment()}
        </div>
        <div className="supervision_footer"  onClick={this.reservationNow}>
          立即预约
          </div>
        <MoreCities showModal={showModal} serviceListVos={dataInfo && dataInfo.serviceListVos} onClose={this.onClose} />

      </div>
    );
  }
}




/*                              <img src={shopInfo && shopInfo.brandLogo ? ResizeImg(shopInfo.brandLogo, '130', '130', '!') : require('./img/defaultLogo.png')} />/>
 */






