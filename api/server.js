// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting all users',
                error: err.message
            })
        })
});

server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).json({
                message: `user by id ${req.params.id} does not exist`
            })
        } else {
            res.json(user)
        }
    } catch (err) {
        res.status(500).json({
            message: 'error getting user by id',
            error: err.message
        })
    }
});

server.post('/api/users', async (req, res) => {
    try {
        if (!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: 'name and bio are required'
            })
        } else {
            const newUser = await User.insert(req.body)
            res.status(201).json(newUser)
        }
    } catch (err) {
        res.status(500).json({
            message: 'error posting new user',
            error: err.message
        })
    }
});

module.exports = server;
