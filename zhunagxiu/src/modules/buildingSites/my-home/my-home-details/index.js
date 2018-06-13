import React from 'react';
import BulidingHouse from './building-house';
import VolumeRoom from './volume-room';
import MyHomeCompleted from './my-home-completed';

function MyHomeDetails({ status, id, p, f, z }) {
  let result = null;
  const pointAction = { p, f, z };
  if (Number(status) === 1) {
    result = <VolumeRoom {...pointAction} />;
  } else if (Number(status) === 2) {
    result = <BulidingHouse {...pointAction} />;
  } else if (Number(status) === 3) {
    result = <MyHomeCompleted constructId={id} {...pointAction} />;
  }
  return result;
}

export default MyHomeDetails;
