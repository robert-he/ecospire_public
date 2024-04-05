  import React from 'react';
  import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
  import { StripeProvider, Elements } from 'react-stripe-elements';
  import Login from './screens/Login';
  import Facts from './screens/Facts';
  import Calculate from './screens/Calculate';
  import Overview from './screens/Overview';
  import DonateScreen from './screens/DonateScreen';
  import DonationSuccess from './screens/DonationSuccess';

const App = () => {
return (
  <StripeProvider apiKey="pk_test_2GnQCRfByayMfLa6U4E7lcCW00AV3F5LZw">
    <Elements>
      <Router>
        <div>
          <nav>
            <h1>eco<span className="light">spire</span></h1>
            <ul>
              <li>
                <Link to="/overview/" href="/overview">Overview</Link>
              </li>
              <li>
                <Link to="/facts/" href="/facts/">Facts</Link>
              </li>
              <li>
                <Link to="/donate/" href="/donate">Donate</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Route path="/" exact component={Login} />
        <Route path="/facts/" component={Facts} />
        <Route path="/calculate/:id" component={Calculate} />
        <Route path="/overview" component={Overview} />
        <Route path="/donate" component={DonateScreen} />
        <Route path="/success" component={DonationSuccess} />
      </Router>
    </Elements>
  </StripeProvider>
);
};

  export default App;
