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
//For invalid requests
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler 
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

module.exports=app