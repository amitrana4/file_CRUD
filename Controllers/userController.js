'use strict';

var Service = require('../Service');

var createUser = (payloadData) => {
    
        return new Promise(async (resolve, reject) => {
            try {
                let userData = await Service.UserService.createUser(payloadData)
                return resolve(userData)
            }
            catch (error) {
                return reject(error)
            }
        })
    
};



var getUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = await Service.UserService.getUsers()
            return resolve(userData);
        }
        catch (error) {
            return reject(error);
        }
    })
};


var getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = await Service.UserService.getUserById(id)
            return resolve(userData);
        }
        catch (error) {
            return reject(error);
        }
    })
};

var deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = await Service.UserService.deleteUser(id)
            return resolve(userData);
        }
        catch (error) {
            return reject(error);
        }
    })
};



module.exports = {
    createUser: createUser,
    getUsers: getUsers,
    getUserById: getUserById,
    deleteUser: deleteUser
};