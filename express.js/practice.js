//---------------------Basic get route---------------------
// const express = require('express');
// const app = express();
// app.get('/', (req, res) => {
//     res.send('Welcome to the Express.js Tutorial');
// });


// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });

// //----------------------methods of html------------------------
// const express = require('express');
// const app = express();

// // Root route
// app.get('/', (req, res) => {
//   res.send('Home Page');
// });

// // About route
// app.get('/about', (req, res) => {
//   res.send('About Page');
// });

// // Contact form (POST)
// app.post('/contact', (req, res) => {
//   res.send('Contact form submitted');
// });

// // Update user (PUT)
// app.put('/user/:id', (req, res) => {
//   res.send(`User ${req.params.id} updated`);
// });

// // Delete user (DELETE)
// app.delete('/user/:id', (req, res) => {
//   res.send(`User ${req.params.id} deleted`);
// });

// //for all methods 
// app.all("/secret", (req, res, next) => {
//   console.log(" secret section…");
//   next(); 
// });

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });

//to test what is middleware
// const express = require("express");
// const app = express();

// // Middleware
// app.use((req, res, next) => {
//   console.log("Request received:", req.method, req.url);
//   next(); 

// });


// app.get("/user", (req, res) => {
//   res.send("Hello World");
// });

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });




