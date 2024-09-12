const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { s3 } = require("../config/connection");
const { PutObjectCommand } = require("@aws-sdk/client-s3");


require("dotenv").config();

const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith("image/jpeg") || file.mimetype.startsWith("image/png")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, must be PNG or JPEG"))
  }
};

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
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  fileFilter: fileFilter
});

module.exports = upload;
