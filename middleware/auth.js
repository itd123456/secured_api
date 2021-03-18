const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) =>{

    const token = req.header("x-auth-token");
    if(!token)
        return res.status(401).json({msg: "No authentication token, authorization denied!"});
    
    await jwt.verify(token, process.env.JWT_SECRET, (err, data)=>{
        if(err) return res.status(401).json({msg: "Token verification failed, authorization denied!", env: process.env.JWT_SECRET});
        next();
    })
}

module.exports = auth;