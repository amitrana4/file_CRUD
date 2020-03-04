'use strict';

/**
 * Created by Amit.
 */

// Bring in our dependencies
const compression = require('compression'),
app = require('express')(),
customRoutes = require('./Routes'),
cors = require('cors'),
bodyParser = require('body-parser'),
path = require('path'),
Config = require('./Config');
let cron = require('node-cron');
var Controller = require('./Controllers');

(async () => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    const corsOptions = {
        credentials: true,
    };
    //Cors for fronend
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    //Busboy to upload file in local system
    var busboy = require('connect-busboy'); //middleware for form/file upload
    app.use(busboy());
    app.use(require('express').static(path.join(__dirname, 'public')));
    //Compression to make our system fast
    app.use(compression())


    const rateLimit = require("express-rate-limit");
 
    // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // app.set('trust proxy', 1);
    


    // To limit our requests
    // It is not good if you use Nodejs filter the connection or apply the connection policy as that.

    // It is better if you use Nginx in front of NodeJS

    // Client --> Nginx --> Nodejs or Application.

    // It is not difficult and cheap because Ngnix is opensource tooo.
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10
    });
    
    // only apply to requests that begin with /
    app.use("/", apiLimiter);


    app.use('/', customRoutes);
    // Turn on that server!


    //Scheduler to delete files 1 week old
    cron.schedule('*/1 * * * *', async () => {
        await Controller.FilesController.deleteFileAfterWeek()
      });

    //Checking S3 info in environment variables
    if(process.env.FOLDER && process.env.FOLDER == 'S3'){
        if(!process.env.BUCKET_ID || !process.env.BUCKET_SECRET && !process.env.BUCKET_NAME && !process.env.REGION){
            console.warn("S3 keys required")
        }
    }
      //Starting our server
    app.listen(process.env.PORT, () => {
        console.log('App listening on port :' + process.env.PORT);
    });
    module.exports = app;
})();



