const express=require("express")
const app=express()
require('dotenv').config();
const authRoutes=require("./Routes/authRoutes.js")
const productRoutes=require("./Routes/productRoutes.js")
const connectDB = require('./config/db');
const admin=require('./seedAdmin.js')

connectDB()
admin()

app.use((req, res, next) => {
  console.log(` ${new Date().toString()}   ${req.method} ${req.url}`);
  next(); 
});
app.use(express.json())
app.use("/auth",authRoutes)
app.use("/product",productRoutes)

//For invalid requests
app.use((req, res) => {
  res.status(404).json({
    result: "failure",
    message: "Route not found",
    data: null
  });
});


// Error handler 
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    result: "failure",
    message: err.message,
    data: null
  });
});


module.exports=app