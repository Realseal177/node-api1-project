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
                message: 'The users information could not be retrieved',
                error: err.message
            })
        })
});

server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            res.json(user)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The user information could not be retrieved',
            error: err.message
        })
    }
});

server.post('/api/users', async (req, res) => {
    try {
        if (!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user'
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

server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const updatedUser = await User.update(id, body)
        if (!updatedUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else if (!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user'
            })
        } else {
            res.json(updatedUser)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The user information could not be modified',
            error: err.message
        })
    }
});

server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    User.remove(id)
        .then(deletedUser => {
            if (!deletedUser) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            } else {
                res.json(deletedUser)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'The user could not be removed',
                error: err.message
            })
        })
});



module.exports = server;
