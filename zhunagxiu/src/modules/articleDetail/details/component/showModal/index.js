import React from 'react';
import { Modal } from 'antd-mobile';
import './style.scss';


export default class MoreCities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.props.onClose();
  }


  render() {
    const { showModal, serviceListVos } = this.props;
    const modalCity = serviceListVos && serviceListVos.map((item, i) => {
      return (
        <div className="city_one" key={i}>
          <div className="city_province">
            {item.provinceName || ''}
          </div>
          <div className="city_cities">
            {item.cityList&&item.cityList.map((v, index) => {
              return <span key={index}>{v}</span>
            })}
          </div>
        </div>
      )
    })



    return (
      <div>
        <Modal
          popup
          visible={showModal}
          onClose={this.onClose}
          animationType="slide-up"
        >
          <div className="modal_city">
              <div className="city_header">
               服务城市
              </div>
            <div className="city_body">
               {modalCity}
            </div>
            <div className="city_footer"  onClick={this.onClose}>
               确定
             </div>
             </div>
        </Modal>
      </div>
    );
  }
}
