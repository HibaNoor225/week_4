const roles = {
  user: ['view_products'],
  manager: ['view_products', 'add_products', 'update_products'],
  admin: ['view_products', 'add_products', 'update_products', 'delete_products', 'promote_users']
};

module.exports = roles;
