const express=require("express")
const app=express()
require('dotenv').config();
const authRoutes=require("./Routes/authRoutes.js")
const productRoutes=require("./Routes/productRoutes.js")
const connectDB = require('./config/db');
const admin=require('./seedAdmin.js')
const path = require("path");
const sanitize = require('mongo-sanitize');
const limit=require('./utils/limiter.js')




connectDB()
admin()

app.use(limit.limiter)
app.use((req, res, next) => {
  console.log(` ${new Date().toString()}   ${req.method} ${req.url}`);
  next(); 
});

// Middleware to sanitize all incoming data
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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