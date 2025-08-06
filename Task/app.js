const express=require("express")
app=express()
userRoutes=require("./Routes/userRoutes.js")

//middleware
app.use((req, res, next) => {
  console.log(` ${new Date().toString()}   ${req.method} ${req.url}`);
  next(); 
});
app.use(express.json())
app.use("/",userRoutes)

module.exports=app