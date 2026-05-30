const {Router} = require('express');
const TesteController = require('../controllers/TesteController');

const router = Router();

router.get('/',  TesteController.helloWorld);

module.exports = router;