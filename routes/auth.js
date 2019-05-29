const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const models = require('../models');

//POST is register
router.post('/create', (req, res) => {
    const login = req.body.create - login;
    const password = req.body.create - password;


    if (!login || !password) {
        const fields = [];
        if (!login) fields.push('create-login')
        if (!password) fields.push('create-password')

        res.json({
            ok: false,
            error: 'all fields must be filled!',
            fields
        });
    } else if (!/^[a-zA-Z1-9]+$/.test(login)) {
        res.json({
            ok: false,
            error: "only latin letters and numbers!",
            fields: ['create-login']
        });
    } else if (login.length < 3 || login.length > 16) {
        res.json({
            ok: false,
            error: "login length from 3 to 16 characters!",
            fields: ['create-login']
        });
    } else if (password.length < 8) {
        res.json({
            ok: false,
            error: "the minimum password length is 8 characters!",
            fields: ['create-password']
        });
    } else {

        models.User.findOne({
            login
        }).then(user => {
            if (!user) {
                bcrypt.hash(password, null, (err, hash) => { //salt saltRounds
                    // Store hash in your password DB.
                    models.User.create({
                        login,
                        password: hash
                    }).then(user => {
                        //console.log(user);
                        req.session.userId = user.id;
                        req.session.userLogin = user.login;
                        res.json({
                            ok: true
                        });
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            ok: false,
                            error: "ERROR, try again later!"
                        });
                    });
                });
            } else {
                res.json({
                    ok: false,
                    error: "name is taken!",
                    fields: ['create-login']
                });
            }
        })

    }
});

//POST is autorized
router.post('/login', (req, res) => {
    const login = req.body.login - login;
    const password = req.body.login - password;

    if (!login || !password) {
        const fields = [];
        if (!login) fields.push('login-login')
        if (!password) fields.push('login-password')

        res.json({
            ok: false,
            error: 'all fields must be filled!',
            fields
        });
    } else {
        models.User.findOne({
                login
            }).then(user => {
                if (!user) {
                    res.json({
                        ok: false,
                        error: 'username and password are wrong!',
                        fields: ['login-login', 'login-password']
                    });
                } else {
                    bcrypt.compare(password, user.password, function(err, result) {
                        // res == true
                        if (!result) {
                            res.json({
                                ok: false,
                                error: 'username and password are wrong!',
                                fields: ['login-login', 'login-password']
                            });
                        } else {
                            //
                            req.session.userId = user.id;
                            req.session.userLogin = user.login;

                            res.json({
                                ok: true
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    ok: false,
                    error: "ERROR, try again later!"
                });
            });
    }
});

//GET logOUT
router.get('/logout', (req, res) => {
    if (req.session) {
        //delete session obj
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;