const express = require("express");
const app = express();
const myRouter = require("./myrouter"); 

app.use("/", myRouter);  
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
//This is basic  server
