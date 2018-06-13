import React, { Component } from 'react';
import './style.scss';


export default class EvaluateStars extends Component {
  constructor(props) {
    super(props);
  }

  starFun(totalScore) {
    let star = [];
    const score = Math.floor(totalScore);
    for (let i = 0; i < 5; i++) {
      i < score ? star.push(<span key={i} className="star"></span>) : star.push(<span key={i} className="halfStar"></span>)
    }
    return star;
  }

  render() {
    const { totalScore, score } = this.props;
    const stars = this.starFun(totalScore);
    return (
      <div className="evaluateStar">
        <div className="score">
          {stars}
          {score}
        </div>
      </div>
    );
  }
}
