const express = require('express');
const router = express.Router();
const videoController = require('../../controllers/videoController');

router.post('/', videoController.uploadVideo, videoController.handleVideoUpload);

module.exports = router;
