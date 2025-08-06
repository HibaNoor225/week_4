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

   async getAllTasks() {
    return await this.readFile();
  }

   async getAllTasksById(id) {
    const tasks= await this.readFile();
    return tasks.find(user => user.id === id);
  }

   async addTask(newTask) {
    const tasks= await this.readFile();
    tasks.push(newTask);
    await this.writeFile(tasks);
  }

 async updateTask(id, updatedData) {
    const tasks = await this.readFile();
    const index = tasks.findIndex(user => user.id === id);
    if (index === -1) return false;

    //users[index] = { id: users[index].id, ...updatedData };

    tasks[index] = { ...tasks[index], ...updatedData };
    await this.writeFile(tasks);
    return true;
  }

   async deleteTask(id) {
    const tasks = await this.readFile();
    const available= tasks.filter(user => user.id !== id);
    await this.writeFile(available);
  }
}

module.exports =new database();