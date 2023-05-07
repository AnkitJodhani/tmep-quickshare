
const router = require('express').Router();
const db = require('../config/db');
const os = require('os');
const fs = require('fs');
const path = require('path');


const tempDir = os.tmpdir();
const uploadDir = path.join(tempDir);

router.get('/',async (req,res)=>{
    const files = await fs.readdirSync(uploadDir, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    res.status(200).json({
        message:"welcome developer",
        db_status: db.db_status,
        health: "good",
        numberOffile: files.length
    })
});

module.exports = router;

