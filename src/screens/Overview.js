  /* eslint-disable react/prefer-stateless-function */
  import React from 'react';
  import ButtonSemantic from '../components/ButtonSemantic';

export default class Overview extends React.Component {
render() {
  return (
    <div className="overview-container">
      <h2>Your CO2 emissions have decrease by %5 in the last month.</h2>
      <div className="overview-avatar" />
      <ButtonSemantic text="See The Breakdown" />
    </div>
  );
}
}
