import React from 'react';

export default class Button extends React.Component {
  callback = () => {
    console.log('what is going on');
  }
  render() {
    return (
      <div className="button-container">
        <button className="button" onClick={this.props.onClick ? this.props.onClick : this.callback}>{this.props.label}</button>
      </div>
    );
  }
}
