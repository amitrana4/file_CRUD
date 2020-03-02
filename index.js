'use strict';

/**
 * Created by Amit.
 */

// Bring in our dependencies
var compression = require('compression');
const app = require('express')();

const customRoutes = require('./Routes');
var cors = require('cors');
var bodyParser = require('body-parser');

(async () => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    const corsOptions = {
        credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(compression())
 

    app.use('/', customRoutes);

    // Turn on that server!
    app.listen(8000, () => {
        console.log('App listening on port :' + 8000);
    });
})();