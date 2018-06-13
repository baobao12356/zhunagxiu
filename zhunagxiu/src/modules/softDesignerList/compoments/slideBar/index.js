import { Range, WingBlank, WhiteSpace } from 'antd-mobile';
import './style.scss';
import React, {Component} from 'react';

export default class Silde extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.log=this.log.bind(this);
  }


     log (values) {
        console.log(values);
        this.props.selectAptitude(values)
      };


  render() {
    return (
      <div className="am-slider-example">
          <WingBlank size="lg">
            <Range
              style={{ marginLeft: 30, marginRight: 30 }}
              min={0}
              step={1}
              max={2000}
              defaultValue={[0,2000]}
              onChange={(values)=>this.log(values)}
              trackStyle={[{ backgroundColor: '#F85959' }]}
              handleStyle={[{ backgroundColor: '#fff' }, { backgroundColor: '#fff' }]}
            />
          </WingBlank>

      </div>
    );
  }
}







