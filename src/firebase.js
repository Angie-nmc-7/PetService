const path = require('path');
const admin = require('firebase-admin');

require('dotenv').config();

const serviceAccount = require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
