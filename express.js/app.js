// const express = require("express");
// const app = express();
// const myRouter = require("./myrouter"); 

// app.use("/", myRouter);  
// app.use(express.static('public'));
// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });
// //This is basic  server

///==========to understad the use of middle ware to see static files=====================
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
