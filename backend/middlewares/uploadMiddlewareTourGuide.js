// handling uploading pictures from the device onto server and how to store in the database 
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    //This function configures how files are stored on your server. It takes an object with two properties: destination and filename
    // destination itself is a function determines the folder where the uploaded files will be saved.
     // It receives three arguments: req (the request object), file (the file being uploaded), and cb (a callback function).
     // file is actually in req but it takes both 
     //The cb (callback) function is used to signal completion of the operation being performed (in this case, the file upload).
     /*
     As for the cb function 
     The second argument specifies the result of the operation. In the case of the destination method, 
     it's the directory where the file should be stored. 
     In the case of the filename method, it's the new name of the file.
     */ 
     destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'UploadAcl')); // Ensures cross-platform compatibility
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
const uploadTourGuide = multer({ storage: storage });
module.exports = uploadTourGuide;