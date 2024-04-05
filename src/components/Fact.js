  import React from 'react';

<<<<<<< HEAD
export default class Fact extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    icon: <div className="icon-container plane" />,
  };
}

componentWillMount = () => {
  if (this.props.type === 'car') {
    this.setState({ icon: <div className="icon-container car" /> });
  } else if (this.props.type === 'salad') {
    this.setState({ icon: <div className="icon-container salad" /> });
  } else if (this.props.type === 'lightbulb') {
    this.setState({ icon: <div className="icon-container lightbulb" /> });
  }
}
render() {
  return (
    <div className={`fact-container ${this.props.position === 'right' ? 'right' : 'left'}`}>
      <h4>{this.props.text || 'This is some fun fact about your carbon emission'}</h4>
      {this.state.icon}
    </div>
  );
}
}
=======
  export default class Fact extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        icon: <div className="icon-container plane" />,
      };
    }

    componentWillMount = () => {
      if (this.props.type === 'car') {
        this.setState({ icon: <div className="icon-container car" /> });
      } else if (this.props.type === 'salad') {
        this.setState({ icon: <div className="icon-container salad" /> });
      } else if (this.props.type === 'lightbulb') {
        this.setState({ icon: <div className="icon-container lightbulb" /> });
      }
    }
    render() {
      return (
        <div className={`fact-container ${this.props.position === 'right' ? 'right' : 'left'}`}>
          <h4>{this.props.text || 'This is some fun fact about your carbon emission'}</h4>
          {this.state.icon}
        </div>
      );
    }
  }
>>>>>>> 955c834b2cee8849bb7b75febecde1f09fc64134
