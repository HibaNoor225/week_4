const express=require("express")
app=express()
listRoutes=require("./Routes/listRoutes.js")

//middleware
app.use((req, res, next) => {
  console.log(` ${new Date().toString()}   ${req.method} ${req.url}`);
  next(); 
});
app.use(express.json())
app.use("/",listRoutes)

module.exports=app