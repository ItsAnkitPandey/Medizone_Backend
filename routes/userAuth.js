import express from 'express'
import { User } from '../models/userModel.js'
import { body, validationResult } from 'express-validator'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import fetchuser from '../middleware/fetchuser'
const JWT_SECRET = "medi$zone"

const router = express.Router();

//Route for creating a new user
router.post('/signup', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'Password must atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    // if there are errors, return Bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let success = false;
        //check whether the user with same email is already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with same email exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create a new user
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: secPass
        }
        user = await User.create(newUser);

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        return res.status(201).send({success, user});
    } catch (error) {
        console.log(error.messge);
        return res.status(500).send({ message: error.message })
    }
})

//Route for login an user
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(404).json({success, message: 'User not found'});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(401).json({success, message: 'Wrong Password! Access Denied'})
        }
        const data = {
            user: {
               id: user.id
            }
         }
         const authtoken = jwt.sign(data, JWT_SECRET);
         success = true;
         return res.status(200).send({success, username: user.name });
         
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
})


export default router;