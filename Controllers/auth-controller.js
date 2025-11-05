const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
         const {email, password} = req.body;
            if(!email || !password){
                return res.status(501).json({
                    success: false,
                    message: "Missing Feilds!"
                })
            }
            const checkUser= await User.findOne({email});
            console.log("checkUser ",checkUser);
        if(!checkUser){
            return res.status(404).json({
                success:false,
                message: "User not found!"
            })
        }
        //check password is true or not 
        const checkPassword = await bcrypt.compare(password, checkUser.password);
       
        if(!checkPassword){
            return res.status(400).json({
                success: false,
                message: "Error Incorrect password!"
            })  
        }
            const token = jwt.sign({
                email: checkUser.email, userName:checkUser.name
            },'CLIENT_SECRET_KEY', {expiresIn: '60m'});

            return res.status(200).json({
                success: true,
                message:"Logged in successfully",
                data: token
            })
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
        return res.status(404).json({
            success:false,
            message:"User doesnt exist!"
        })
      }

   

    // Create a token valid for 5 minutes
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(user.email)
      await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested to reset your password.</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>This link is valid for 5 minutes.</p>
      `,
    });

     return res.status(200).json({ 
        success:true,
         message: "Reset password link sent to your email." 
        });
      
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
      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });
    // console.log("password matches");
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });

    }catch(e){
      console.log(e);
       return res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}


module.exports = {registerUser, loginUser, forgetPassword, resetPassword};