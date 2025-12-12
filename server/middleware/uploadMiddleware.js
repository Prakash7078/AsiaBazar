const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const express=require('express');
import { v4 as uuidv4 } from 'uuid';


const dotenv=require('dotenv');
dotenv.config();
const s3Client = new S3Client({
    region: process.env.AWS_ACCOUNT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCOUNT_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY,
    },
  });

const uploadImage=async (folderName,file) => {
  console.log("Uploading file:", file.originalname);
    try {
      const contentType = file.mimetype;
      const key = `${folderName}/${uuidv4()}_${file.originalname}`;

      const command =new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key:key,
        Body: file.buffer,
        ContentType: contentType,
      });
  
      const response = await s3Client.send(command);
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
      return { response, key, url };    
    } catch (error) {
      console.error("Failed to upload file to S3:", error);
    }
  };
  
module.exports=uploadImage;

//sending sns messages
// const express = require('express');
// const app = express();
// require('dotenv').config();

// var AWS = require('aws-sdk')

// app.get('/', (req, res) => {

//     console.log("Message = " + req.query.message);
//     console.log("Number = " + req.query.number);
//     console.log("Subject = " + req.query.subject);
//     var params = {
//         Message: req.query.message,
//         PhoneNumber: '+' + req.query.number,
//         MessageAttributes: {
//             'AWS.SNS.SMS.SenderID': {
//                 'DataType': 'String',
//                 'StringValue': req.query.subject
//             }
//         }
//     };

//     var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

//     publishTextPromise.then(
//         function (data) {
//             res.end(JSON.stringify({ MessageID: data.MessageId }));
//         }).catch(
//             function (err) {
//                 res.end(JSON.stringify({ Error: err }));
//             });

// });

// app.listen(3000, () => console.log('SMS Service Listening on PORT 3000'))