//import a set of tools to talk to firebase and Firebase
const {
    initializeApp,
    applicationDefault,
    cert,
  } = require("firebase-admin/app");
  const {
    getFirestore,
    Timestamp,
    FieldValue,
  } = require("firebase-admin/firestore");
  
  //import our credentials
  const credentials = require("./credentials.json");
  
  // //connect to firebase service
  initializeApp({
    credential: cert(credentials),
  });
  
  //connect to Firestore
  const db = getFirestore();