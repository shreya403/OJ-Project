const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();


// Initialize Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  }),
  databaseURL: 'https://onlinejudge-d74b4.firebaseio.com',
});

const auth = admin.auth();

// Initialize MongoDB Client
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

async function syncGoogleUsersToMongoDB(users) {
  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('googleusers');

    const bulkOps = users.map(user => {
      return {
        updateOne: {
          filter: { uid: user.uid },
          update: { $set: user },
          upsert: true,
        },
      };
    });

    await collection.bulkWrite(bulkOps);
  } finally {
    await client.close();
  }
}

async function listUsers(nextPageToken) {
  try {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    const googleUsers = listUsersResult.users.filter(user => {
      return user.providerData.some(provider => provider.providerId === 'google.com');
    });

    if (googleUsers.length > 0) {
      await syncGoogleUsersToMongoDB(googleUsers.map(user => user.toJSON()));
    }

    if (listUsersResult.pageToken) {
      await listUsers(listUsersResult.pageToken);
    }
  } catch (error) {
    console.error('Error listing users:', error);
  }
}


module.exports = { listUsers};
