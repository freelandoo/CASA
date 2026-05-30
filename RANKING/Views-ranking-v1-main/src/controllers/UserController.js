const { fetchTopUsers} = require("../services/UserService");

module.exports = {
  async fetchTopUsers(req, res) {
    try {
      const users = await fetchTopUsers();
      res.json(users);
    } catch (error) {
  res.status(500).json({ 
    message: error.message,
    stack: error.stack,
    error 
  });
    }
  }
};
