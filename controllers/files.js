const multer = require('multer');
const mongoose = require('mongoose');
const { v4: uuid4 } = require('uuid');
const path = require('path');
const File = require('../models/file');
const awss3 = require('./awss3.js');
const sendEmail = require('./email');
const emailTemplate = require('../service/emailtemp');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        return cb(null, uniqueName)
    }
})

let upload = multer({
    storage, // storage:storage
    limit: { fileSize: 100 * 1024 * 1024 }
}).single('myfile');

exports.pushFile = (req, res, next) => {

    // store file
    upload(req, res, async (err) => {
        // validate
        if (!req.file) {
            return res.status(500).json({ error: "Didn't recive any file", obj: req.file })
        }
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        // store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size,
        })
        const response = await file.save();
        // console.log(response);
        result = await awss3.uploadImage(req.file, response.filename)
        await unlinkFile(response.path); // delete file from the server
        // console.log(result);
        return res.status(200).json({ file: `${process.env.APP_URL}/files/${response.uuid}` })
    }
    )
}



exports.downloadFile = async (req, res) => {
    const uuid = req.params.uuid
    try {
        const file = await File.findOne({ uuid: uuid });
        if (!file) {
            return res.render('download',{ error:"this is cr3eateing cause"})
        }
        else {
            awss3.downloadImage(file.filename,res)
            // return readStream.pipe(res)
            // return res.download(readStream,file.filename);
            // res.status(200).json({message:"sdfsdf"})
            // readStream
        }
    }
    catch (err) {
        return res.render('download', { error: "Link has been expired last." })
    }
}


exports.showFile = async (req, res) => {
    const uuid = req.params.uuid
    try {
        const file = await File.findOne({ uuid: uuid })
        if (!file) {
            return res.render('download', { error: "Link has been expired." })
        }
        else {
            return res.render('download', {
                uuid: file.uuid,
                filename: file.filename,
                filesize: file.size,
                downloadlink: `${process.env.APP_URL}/files/download/${file.uuid}`
            })
        }
    } catch (err) {
        return res.render('download', { error: "something went wrong" })
    }

}

exports.sendEmail = async (req,res) =>{
    const {uuid, emailTo, emailFrom } = req.body;
     if(!uuid || !emailTo || !emailFrom)
     {
        return res.status(422).json({ error: "Please send all the required data." }) // 422 => validation error
     }
     
     // Get the data from the database
     const file = await File.findOne({uuid:uuid});
     if(file.sender)
     {
        return res.status(422).json({ error: "Email already sent" }) // 422 => validation error
     }

     file.sender = emailFrom;
     file.receiver = emailTo;

     const response = await file.save();

     // sendEmail

     sendEmail({
        from: emailFrom,
        to: emailTo,
        subject: "File Shared by QuichShare ",
        text: `${emailFrom} shared file with you`,
        html: emailTemplate({
            emailFrom,
            downloadLink: `${process.env.APP_URL}/files/download/${file.uuid}`,
            size: `${parseInt(file.size/1000)} KB`,
            expires: `24 Hours`
        })
     })

     res.status(200).send({success :true});

}