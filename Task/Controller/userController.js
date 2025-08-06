const users = require("../data.js");

const getAllUsers = (req, res) => {
  res.json(users);
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const addUser = (req, res) => {
  const user = req.body;

  user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  users.push(user);
  res.status(201).json({ message: "User registered", user });
};


const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    const newUser = req.body;
    newUser.id = id;
    users[index] = newUser;
    res.json({ message: "User updated", user: newUser });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    const deleted = users.splice(index, 1);
    res.json({ message: "User deleted", user: deleted[0] });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
