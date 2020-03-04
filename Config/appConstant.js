'use strict';



var SERVER = {
    APP_NAME: 'FILE UPLOAD'
};

var DATABASE = {
    FOLDER: './Database',
    FILE: 'Files'
};


var STATUS_MSG = {
    ERROR: {
        FILE_NOT_FOUND: {
            status: 400,
            type: 'FILE_NOT_FOUND',
            customMessage: 'File not found, Please check public key'
        },
        PUBLIC_KEY_ERROR: {
            status: 400,
            type: 'PUBLIC_KEY_ERROR',
            customMessage: 'No data found with this key'
        },
        PRIVATE_KEY_ERROR: {
            status: 400,
            type: 'PRIVATE_KEY_ERROR',
            customMessage: 'No data found with this key'
        },
        PRIVATE_FILE_NOT_FOUND: {
            status: 400,
            type: 'FILE_NOT_FOUND',
            customMessage: 'File not found, Please check private key'
        },

    },
    SUCCESS: {
        CREATED: {
            status: 201,
            customMessage: 'Created Successfully',
            type: 'CREATED'
        },
        DEFAULT: {
            status: 200,
            customMessage: 'Success',
            type: 'DEFAULT'
        },
        UPDATED: {
            status: 200,
            customMessage: 'Updated Successfully',
            type: 'UPDATED'
        },
        LOGOUT: {
            status: 200,
            customMessage: 'Logged Out Successfully',
            type: 'LOGOUT'
        },
        DELETED: {
            status: 200,
            customMessage: 'Deleted Successfully',
            type: 'DELETED'
        }
    }
};


var sendSuccess = function (data) {
    if (typeof data == 'object' && data.hasOwnProperty('status') && data.hasOwnProperty('customMessage')) {
        return {status:data.status, message: data.customMessage, data: data.data || null};

    }else {
        return {status:200, message: "Success", data: data || null};
    }
};

var APP_CONSTANTS = {
    SERVER: SERVER,
    DATABASE: DATABASE,
    STATUS_MSG: STATUS_MSG,
    sendSuccess: sendSuccess
};

module.exports = APP_CONSTANTS;