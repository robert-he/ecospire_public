  /* eslint-disable react/no-unused-state */
  import React from 'react';
  import axios from 'axios';
  import moment from 'moment';
  import Chart from 'chart.js';
  import { Dropdown } from 'semantic-ui-react';
  import Fact from './../components/Fact';
  import ButtonSemantic from './../components/ButtonSemantic';
  import airports from './../data/airports.json';
  import env from './../../env.json';
  import * as firebaseCalls from '../firebaseCalls';

  const CLIENT_ID = env.GOOGLE_CLIENT_ID;
  const API_KEY = env.API_KEY;
  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
  const AVG_US_SPEED_KMM = 1.61;
  const C02_PER_KILOMETER = 120;

  let facts = [];

const barGraphData = {
labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
datasets: [{
  label: 'Longest Time Spent in Vehicles',
  data: [12, 19, 3, 5, 2, 3],
  backgroundColor: [
    'rgba(255, 164, 89, 1)',
    'rgba(255, 164, 89, 1)',
    'rgba(255, 164, 89, 1)',
    'rgba(255, 164, 89, 1)',
    'rgba(255, 164, 89, 1)',
    'rgba(255, 164, 89, 1)',
  ],
  borderColor: [
    'rgba(255, 146, 55, 1)',
    'rgba(255, 146, 55, 1)',
    'rgba(255, 146, 55, 1)',
    'rgba(255, 146, 55, 1)',
    'rgba(255, 146, 55, 1)',
    'rgba(255, 146, 55, 1)',
  ],
  borderWidth: 1,
}],
};

const pieChartData = {
labels: ['Plane Flights', 'Car Rides'],
datasets: [{
  label: 'CO2 Emissions',
  data: [],
  backgroundColor: [
    'rgba(112, 243, 253, 1)',
    'rgba(138, 93, 226, 1)',
  ],
  borderColor: [
    'rgba(10, 218, 255, 1)',
    'rgba(221, 86, 240, 1)',
  ],
  borderWidth: 1,
}],
};

const barGraphOptions = {
scales: {
  xAxes: [{
    gridLines: {
      display: false,
    },
  }, {
    position: 'top',
    ticks: {
      display: false,
    },
    gridLines: {
      display: false,
      drawTicks: false,
    },
  }],
  yAxes: [{
    gridLines: {
      display: false,
    },
  }, {
    position: 'right',
    ticks: {
      display: false,
    },
    gridLines: {
      display: false,
      drawTicks: false,
    },
  }],
},
};
const timeframes = [
{
  key: 'week',
  text: 'in the past week',
  value: 'week',
},
{
  key: 'month',
  text: 'in the past month',
  value: 'month',
},
{
  key: 'year',
  text: 'in the past year',
  value: 'year',
},
];

export default class Facts extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    timeframeValue: 'week',
    totalKm: 0,
    totalKg: 0, // total CO2 emissions from Annie's data from car rides
    carbonEmissions: {},
    carbonEmissionslbs: null,
    carbonEmissionscost: null,
    minutesInVehicle: 0,
    dateRange: null, // range to include for flights
    range: 'week',
    flightCount: 0,
    topVehicleDays: [],
    topVehicleMinutes: [],
    // flying: 0,
    // averageComparison: 0,
    // offsetFootprint: 0,
  };
}

componentWillMount = () => {
  this.setState({ dateRange: moment().subtract(7, 'd').format('') });
  window.gapi.load('client', () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      client_id: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      window.gapi.auth2.getAuthInstance().signIn().then(() => {
        firebaseCalls.getPastWeekVehicleStats((minutesInVehicle) => {
          const totalKm = minutesInVehicle * AVG_US_SPEED_KMM;
          this.setState({
            totalKm,
            minutesInVehicle,
            totalKg: (totalKm * C02_PER_KILOMETER) / 1000,
            range: 'week',
          });
          this.setState({ dateRange: moment().subtract(7, 'd').hour(0).format() });
          const vehiclePromise = axios({
            method: 'POST',
            url: 'http://impact.brighterplanet.com/automobiles.json',
            data: {
              make: 'Honda',
              model: 'Accord',
              year: '2012',
              annual_distance: String(totalKm),
            },
          });
          this.calculateFlights(vehiclePromise);
        });
        firebaseCalls.getTopVehicleDays((res) => {
          res.forEach((entry) => {
            this.setState(prevState => ({
              topVehicleDays: [...prevState.topVehicleDays, entry.key],
              topVehicleMinutes: [...prevState.topVehicleMinutes, entry.value],
            }));
          });
          console.log(this.state.topVehicleDays);
          console.log(this.state.topVehicleMinutes);
        });
      });
    });
  });
  // });
}

componentDidMount = () => {
}

calculateFlights = (vehiclePromise) => {
  window.gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: this.state.dateRange,
    alwaysIncludeEmail: true,
    q: 'flight',
  }).then((response) => {
    const events = response.result.items;
    const airportPromises = [];
    events.forEach((flight) => {
      if (flight.location && flight.summary) {
        if (flight.location.split(' ').length === 2 && (flight.summary.split(' ').length === 3 || flight.summary.split(' ').length === 5)) {
          const originCode = flight.location.split(' ')[1];
          let destinationCode = '';
          airports.forEach((airport) => {
            if (airport.city === flight.summary.split(' ')[2]) {
              destinationCode = airport.code;
            }
          });

          airportPromises.push(axios({
            method: 'POST',
            url: 'http://impact.brighterplanet.com/flights.json',
            data: {
              origin_airport: originCode,
              destination_airport: destinationCode,
            },
          }));
        }
      }
    });
    this.setState({ flightCount: airportPromises.length });


    // keep running total of kgs from flights and kgs from automobiles YES
    // keep a running total of each item YES
    // for every res, add the result from that res to the total YES
    // find out TOTAL number of kilos of carbon YES
    // convert $9.52 per tonne (1 kg = 0.001 tonne)
    this.calculateTotalEmissions(vehiclePromise, airportPromises);
  });
}

calculateTotalEmissions = (vehiclePromise, airportPromises) => {
  const carbonEmissions = {};

  carbonEmissions.totalCarbon = 0; // initialize to 0 so we can keep a running total
  carbonEmissions.automobilesCarbon = 0;
  carbonEmissions.flightCarbon = 0;

  carbonEmissions.equivalents = { // initialize all the equivalents so we can keep a running total
    days_of_veganism: 0,
    weeks_of_veganism: 0,
    months_of_veganism: 0,
    years_of_veganism: 0,
    lightbulbs_for_a_year: 0,
    lightbulbs_for_a_month: 0,
    lightbulbs_for_a_week: 0,
    lightbulbs_for_an_evening: 0,
    homes_electricity_in_a_year: 0,
    homes_electricity_in_a_month: 0,
    homes_electricity_in_a_week: 0,
    homes_electricity_in_a_day: 0,
    homes_with_lowered_thermostat_2_degrees_for_a_winter: 0,
    homes_with_raised_thermostat_3_degrees_for_a_summer: 0,
  };

  const masterPromises = airportPromises.concat([vehiclePromise]);

  console.log('masterPromises', masterPromises);

  Promise.all(masterPromises).then((res) => {
    res.forEach((item) => {
      carbonEmissions.totalCarbon += item.data.decisions.carbon.object.value; // adding to running total of carbon emissions from planes + cars in kg

      switch (item.data.emitter) {
        case 'Automobile':
          carbonEmissions.automobilesCarbon += item.data.decisions.carbon.object.value; // adding to running total of appropriate mode of transportation in kg
          break;
        default:
          carbonEmissions.flightCarbon += item.data.decisions.carbon.object.value; // adding to running total of appropriate mode of transportation in kg
      }

      // keeping a running total of all of these equivalents

      carbonEmissions.equivalents.days_of_veganism += item.data.equivalents.days_of_veganism ? item.data.equivalents.days_of_veganism : 0;
      carbonEmissions.equivalents.weeks_of_veganism += item.data.equivalents.weeks_of_veganism;
      carbonEmissions.equivalents.months_of_veganism += item.data.equivalents.months_of_veganism;
      carbonEmissions.equivalents.years_of_veganism += item.data.equivalents.years_of_veganism;
      carbonEmissions.equivalents.lightbulbs_for_a_year += item.data.equivalents.lightbulbs_for_a_year;
      carbonEmissions.equivalents.lightbulbs_for_a_month += item.data.equivalents.lightbulbs_for_a_month;
      carbonEmissions.equivalents.lightbulbs_for_a_week += item.data.equivalents.lightbulbs_for_a_week;
      carbonEmissions.equivalents.lightbulbs_for_an_evening += item.data.equivalents.lightbulbs_for_an_evening;
      carbonEmissions.equivalents.homes_electricity_in_a_year += item.data.equivalents.homes_electricity_in_a_year;
      carbonEmissions.equivalents.homes_electricity_in_a_month += item.data.equivalents.homes_electricity_in_a_month;
      carbonEmissions.equivalents.homes_electricity_in_a_week += item.data.equivalents.homes_electricity_in_a_week;
      carbonEmissions.equivalents.homes_electricity_in_a_day += item.data.equivalents.homes_electricity_in_a_day;
      carbonEmissions.equivalents.homes_with_lowered_thermostat_2_degrees_for_a_winter += item.data.equivalents.homes_with_lowered_thermostat_2_degrees_for_a_winter;
      carbonEmissions.equivalents.homes_with_raised_thermostat_3_degrees_for_a_summer += item.data.equivalents.homes_with_raised_thermostat_3_degrees_for_a_summer;
    });
    console.log(carbonEmissions);
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      carbonEmissions,
      carbonEmissionslbs: carbonEmissions.totalCarbon * 2.205,
      carbonEmissionscost: carbonEmissions.totalCarbon * 0.001 * 9.52,
    });

    this.renderCharts();

    facts = [
      `Only ${this.state.flightCount} flights makes up for ${Math.floor(carbonEmissions.flightCarbon / (carbonEmissions.totalCarbon / 100))}% of your CO2 emissions!`,
      'Cutting your driving by 30% in one month is equivalent to turning off electricity for 20 days.',
      `It would take ${Math.round(carbonEmissions.equivalents.years_of_veganism)} years of being vegan to produce the same amount of C02 from your flights and car rides!`,
      `Your total carbon emission is equivalent to ${Math.floor(carbonEmissions.equivalents.homes_electricity_in_a_year)} years of a home's energy output`,
    ];
  });
}

appendPre = (message) => {
  console.log(message);
}

handleTimeframeChange = (e, { value }) => {
  this.setState({
    timeframeValue: value,
  });
  switch (value) {
    case 'month':
      firebaseCalls.getPastMonthVehicleStats((minutesInVehicle) => {
        const totalKm = minutesInVehicle * AVG_US_SPEED_KMM;
        console.log('MONTHS', minutesInVehicle);
        this.setState({
          totalKm,
          minutesInVehicle,
          totalKg: totalKm * (C02_PER_KILOMETER / 1000),
          range: 'month',
        });
        this.setState({ dateRange: moment().subtract(30, 'd').hour(0).format() });
        const vehiclePromise = axios({
          method: 'POST',
          url: 'http://impact.brighterplanet.com/automobiles.json',
          data: {
            make: 'Honda',
            model: 'Accord',
            year: '2012',
            annual_distance: String(totalKm),
          },
        });
        this.calculateFlights(vehiclePromise);
      });
      break;
    case 'year':
      firebaseCalls.getPastYearVehicleStats((minutesInVehicle) => {
        const totalKm = minutesInVehicle * AVG_US_SPEED_KMM;
        this.setState({
          totalKm,
          minutesInVehicle,
          totalKg: totalKm * (C02_PER_KILOMETER / 1000),
          range: 'year',
        });
        this.setState({ dateRange: moment().subtract(365, 'd').format() });
        const vehiclePromise = axios({
          method: 'POST',
          url: 'http://impact.brighterplanet.com/automobiles.json',
          data: {
            make: 'Honda',
            model: 'Accord',
            year: '2012',
            annual_distance: String(totalKm),
          },
        });
        this.calculateFlights(vehiclePromise);
      });
      break;
    default:
      firebaseCalls.getPastWeekVehicleStats((minutesInVehicle) => {
        const totalKm = minutesInVehicle * AVG_US_SPEED_KMM;
        this.setState({
          totalKm,
          minutesInVehicle,
          totalKg: totalKm * (C02_PER_KILOMETER / 1000),
          range: 'week',
        });
        this.setState({ dateRange: moment().subtract(7, 'd').hour(0).format() });
        const vehiclePromise = axios({
          method: 'POST',
          url: 'http://impact.brighterplanet.com/automobiles.json',
          data: {
            make: 'Honda',
            model: 'Accord',
            year: '2012',
            annual_distance: String(totalKm),
          },
        });
        this.calculateFlights(vehiclePromise);
      });
  }
}

convertTime = () => {
  const carDurationHours = Math.floor(this.state.minutesInVehicle / 60);
  const carDurationMinutes = Math.floor(this.state.minutesInVehicle - (carDurationHours * 60));
  return `${carDurationHours} hours ${carDurationMinutes} minutes`;
}

renderCharts = () => {
  const firstContainer = document.getElementsByClassName('chart-container')[0];
  const secondContainer = document.getElementsByClassName('chart-container')[1];
  document.getElementsByTagName('canvas')[0].remove();
  const bar = document.createElement('canvas');
  bar.id = 'bar-graph';
  bar.height = '400';
  bar.width = '400';
  const pie = document.createElement('canvas');
  pie.id = 'pie-chart';
  pie.height = '400';
  pie.width = '400';
  firstContainer.appendChild(bar);
  secondContainer.appendChild(pie);
  barGraphData.labels = this.state.topVehicleDays;
  barGraphData.datasets[0].data = this.state.topVehicleMinutes;
  new Chart(bar, {
    type: 'bar',
    data: barGraphData,
    options: barGraphOptions,
  });
  pieChartData.datasets[0].data = [Math.floor(this.state.carbonEmissions.flightCarbon), Math.floor(this.state.carbonEmissions.automobilesCarbon)];
  new Chart(pie, {
    type: 'pie',
    data: pieChartData,
  });
  firebaseCalls.getPastWeekVehicleStats((minutesInVehicle) => {
    this.setState({ minutesInVehicle: this.state.minutesInVehicle });
  });
}

render() {
  const URL = 'http://localhost:8080/donate?carbonEmissionscost=';
  const newURL = URL.concat(String(this.state.carbonEmissionscost));

  return (
    <div className="facts-container">
      <h1>Here are the Facts</h1>
      <div className="carbon-footprint-container">
        Your carbon footprint <Dropdown
          fluid
          selection
          value={this.state.timeframeValue}
          onChange={this.handleTimeframeChange}
          options={timeframes}
        /> is {this.state.carbonEmissions ? Math.floor(this.state.carbonEmissions.totalCarbon) : 0} Kg
      </div>
      <div className="chart-container">
        <canvas id="bar-graph" width="400" height="400" />
      </div>
      <div className="time-in-car-container">
        <h2>Total Hours in a Car</h2>
        <h3>{this.convertTime()}</h3>
      </div>
      <div className="chart-container">
        <canvas id="pie-chart" width="400" height="400" />
      </div>
      <div className="number-flights-container">
        <h2>In the last {this.state.range} you have taken</h2>
        <h3>{this.state.flightCount} flights</h3>
      </div>

      <div className="side-ferns" />
      <div className="side-plants" />
      <div className="top-blue" />
      <div className="right-blue" />
      <div className="left-green" />
      <div className="right-plants" />
      <div className="left-plants" />
      <div className="right-green" />
      <div className="trees" />

      <Fact text={facts[0]} />
      <Fact text={facts[1]} type="car" position="right" />
      <Fact text={facts[2]} type="salad" />
      <Fact text={facts[3]} position="right" type="lightbulb" />

      <ButtonSemantic text="Reduce Your Carbon Footprint" onClick={() => { window.location = newURL; }} />

    </div>
  );
}
}
