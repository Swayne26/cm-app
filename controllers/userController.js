const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    const {username, email, password}= req.body;
    if(!username || !password || !email){
        res.status(404);
        throw new Error("All Fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({username, email, password: hashedPassword});
    if(user){
        res.status(201);
    } else{
        res.status(500);
        throw new Error("Failed to create user");
    }
    res.json({ message: "Register the user" });
};
const loginUser = async (req, res) => {

    const {email, password} = req.body;
    if(!email || !password){
        res.status(404);
        throw new Error("All Fields are mandatory");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1m"}
    )
        res.status(200).json({accessToken})
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.json({ message: "login user" });
};
const currentUser = async (req, res) => {
    res.json(req.user);
};

module.exports = {registerUser, loginUser, currentUser};