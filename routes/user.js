const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

//middleware
const auth = require("../middleware/auth");
const plvl1 = require("../middleware/permission_level_1");
const plvl2 = require("../middleware/permission_level_2");


router.get("/", async (req, res) => {
    let {email, password} = req.body

    if(!email || !password) return res.status(400).json({msg: "Email or password is required!"});

    await User.findOne({email: email}, (err, data) =>{
        if(err) throw err;
        if(!data) return res.status(400).json({msg: "Email does not exist"});
        const passwordCheck  = data.password;
        
        bcrypt.compare(password, passwordCheck, (err, result) =>{
            if(err) throw err;
            if(!result) return res.status(401).json({msg: "Invalid credential"});

            jwt.sign({id: data._id}, process.env.JWT_SECRET, (err, token)=>{
                if(err) throw err;
                res.status(200).json({token: token, id: data._id})
            })
        })
    })
})

router.post("/add", auth, plvl2, async(req, res) => {

    let {firstName, lastName, email, password, permissionLevel} = req.body

    if(!firstName || !lastName || !email || !password || !permissionLevel === '') return res.status(400).json({msg: "All fields are required!"});

    await User.findOne({email: email}, (err, data) =>{
        
        if(err) throw err
        if(data) return res.status(400).json({msg: "Existing email address!"});

        if(!password.toUpperCase()) return res.status(400).json({msg: "Password 1 upper case, 1 number sign and 1 number digit is required"})

        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, (err, salt)=>{
            if(err) return res.status(400).json({err: err})
            bcrypt.hash(password, salt, (err, hash) =>{
                if(err) throw err
                const saveUser = User({
                    firstName,
                    lastName,
                    email,
                    password: hash,
                    permissionLevel
                })
                saveUser.save((err, data) =>{
                    if(err) return res.status(400).json({err: err})
                    res.status(201).json({data});
                })
            })
        })
    })
})

router.get("/sample", auth, plvl1, async(req, res)=>{
    await res.status(200).json({msg: "GOOD!"});
})

module.exports = router;