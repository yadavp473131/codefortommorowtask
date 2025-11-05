const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;
const authRoutes = require("./Routes/authRoute");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const mongoUrl = "mongodb+srv://yadavp8120_db_user:Ivj2nrdYvHHh8SNx@cluster0.ifdxxpq.mongodb.net/";
mongoose.connect(mongoUrl).then(()=>{
    console.log("mongo database connected successfully");
})
app.use(cors({
    origin:"http://localhost:5173",
    allowedHeader:[
        'Content-Type'
    ],
    methods:["POST"]
}));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use(express.json());

app.listen( PORT , ()=>{
    console.log(`app is running on port ${PORT}`);
})