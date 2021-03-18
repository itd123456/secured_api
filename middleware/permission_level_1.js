const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const plvl1 = async (req, res, next) =>{

    const token = req.header("x-auth-token");
    if(!token)
        return res.status(401).json({msg: "No authentication token, authorization denied!"});
    
    await jwt.verify(token, process.env.JWT_SECRET, (err, data)=>{
        if(err) return res.status(401).json({msg: "Token verification failed, authorization denied!", env: process.env.JWT_SECRET});

        User.findOne({_id: data.id}, (err, data)=>{
            if(err) return res.statu(401).msg({msg: "Id does not match"})

            if(data.permissionLevel != 1) return res.status(403).json({msg: "Permission denied!"});
            next();
        }) 
    })
}

module.exports = plvl1;