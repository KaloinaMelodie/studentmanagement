let { User } = require("../model/schemas");

const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

function getAll(req, res) {
    User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.send(err);
    });
}

function findUserConnection(req, res) {

    const data = {
        username: req.body.username, 
        password: req.body.password,
    }

    if(req.body.student!=null){
        data.student = req.body.student
    }

    User.findOne(data)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "Nom d'utilisateur ou Mot de passe Incorrect." });
            }
            const userDto = user.toObject();
            delete userDto.password;

            const token = jwt.sign(
                {
                    userId: user._id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );
            userDto.token = token;

            res.send(userDto);
        })
        .catch((err) => {
            
            res.status(500).send({ message: "Erreur serveur", error: err });
        });
    }

module.exports = { findUserConnection };
