const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_ACCOUNT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCOUNT_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY,
  },
});

// cache the ESM import so we only do it once
let uuidModulePromise = null;

async function getUuidV4() {
  if (!uuidModulePromise) {
    uuidModulePromise = import('uuid');
  }
  const mod = await uuidModulePromise;
  return mod.v4;
}

const uploadImage = async (folderName, file) => {
  console.log('Uploading file:', file.originalname);
  try {
    const uuidv4 = await getUuidV4();

    const contentType = file.mimetype;
    const key = `${folderName}/${uuidv4()}_${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: contentType,
    });

    const response = await s3Client.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return { response, key, url };
  } catch (error) {
    console.error('Failed to upload file to S3:', error);
    throw error; // rethrow so caller can handle it
  }
};

module.exports = uploadImage;
