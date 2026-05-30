const {Router} = require('express');
const UserController = require('../controllers/UserController');

const router = Router();

router.get('/users', UserController.fetchTopUsers);
 

module.exports = router;
