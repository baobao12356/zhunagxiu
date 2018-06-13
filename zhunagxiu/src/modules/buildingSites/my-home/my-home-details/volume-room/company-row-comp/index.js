import React, { Component } from 'react';
import moment from 'moment';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import Host from '../../../../../../lib/scripts/config_host';
import EvaluateStars from '../../../../../../lib/components/evaluateStars';
import './style.scss';

export default class CompanyRowComp extends Component {
  constructor(props) {
    super(props);
    this.handleGoCaseImg = this.handleGoCaseImg.bind(this);
    this.handleGoCompany = this.handleGoCompany.bind(this);
    this.hybridOpenPageImagePreview = new HybridOpenPageImagePreview();
  }

  handleGoCompany(companyId) {
    window.location.href = `${Host.path}/mainapp/decoCorpDetail.html?detailId=${companyId}&__open=1`;
  }

  handleGoCaseImg(caseImgs, e) {
    e.stopPropagation();
    const caseData = {
      photos: [],
      showDownloadBar: 'yes',
      currentIndex: 0
    };
    caseImgs.foreach((img) => {
      caseData.photos.push({
        url: img
      });
    });
    this.hybridOpenPageImagePreview.open(caseData).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const { companyLogo, companyName, years
      , tags, status, measurDate, overallScore
      , honorNum, companyId, caseImgs } = this.props;
    let volumeStatus;
    switch (status) {
      case 1:
        volumeStatus = '待量房';
        break;
      case 2:
        volumeStatus = '未量房';
        this.noVolumeStatus = 'onStatus';
        break;
      default:
        volumeStatus = '已量房';
        this.noVolumeStatus = 'onStatus';
    }
    let volumeTags = tags.split(',');
    volumeTags = volumeTags.map((tag, index) => (
      <span key={index}><span className="text">{tag}</span> <span className="cut">|</span></span>
    ));

    const volumeCase = caseImgs.length > 0 ? <div className="company-caseImg" onClick={e => this.handleGoCaseImg(caseImgs, e)}>设计图</div> : ''

    return (
      <div className="company-row-comp" onClick={() => this.handleGoCompany(companyId)}>
        <div className={`status ${this.noVolumeStatus}`}><span>{status !== 2 && moment(measurDate).format('YYYY.MM.DD')}</span> <span>{volumeStatus}</span></div>
        <div className="company">
          <div className="company-logo">
            <img src={`${companyLogo}!`} alt="" />
          </div>
          <div className="company-info">
            <div className="company-name">{companyName}</div>
            <div className="company-overallScore">
              <EvaluateStars score={(overallScore ? Number(overallScore).toFixed(1) : '暂无评分')} totalScore={parseInt(overallScore)} />
            </div>
            <div className="company-honorNum">{years ? `${years}年老店 ` : ''}{honorNum ? `${honorNum}奖项` : ''}</div>
            <div className="company-tags">{volumeTags}</div>
          </div>
        </div>
        {volumeCase}
      </div>
    );
  }
}

