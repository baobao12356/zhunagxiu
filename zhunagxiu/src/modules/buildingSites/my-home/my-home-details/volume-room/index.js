import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompanyRowComp from './company-row-comp';
import { buildingSitesMyhomeFetchVolumeRoomById, ACTION_TYPES } from '../../../../../actions';
import './style.scss'

class VolumeRoom extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { dispatch, p } = this.props;
    p && p({
      id: 223
    });
    dispatch(await buildingSitesMyhomeFetchVolumeRoomById())
  }

  render() {
    console.log('ttttt', this.props);
    const { volumeRoom } = this.props;
    console.log('jjjjjjjjjj', volumeRoom);
    const rowList = Object.keys(volumeRoom).length ? volumeRoom.map((row, index) => (
      <CompanyRowComp {...row} key={index} />
    )) : ''
    return (
      <div className="volumeRoom-comp">
        <div className="volumeRoom-title">为您量房的装修公司</div>
        <div className="volumeRoom-list">
          {rowList}
        </div>
      </div>
    )
  }
}

const store = (state) => {
  const myHome = state.get('buildingSites').get('myHome').toJS();
  console.log('ttttt', myHome)
  return {
    ...myHome
  };
}

export default connect(store)(VolumeRoom);
