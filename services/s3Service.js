const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/awsConfig');

exports.uploadVideoToS3 = async (fileBuffer, key) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: 'video/mp4',
    };

    await s3.send(new PutObjectCommand(params));

    const videoUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return videoUrl;
  } catch (error) {
    console.error('Error uploading video to S3:', error);
    throw new Error('Could not upload video to S3');
  }
};
