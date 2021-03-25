const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dbConfig = require("../../conn");

router.post("/create", (req, res) => {
    // let {} = req.body;

    // if(!fname || !lname || !mname || !plevel || !email || !password || !bday) return res.statu(401).json({msg: "All fields are required!"});

    sql.connect(dbConfig, (err) => {
        if(err) throw err;

        const sqlReq = new sql.Request();

        sqlReq.execute("dswd.dbo.get_user_id_series").then((recordsets, returnvalue, affected)=>{
            res.status(200).json(recordsets);
        })


    })
})

module.exports = router;