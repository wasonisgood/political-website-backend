 // src/middleware/upload.js
 const multer = require('multer');
 const path = require('path');
 const config = require('../config/config');
 
 const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
     cb(null, `${Date.now()}${path.extname(file.originalname)}`);
   }
 });
 
 const fileFilter = (req, file, cb) => {
   if (config.upload.allowedTypes.includes(file.mimetype)) {
     cb(null, true);
   } else {
     cb(new Error('Invalid file type'), false);
   }
 };
 
 const upload = multer({
   storage: storage,
   limits: config.upload.limits,
   fileFilter: fileFilter
 });
 
 module.exports = upload;
 

 