import React from 'react';
import { Button } from 'semantic-ui-react';

// eslint-disable-next-line react/prefer-stateless-function
export default class ButtonSemantic extends React.Component {
  callback = () => {
    window.location = 'http://localhost:8080/facts';
  }

  render() {
    return (
      <Button className="calculate-button" onClick={this.props.onClick ? this.props.onClick : this.callback}> {this.props.text} </Button>
    );
  }
}
