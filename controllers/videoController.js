const multer = require('multer');
const { uploadVideoToS3 } = require('../services/s3Service');
const Video = require('../models/videoModel');

// Set up multer for file upload (in-memory storage)
const storage = multer.memoryStorage();

const upload = multer({ storage });
console.log(upload);

exports.uploadVideo = upload.single('video');

exports.handleVideoUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoKey = `videos/${Date.now()}-${req.file.originalname}`;
    const videoUrl = await uploadVideoToS3(req.file.buffer, videoKey); 

    // Optionally, save video details to the database
    const newVideo = new Video({ title: req.body.title, url: videoUrl });
    await newVideo.save();

    res.status(200).json({ message: 'Video uploaded successfully', videoUrl });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

