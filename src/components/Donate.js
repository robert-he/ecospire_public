  import React from 'react';
  import ButtonSemantic from './ButtonSemantic';

export default class Donate extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    name: this.props.title || 'Plant Trees',
    description: this.props.description || 'We aim to make the earth healthier with planting more tress',
  };
}

render() {
  return (
    <div className="donate-container">
      <ButtonSemantic text="Donate" onClick={this.props.onClick} />
      <div className="organization-information">
        <h2>{this.state.name}</h2>
        <p>{this.state.description}</p>
      </div>
    </div>
  );
}
}
