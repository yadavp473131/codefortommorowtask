const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
//sign up fields
const registerUser = async (req , res)=>{
    try{
     const {firstname, lastname, email, password} = req.body;
     
     if(!email || !firstname || !lastname || !password){
        return res.status(501).json({
            success: false,
            message:"some data is missing!"
        })
     }
     //check wheather user already exist
     const checkUser = await User.findOne({email});
     if(checkUser){
       return res.status(501).json({
            success: false,
            message:"User already exist!"
        })
     }
     //hashing password
     const hashedPassword = await bcrypt.hash(password, 12);
     const newUser =new  User({
        name:firstname,
        lname: lastname,
        email:email,
        password: hashedPassword
     });
     //saving to database
     await newUser.save();
     return res.status(200).json({
            success: true,
            message:"User registered successfully!"
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
     
}

const loginUser = async (req, res)=>{
    try{
        console.log(req.body);
    //      const {email, password} = req.body;
    //         if(!email || !password){
    //             return res.status(501).json({
    //             success: false,
    //             message: "Missing Feilds!"
    //         })
    //         }
    //     const checkUser= await User.findOne({email});
    //     if(!checkUser){
    //         return res.status(404).json({
    //             success:false,
    //             message: "User not found!"
    //         })
    //     }
    //     //check password is true or not 
    //     const checkPassword = await bcrypt.compare(checkUser.password, password);
    //     if(!password){
    //         return res.status(400).json({
    //         success: false,
    //         message: "Error Incorrect password!"
    //     })
    //     const token = jwt.sign({
    //         email: checkUser.email, userName:checkUser.name
    //     });

    //         return res.status(200).json({
    //             success: true,
    //             message:"Logged in successfully",
    //             data: token
    //         })
    //     }
    }catch(e){
        console.log(e);
       return res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
   
}

//forget password
const forgetPassword = async (req, res)=>{
    try{
      const {email} = req.body;
      const user = await User.findOne({email});
      if(!user){
        return res.status(501).json({
            success:false,
            message:"User doesnt exist!"
        })
      }
      const data = {
        resetUrl:"http://localhost:5173/resetpassword",
        user
      }
      return res.status(200).json({
        success:true,
        data
      })
    }catch(e){
      console.log(e);
       return res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}

//reset password 
const resetPassword = async (req, res)=>{
   try{
      const {email, newPassword} = req.body;
      const user = await User.findOne({email});
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      user.password = newPasswordHash;
      await user.save();
       return res.status(200).json({
        success:true,
        message:"Password reset successful"
       })
    }catch(e){
      console.log(e);
       return res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}


module.exports = {registerUser, loginUser, forgetPassword, resetPassword};