const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  });
  
  function getKey(header, callback) {
    //console.log('Fetching key for kid:', header.kid);
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        //console.error('Error fetching signing key:', err.message);
        return callback(err);
      }
      if (!key) {
        //console.error('No key found for kid:', header.kid);
        return callback(new Error('No key found'));
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      //console.log('Fetched key:', signingKey);
      callback(null, signingKey);
    });
  }

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
        }

        req.user = {
            userId: user._id, // Assuming MongoDB ObjectId
            role: user.role
        };
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const IsUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Check your environment variable spelling
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            userId: user._id, // Assuming MongoDB ObjectId
            role: user.role
        };
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const authenticateUser = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ status: 'Failed', message: 'Access Denied: No Token Provided!' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 'Failed', message: 'Access Denied: No Token Provided!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      userId: user._id, // Assuming MongoDB ObjectId
      role: user.role
    };
    next();
  } catch (err) {
    res.status(400).json({ status: 'Failed', message: 'Invalid Token' });
  }
};  

module.exports = { isAdmin, IsUser, authenticateUser  };
