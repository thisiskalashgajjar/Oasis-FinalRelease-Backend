const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "not worthy";
var fetchUser = require("../middleware/fetchUser");
// create a user endpoint
router.post('/signup',
    [
        body("email", "enter a valid email").isEmail(),
        body("name", "enter a valid name"),
        body("password", "enter at least 3 characters").isLength({ min: 3 }),

    ], async (req, res) => {
        let success = false;
        const error = validationResult(req, res);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        // check email is already exists or not valid
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false;
                return res.status(200).json({ success, error: "user with this account already exists" });

            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });

            const data = {
                user: {
                    id: user.id,
                }
            }
            var authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authtoken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("some error occurred");
        }

    });

// create a login endpoint
router.post(
    "/login",
    [
        body("email", "enter a valid email").isEmail(),
        body("password", "can not be empty").exists(),
    ],
    async (req, res) => {
        let success = false;
        // for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email: email });
            if (!user) {
                success = false
                return res
                    .status(404)
                    .json({ errors: "please enter valid credentials" });
            }
            const passCompare = await bcrypt.compare(password, user.password);
            if (!passCompare) {
                success = false
                return res

                    .status(404)
                    .json({ success, errors: "please enter valid credentials" });
            }
            const data = {
                user: {
                    id: user.id,
                },
            };

            var authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authtoken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error occurred");
        }
    }
);

// fetch users
router.post('/fetch', fetchUser, async (req, res) => {
    try {
        userid = req.user.id
        const user = await User.findById(userid).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occurred");
    }

});
module.exports = router;