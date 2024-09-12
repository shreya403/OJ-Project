const UserModel = require("../models/User");
const googleUserModel = require("../models/googleUserModel");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { listUsers } = require('../firebaseAdmin.js');
const register=async(req,res)=>{
    try {
        const {name,email,password}=req.body
           
        const existUser= await UserModel.findOne({email})
        if (existUser) {
            return res.status(401).json({success:false,message:"User already Exist"})
        }
            const hasepassword= await bcryptjs.hashSync(password,10)
        const newUser= new UserModel({
            name,email,password:hasepassword
        })
        
          await newUser.save()
          await listUsers();

          res.status(200).json({message:"user register successfully",newUser})
    } catch (error) {
        res.status(500).json({success:false,message:"interanl server ereo"})
        console.log(error)
    }
}


const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "Invalid credentials" });
      }
  
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(404).json({ success: false, message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });
  
      await listUsers();
      res.status(200).json({ success: true, message: "Login successfully", user, token });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
      console.log(error);
    }
  };
  const Logout=async(req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message:"user Logout successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:"interanl server ereo"})
        console.log(error)
    }
  }
     const CheckUser=async(req,res)=>{
            try {
                const user=req.user
                if (!user) {
                    res.status(404).json({message:'User not found'})
                }
                res.status(200).json(user)

                
            } catch (error) {
                res.status(500).json({message:"internal server error"})
                console.log(error)
                
            }
     }

     const getUser = async (req, res) => {
        try {
          // Fetch the user based on the ID stored in the token
          const userId = req.user.userId;
          const user = await UserModel.findById(userId);
      
          if (!user) {
            return res.status(404).json({
              status: 'Failed',
              message: 'User not found'
            });
          }
      
          res.status(200).json({
            status: 'Success',
            data: user
          });
        } catch (err) {
          res.status(500).json({
            status: 'Failed',
            message: err.message
          });
        }
      };

      const getGoogleuser = async(req, res) => {
        try {
            const savedGetUser = await googleUserModel.find({});
            res.status(200).json({
                status: 'Success',
                data: { savedGetUser }
            });
        } catch (err) {
            res.status(500).json({
                status: 'Failed',
                message: err.message
            });
        }
     }

     const getUserProfileById = async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await UserModel.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ name: user.name, email: user.email, role: user.role });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    };
    
    module.exports = { register, Login, Logout, CheckUser, getUser, getGoogleuser, getUserProfileById };
    