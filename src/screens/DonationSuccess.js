import React from 'react';
import ButtonSemantic from '../components/ButtonSemantic';

// eslint-disable-next-line react/prefer-stateless-function
export default class DonationSuccess extends React.Component {
  render() {
    return (
      <div className="success-container">
        <div className="icon-container success-icon" />
        <div className="success-text"> Donation successful. Your donation has successfully completed. </div>
        <div className="buttonsemantic-container"> <ButtonSemantic text="Okay" onClick={() => { window.location = 'http://localhost:8080/facts'; }} />
        </div>
      </div>
    );
  }
}
