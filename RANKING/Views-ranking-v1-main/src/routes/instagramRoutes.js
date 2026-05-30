const {Router} = require('express');
const InstagramController = require('../controllers/InstagramController');

const router = Router();

router.get('/instagram', InstagramController.fetchAndSave);
router.put('/instagram', InstagramController.fetchInstagramPostsDetails);
router.get('/instagram/comments', InstagramController.fetchInstagramPostsComments);
router.put('/instagram/views', InstagramController.fetchInstagramPostsViews);
router.get('/instagram/collaborators', InstagramController.syncInstagramPostsCollaborators);


module.exports = router;
