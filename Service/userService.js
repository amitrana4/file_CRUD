'use strict';

const db = require('diskdb');
db.connect('./Database', ['User']);




//Delete User in DB
var deleteUser = async (id) => {
   db.User.remove({ _id: id });
   return db.User.find();
};

//Get Users from DB
var createUser = async (item) => {
    return db.User.save(item);
};

//Get Users from DB
var getUserById = async (id) => {
    return db.User.find({ _id: id });
};

//Get Users from DB
var getAllUser = async () => {
    return db.User.find();
};

//Get Users from DB
var updateUser = async (id, body) => {
   db.movies.update({ id: id }, body);
};

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    getUsers: getAllUser,
    updateUser: updateUser,
    getUserById: getUserById
};