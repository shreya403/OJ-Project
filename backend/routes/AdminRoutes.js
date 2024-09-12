const express = require('express');
const { Getuser, deletUser } = require('../controllers/admin.js');
const { isAdmin } = require('../middleware/verifyToken.js');

const AdminRoutes=express.Router()
 AdminRoutes.get('/getuser',isAdmin,Getuser)
 AdminRoutes.delete('/delet/:id',isAdmin,deletUser)

module.exports = AdminRoutes;