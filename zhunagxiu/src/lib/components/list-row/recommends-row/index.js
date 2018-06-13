import React from 'react';
import LazyLoad from 'react-lazy-load';
import './style.scss';

function RecommendsRow({ item, onClick }) {
  return (
    <a href="javascript:;" key={item.id} onClick={() => {
      onClick && onClick(item.id)
    }}>
      <LazyLoad>
        <img className="detailListLeft" src={item.cover} />
      </LazyLoad>
      <div className="detailListRight">
        <p>{item.title}</p>
        {item.categoryTag && <span>{item.categoryTag}</span>}
      </div>
    </a>
  );
}

export default RecommendsRow;
