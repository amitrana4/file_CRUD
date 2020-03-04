'use strict';

//In memory database to store everything localy
const db = require('diskdb');
db.connect('./Database', ['Files']);




//Delete File in DB
var deleteFileById = async (id) => {
   db.User.remove({ privateKey: id });
   return db.Files.find();
};

//Get file from DB
var createFile = async (item) => {
    return db.Files.save(item);
};

//Get file via ID from DB
var getFilesById = async (id, type) => {
    if(type == 'PRIVATE'){
    return db.Files.find({ privateKey: id });
    }
    else {
        return db.Files.find({ publicKey: id }); 
    }
};

//Get all files from DB
var getAllFiles = async () => {
    return db.Files.find();
};

//delete file from DB
var deleteFile = async (id, body) => {
    db.Files.update({ privateKey: id }, body);
   return db.Files.find({ privateKey: id });
};

//Get file via date
var getFilesByDate = async () => {
    return db.Files.find({ privateKey: id });
};

module.exports = {
    createFile: createFile,
    deleteFileById: deleteFileById,
    getAllFiles: getAllFiles,
    deleteFile: deleteFile,
    getFilesById: getFilesById,
    getFilesByDate: getFilesByDate
};