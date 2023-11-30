const express = require('express');
const { getSuccessStory, postSuccessStory } = require('../../controllers/successStory');
const router = express.Router();

router.get('/get-success-stories', getSuccessStory );
router.post('/post-success-story', postSuccessStory);


module.exports = router;

