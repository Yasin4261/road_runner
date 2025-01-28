const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin SDK'yı başlatın
const serviceAccount = require(path.resolve(__dirname, 'roadrunner-2230f-firebase-adminsdk-d4qgv-68a16422eb.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.verifyToken = async (token) => {
  return await admin.auth().verifyIdToken(token);
};