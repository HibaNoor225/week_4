//
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Route: /user
app.route('/user')
  .get((req, res) => {
    res.send('Get user');
  })
  .post((req, res) => {
    const data = req.body;
    res.send(`User created with data: ${JSON.stringify(data)}`);
  });

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
