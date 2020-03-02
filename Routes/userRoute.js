'use strict';
/**
 * Created by Amit on 13 may 2018.
 */
var Controller = require('../Controllers');
const routes = require('express').Router();
const Joi = require('joi');



const schema = Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    role: Joi.boolean().required()
});


routes.post('/createUser', async (req, res) => {
    let fieldsRequired = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }
    const result = Joi.validate(fieldsRequired, schema);
    if (result.error) {
        res.status(400).json({ message: result.error.message });
        return;
    }
    try {
        //fieldsRequired.ipAddress = req.info.remoteAddress || null
        let userController = await Controller.UserController.createUser(fieldsRequired)
        res.status(200).json({ statusCode: 200, message: 'success', data: userController });
    }
    catch (e) {
        res.status(400).json(e);
    }
});



routes.get('/deleteUser', async (req, res) => {
    try {
        let userController = await Controller.UserController.deleteUser(req.query.id)
        res.status(200).json({ statusCode: 200, message: 'success', data: userController });
    }
    catch (e) {
        res.status(400).json(e);
    }
});

routes.get('/getUsers', async (req, res) => {
    try {
        let userController = await Controller.UserController.getUsers()
        res.status(200).json({ statusCode: 200, message: 'success', data: userController });
    }
    catch (e) {
        res.status(400).json(e);
    }
});


routes.get('/getUserById', async (req, res) => {
    try {
        let userController = await Controller.UserController.getUserById(req.query.id)
        res.status(200).json({ statusCode: 200, message: 'success', data: userController });
    }
    catch (e) {
        res.status(400).json(e);
    }
});




module.exports = routes;
