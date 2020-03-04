'use strict';

var Service = require('../Service');
var md5 = require('md5');
const fs = require('fs');
var path = require("path");
const Config = require('../Config');
const AWS = require('aws-sdk');

// Enter copied or downloaded access ID and secret key here
const ID = process.env.BUCKET_ID;
const SECRET = process.env.BUCKET_SECRET;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

/********
 *  Create bucket if not created
 ***********/
let createBucket = () => {
    const params = {
        Bucket: BUCKET_NAME,
        CreateBucketConfiguration: {
            // Set your region here
            LocationConstraint: process.env.REGION
        }
    };
    
    s3.createBucket(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log('Bucket Created Successfully', data.Location);
        return;
    });
}

/********
 *  Upload to s3 bucket
 ***********/
let uploadToS3Bucket = (filename) => {
    return new Promise(async (resolve, reject) => {
        if(!BUCKET_NAME && !ID && !SECRET){
            return reject("Invalid Info")
        }
        // Read content from the file
        const fileContent = fs.readFileSync(path.join(__dirname, '../', 'Files/') + filename)
        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: filename, // File name you want to save as in S3
            Body: fileContent
        };

        // Uploading files to the bucket
        s3.upload(params, function(err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data.Location)
           // console.log(`File uploaded successfully. ${data.Location}`);
        });
    })
}


/********
 *  SAve to databse, folder and s3 controller
 ***********/
var fileData = (payloadData) => {
        return new Promise(async (resolve, reject) => {
                //await createBucket()
                let finalObj = {}
                if(process.env.FOLDER == 'S3'){
                    try {
                        let bucketFileName = await uploadToS3Bucket(payloadData)
                        finalObj.bucketFileName = bucketFileName;
                    }
                    catch(e){
                        return reject(e)
                    }
                }
                finalObj.privateKey = md5(payloadData + 'PRIVATE' + new Date().getTime())
                finalObj.publicKey = md5(payloadData + 'PUBLIC' + new Date().getTime())
                finalObj.fileName = payloadData;
                finalObj.date = new Date().getTime();
                try {
                let userData = await Service.FilesService.createFile(finalObj);
                return resolve(userData)
                }
                catch (error) {
                    return reject(error)
                }
        })
};


/********
 *  Getting all files 
 ***********/
var getAllFiles = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = await Service.FilesService.getAllFiles()
            return resolve(userData);
        }
        catch (error) {
            return reject(error);
        }
    })
};


/********
 *  Getting files via ID
 ***********/
var getFilesById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileData = await Service.FilesService.getFilesById(id, 'PUBLIC')
            return resolve(fileData);
        }
        catch (error) {
            return reject(error);
        }
    })
};

/********
 *  Delete file controller
 ***********/
var deleteFileById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(id)
            let fileData = await Service.FilesService.getFilesById(id, 'PRIVATE')
            if(fileData.length > 0){
                var url = path.join(__dirname, '../', 'Files/') + fileData[0].fileName;
                if (fs.existsSync(url)) {
                    fs.unlinkSync(url);
                    fileData[0].delete = true
                    let result = await Service.FilesService.deleteFile(id, fileData[0])
                    return resolve(result)
                }
                else {
                    return resolve(Config.APP_CONSTANTS.STATUS_MSG.ERROR.PRIVATE_FILE_NOT_FOUND)
                }
            }
            else {
                return resolve(Config.APP_CONSTANTS.STATUS_MSG.ERROR.PRIVATE_KEY_ERROR)
            }
           // let deleteFileData = await Service.UserService.deleteFileById(id)
        }
        catch (error) {
            return reject(error);
        }
    })
};

/********
 *  Delete file using cron job
 ***********/
var deleteFileAfterWeek = () => {
    return new Promise(async (resolve, reject) => {
        try {
            var date = new Date();
            date.setDate(date.getDate() - 7);
            let filesData = await Service.FilesService.getAllFiles(date)
            for(let i = 0; i < filesData.length; i++){
                if(filesData[i].date && filesData[i].date <= new Date(date).getTime()){
                    var url = path.join(__dirname, '../', 'Files/') + filesData[i].fileName;
                    if (fs.existsSync(url)) {
                        fs.unlinkSync(url);
                        filesData[i].delete = true
                        let result = await Service.FilesService.deleteFile(filesData[i].privateKey, fileData[i])
                        return resolve(result)
                    }
                }
            }
            return resolve()
        }
        catch (error) {
            return reject(error);
        }
    })
};

module.exports = {
    fileData: fileData,
    getAllFiles: getAllFiles,
    getFilesById: getFilesById,
    deleteFileById: deleteFileById,
    deleteFileAfterWeek: deleteFileAfterWeek
};