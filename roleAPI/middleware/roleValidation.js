const fs = require("fs");
const path=require("path")

class RoleValidator {
  
    constructor() {
    this.rolesData = {};
    this.loadRoles(); 
    this.validateRole = this.validateRole.bind(this);
    this.checkPermission = this.checkPermission.bind(this);
  }

  loadRoles() {
    try {
      const filePath = path.join(__dirname, "../data/role.json");
      const data = fs.readFileSync(filePath, "utf-8");
      this.rolesData = JSON.parse(data);
    } catch (err) {
      console.error("Error reading role data:", err);
    }
  }

  validateRole(req, res, next) {
    const role = req.query.role;

    if (!role || !this.rolesData[role]) {
      return res.status(403).json({ message: "Invalid or missing role" });
    }

    req.role = role;
    next();
  }

  checkPermission(permission) {
    return (req, res, next) => {
      const role = req.role;

      if (this.rolesData[role] && this.rolesData[role].includes(permission)) {
        next();
      } else {
        res.status(403).json({ message: "Permission denied" });
      }
    };
  }
}

module.exports = new RoleValidator();
