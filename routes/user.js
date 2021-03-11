const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

router.get("/", (req, res) => {
    let {email, password} = req.body

    if(!email || !password) return res.status(400).json({msg: "Email or password is required!"});

    User.findOne({email: email}, (err, data) =>{
        if(err) return res.status(400).json({msg: "Email does not exist"});
        
        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, (err, salt)=>{
            bcrypt.hash(password, salt, (err, hash) =>{
                if(err) return res.status(400).json({err : err});
                bcrypt.compare(data.password, hash, (err, result) =>{
                    if(err) return res.status(400).json({msg: "Invalid credential"});
                    res.status(200).json({result})
                })
            })
        })

    })
})

router.post("/add", (req, res) => {
    
    let {firstName, lastName, email, password, permissionLevel} = req.body

    if(!firstName || !lastName || !email || !password || !permissionLevel === '') res.status(400).json({msg: "All fields are required!"});

   

    User.findOne({email: email}, (err, data) =>{
        
        if(data) return res.status(400).json({msg: "Existing email address!"});

        if(!password.toUpperCase()) return res.status(400).json({msg: "Password 1 upper case, 1 number sign and 1 number digit is required"})

        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, (err, salt)=>{
            if(err) return res.status(400).json({err: err})
        
            bcrypt.hash(password, salt, (err, hash) =>{
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

module.exports = router;