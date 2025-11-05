const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;
const authRoutes = require("./Routes/authRoute");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const  dotenv = require("dotenv");
dotenv.config();

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(()=>{
    console.log("mongo database connected successfully");
})



app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));


// app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen( PORT , ()=>{
    console.log(`app is running on port ${PORT}`);
})