

import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCBXxWrTAFbY_xZNaWpampb2wFmQTLV4JM",
    authDomain: "limservipapp.firebaseapp.com",
    databaseURL: "https://limservipapp.firebaseio.com",
    projectId: "limservipapp",
    storageBucket: "limservipapp.appspot.com",
    messagingSenderId: "95155371967",
    appId: "1:95155371967:web:9b2c205bdfbc9387d22b0a",
    measurementId: "G-4RJ8EJRXGK"
};

firebase.initializeApp(config);

export default firebase;

