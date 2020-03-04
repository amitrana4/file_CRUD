'use strict';
/**
 * Created by Amit.
 */
var Controller = require('../Controllers');
const routes = require('express').Router();
const fs = require('fs');
const Config = require('../Config');
const path = require("path");
const mime = require('mime');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
 
routes.use('/api-docs', swaggerUi.serve);
routes.get('/api-docs', swaggerUi.setup(swaggerDocument));

/********
 *  Save file to our local database, if S3 environment then store to S3
 ***********/
routes.post('/files', async (req, res) => {
    var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            //Path where image will be uploaded
            const newName = new Date().getTime()+filename;
            fstream = fs.createWriteStream(__dirname + '/../Files/' + newName);
            file.pipe(fstream);
            fstream.on('close', async function () {  
                try {
                    //Controlle action
                    let result = await Controller.FilesController.fileData(newName);
                    return res.status(200).json(Config.APP_CONSTANTS.sendSuccess(result));
                }
                catch (e) {
                    res.status(400).json(e);
                }         //where to go next
            });
        });
});

/********
 *  Getting all files
 ***********/
routes.get('/files', async (req, res) => {
    try {
        //controller action
        let result = await Controller.FilesController.getAllFiles()
        return res.status(200).json(Config.APP_CONSTANTS.sendSuccess(result));
    }
    catch (e) {
        res.status(400).json(e);
    }
});

/********
 *  Getting files using public key
 ***********/
routes.get('/files/:publicKey', async (req, res) => {
    try {
        //controller action
        let result = await Controller.FilesController.getFilesById(req.params.publicKey);
        if(result.length > 0){
            var url = path.join(__dirname, '../', 'Files/') + result[0].fileName;
            if (fs.existsSync(url)) {
                fs.readFile(url, function(err, data) {
                    if (err) {
                        res.writeHead(404);
                        return res.end("File not found.");
                    }
                    res.setHeader("Content-Type", mime.lookup(url)); //Solution!
                    res.writeHead(200);
                    res.end(data);
                });
            } else {
                return res.status(200).json(Config.APP_CONSTANTS.STATUS_MSG.ERROR.FILE_NOT_FOUND);
            }
        }
        else {
            return res.status(200).json(Config.APP_CONSTANTS.STATUS_MSG.ERROR.PUBLIC_KEY_ERROR);
        }
    }
    catch (e) {
        res.status(400).json(e);
    }
});

/********
 *  delete file using private key
 ***********/
routes.delete('/files/:privateKey', async (req, res) => {
    try {
        //controller action
        let result = await Controller.FilesController.deleteFileById(req.params.privateKey)
        return res.status(200).json(Config.APP_CONSTANTS.sendSuccess(result));
    }
    catch (e) {
        res.status(400).json(e);
    }
});

module.exports = routes;
