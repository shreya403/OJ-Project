const express = require('express');
const { CheckUser, Login, Logout, register, getUser, getGoogleuser, getUserProfileById } = require('../controllers/auth.js');
const {IsUser, authenticateUser} = require('../middleware/verifyToken.js');
const AuthRoutes=express.Router()


AuthRoutes.post('/register',register)
AuthRoutes.get('/getUser',authenticateUser,getUser)
AuthRoutes.get('/getGoogleUser',getGoogleuser)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/CheckUser',IsUser,CheckUser)
AuthRoutes.get('/profile/:id', getUserProfileById);
module.exports =  AuthRoutes;