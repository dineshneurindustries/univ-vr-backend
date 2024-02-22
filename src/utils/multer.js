const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const httpStatus = require('http-status');
const awsConfig = require('../config/config');

const bucketName = 'univ-vr-file';

const s3 = new aws.S3(awsConfig.aws);
const ApiError = require('./ApiError');

const storages = multer.memoryStorage();

function checkFileType(file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error('Only images (jpeg, jpg, png) are allowed'));
}

const upload = multer({
  storage: storages,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const uploadToS3 = async (file, folder) => {
  try {
    const key = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error in uploadToS3: ${error}`);
  }
};

const deleteFromS3 = async (objectUrl) => {
  try {
    const objectKey = new URL(objectUrl).pathname.substring(1);

    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };
    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error deleting object from S3: ${error.message}`);
  }
};

const uploadFiles = upload.single('image');

module.exports = {
  uploadFiles,
  uploadToS3,
  deleteFromS3,
};
