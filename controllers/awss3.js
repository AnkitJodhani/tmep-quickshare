const S3 = require('aws-sdk/clients/s3');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const bucketName=process.env.AWS_BUCKET_NAME
const region=process.env.AWS_BUCKET_REGION
const accessKeyId=process.env.AWS_ACCESS_KEY
const secretAccessKey=process.env.AWS_SECRET_ID


const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
})

// upload the files from s3 
exports.uploadImage = (file,uuid)=>{
    const fileStream = fs.createReadStream(file.path)
    const uploadParams={
        Bucket:bucketName,
        Body: fileStream,
        Key: uuid
    }
    return s3.upload(uploadParams).promise();
}

// download the file from s3


exports.downloadImage = async (Key,res) =>{

    const downParams = {
        Key,
        Bucket:bucketName
    }
    const objectMetadata = await s3.headObject(downParams).promise();
    res.set('Content-Disposition', `attachment; filename=${Key}`);
    res.set('Content-Type', objectMetadata.ContentType);
    const data = s3.getObject(downParams).createReadStream();
    data.pipe(res)
}

