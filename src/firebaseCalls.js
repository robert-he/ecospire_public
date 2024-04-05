  import firebase from 'firebase';

const config = {
apiKey: 'REDACTED',
authDomain: 'ecospire.firebaseapp.com',
databaseURL: 'https://ecospire.firebaseio.com',
projectId: 'ecospire',
storageBucket: 'ecospire.appspot.com',
messagingSenderId: 'REDACTED',
};
firebase.initializeApp(config);
const db = firebase.firestore();

export function getUserDetails(userId, callback) {
return db.collection('user_details')
  .where('userId', '==', userId)
  .get()
  .then((snapshot) => {
    if (snapshot.exists) callback(snapshot.pop());
    else callback(false);
  });
}

export function addUserDetails(details) {
console.log(details);
db.collection('user_details').add(details)
  .then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding document: ', error);
  });
}

export function getPastWeekVehicleStats(callback) {
const aWeekAgo = new Date();
let totalTime = 0;
aWeekAgo.setDate(aWeekAgo.getDate() - 7);
return db.collection('annie_location_history')
  .where('activityType', '==', 'in vehicle')
  .where('date', '>=', aWeekAgo)
  .get()
  .then((snapshot) => {
    snapshot.forEach((entry) => {
      totalTime += entry.data().minuteDifference;
    });
    callback(totalTime);
    console.log(`total minutes last week: ${totalTime}`);
  });
}

export function getPastMonthVehicleStats(callback) {
const aMonthAgo = new Date();
let totalTime = 0;
aMonthAgo.setDate(aMonthAgo.getDate() - 31);
return db.collection('annie_location_history')
  .where('activityType', '==', 'in vehicle')
  .where('date', '>=', aMonthAgo)
  .get()
  .then((snapshot) => {
    snapshot.forEach((entry) => {
      totalTime += entry.data().minuteDifference;
    });
    callback(totalTime);
    console.log(`total minutes last month: ${totalTime}`);
  });
}

export function getPastYearVehicleStats(callback) {
const aYearAgo = new Date();
let totalTime = 0;
aYearAgo.setDate(aYearAgo.getDate() - 125);
return db.collection('annie_location_history')
  .where('activityType', '==', 'in vehicle')
  .where('date', '>=', aYearAgo)
  .get()
  .then((snapshot) => {
    snapshot.forEach((entry) => {
      totalTime += entry.data().minuteDifference;
    });
    callback(totalTime);
    console.log(`total minutes last year: ${totalTime}`);
  });
}

export function getTopVehicleDays(callback) {
const aYearAgo = new Date();
aYearAgo.setDate(aYearAgo.getDate() - 125);
return db.collection('annie_location_history')
  .where('activityType', '==', 'in vehicle')
  .where('date', '>=', aYearAgo)
  .get()
  .then((snapshot) => {
    const daysToMinutes = {};

    snapshot.forEach((entry) => {
      const dateStr = entry.data().date.toDate().toISOString().substring(0, 10);
      const minutes = entry.data().minuteDifference;
      if (dateStr in daysToMinutes) {
        daysToMinutes[dateStr] += minutes;
      } else {
        daysToMinutes[dateStr] = minutes;
      }
    });

    const daysProps = Object.entries(daysToMinutes).map(([key, prevValue]) => {
      const value = prevValue / 60;
      return { key, value };
    }, daysToMinutes);
    daysProps.sort((day1, day2) => { return day2.value - day1.value; });

    const top10Days = daysProps.slice(0, 10);
    callback(top10Days);
  });
}
