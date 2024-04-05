  import React from 'react';
  import { Dropdown, Menu } from 'semantic-ui-react';

<<<<<<< HEAD
// eslint-disable-next-line react/prefer-stateless-function
export default class DropdownMenu extends React.Component {
// eslint-disable-next-line no-useless-constructor
constructor(props) {
  super(props);
  this.state = {
    text: this.props.text,
    // eslint-disable-next-line react/no-unused-state
    value: this.props.text,
    onChange: this.props.onChange,
  };

  this.handleChange = this.handleChange.bind(this);
}

handleChange(e, { value }) {
  this.setState({
    text: value,
  });
  this.state.onChange(value);
  console.log(value);
}

render() {
  return (
    <Menu compact className="dropdown-container">
      <Dropdown text={this.state.text} onChange={this.handleChange} options={this.props.options} simple item />
    </Menu>
  );
}
}
=======
  // eslint-disable-next-line react/prefer-stateless-function
  export default class DropdownMenu extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
      super(props);
      this.state = {
        text: this.props.text,
        // eslint-disable-next-line react/no-unused-state
        value: this.props.text,
        onChange: this.props.onChange,
      };

      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, { value }) {
      this.setState({
        text: value,
      });
      this.state.onChange(value);
      console.log(value);
    }

    render() {
      return (
        <Menu compact className="dropdown-container">
          <Dropdown text={this.state.text} onChange={this.handleChange} options={this.props.options} simple item />
        </Menu>
      );
    }
  }
>>>>>>> 955c834b2cee8849bb7b75febecde1f09fc64134

