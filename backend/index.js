const express = require('express');
const mongoose = require('mongoose');
const app = express();
const pinRoute = require('./routes/Pin.route');
const userRoute = require('./routes/User.route');

require("dotenv").config();
app.use(express.json());

mongoose
.connect(
    process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

.then(()=>{
    console.log("connected to mongodb");
})
.catch((err)=>{console.log(err)});

app.use("/api/users",userRoute);
app.use("/api/pins",pinRoute);

app.listen(8800,()=>{console.log("Backend Server is running on 8800")});
