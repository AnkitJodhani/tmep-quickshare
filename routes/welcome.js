
const router = require('express').Router();
const db = require('../config/db');

router.get('/',(req,res)=>{
    res.status(200).json({
        message:"welcome developer",
        db_status: db.db_status,
        health: "good"
    })
});

module.exports = router;

