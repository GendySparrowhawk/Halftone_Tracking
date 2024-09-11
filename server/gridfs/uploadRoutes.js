const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { s3 } = require("../config/connection");
const { PutObjectCommand } = require("@aws-sdk/client-s3");


require("dotenv").config();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = Date.now().toString() + path.extname(file.originalname);
      cb(null, filename);
    },
  }),
});

module.exports = upload;
