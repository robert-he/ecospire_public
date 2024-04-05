import React from 'react';
import DropdownMenu from '../components/DropdownMenu';
import ButtonSemantic from '../components/ButtonSemantic';
import env from './../../env.json';
import { addUserDetails } from '../firebaseCalls';

const ROOT_URL = (env.mode === 'dev') ? 'http://localhost:8080' : 'deploy_url';


// eslint-disable-next-line no-unused-vars
const makes = [
  { key: 1, text: 'Honda', value: 'Honda' },
  { key: 2, text: 'Nissan', value: 'Nissan' },
  { key: 3, text: 'Toyota', value: 'Toyota' },
];

// eslint-disable-next-line no-unused-vars
const models = [
  { key: 1, text: 'Accord', value: 'Accord' },
  { key: 2, text: 'Altima', value: 'Altima' },
  { key: 3, text: 'Camry', value: 'Camry' },
];

const years = [
  { key: 1, text: '2000', value: '2000' },
  { key: 2, text: '2001', value: '2001' },
  { key: 3, text: '2002', value: '2002' },
  { key: 4, text: '2003', value: '2003' },
  { key: 5, text: '2004', value: '2004' },
  { key: 6, text: '2005', value: '2005' },
  { key: 7, text: '2006', value: '2006' },
  { key: 8, text: '2007', value: '2007' },
  { key: 9, text: '2008', value: '2008' },
  { key: 10, text: '2009', value: '2009' },
  { key: 11, text: '2010', value: '2010' },
  { key: 12, text: '2011', value: '2011' },
  { key: 13, text: '2012', value: '2012' },
];


// eslint-disable-next-line react/prefer-stateless-function
export default class Calculate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      make: 'Honda',
      model: 'Accord',
      year: '2012',
    };
  }

  render() {
    return (
      <div className="calculate-container">
        <div>
          <h2>Please provide us with more details on your carbon usage: </h2>
          <h3> Make and model of your car </h3>
          <div className="dropdown-wrapper">
            <div className="dropdown-container">
              <DropdownMenu className="dropdown-container"
                text="Make"
                options={makes}
                onChange={(newMake) => { this.setState({ make: newMake }); }}
              />
            </div>
            <div className="dropdown-container">
              <DropdownMenu className="dropdown-container"
                text="Model"
                options={models}
                onChange={(newModel) => { this.setState({ model: newModel }); }}
              />
            </div>
            <div className="dropdown-container">
              <DropdownMenu className="dropdown-container"
                text="Year"
                options={years}
                onChange={(newYear) => { this.setState({ year: newYear }); }}
              />
            </div>
          </div>
        </div>
        <div className="buttonsemantic-container"> <ButtonSemantic
          onClick={() => {
            addUserDetails(this.state);
            window.location = `${ROOT_URL}/facts/`;
          }}
          text="See Carbon Footprint"
        />
        </div>
      </div>
    );
  }
}
