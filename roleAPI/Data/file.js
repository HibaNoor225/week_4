const fs = require("fs").promises;
const path = require("path");
const filePath = path.join(__dirname, "users.json");

class database {
   async readFile()
    {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  }

   async writeFile(users) {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
  }

   async getAllUsers() {
    return await this.readFile();
  }

   async getUserById(id) {
    const users = await this.readFile();
    return users.find(user => user.id === id);
  }

   async addUser(newUser) {
    const users = await this.readFile();
    users.push(newUser);
    await this.writeFile(users);
  }

 async updateUser(id, updatedData) {
    const users = await this.readFile();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return false;

    //users[index] = { id: users[index].id, ...updatedData };

    users[index] = { ...users[index], ...updatedData };
    await this.writeFile(users);
    return true;
  }

   async deleteUser(id) {
    const users = await this.readFile();
    const available= users.filter(user => user.id !== id);
    await this.writeFile(available);
  }
}

module.exports =new database();