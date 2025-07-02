// import AWS from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";
// import { env } from "../config/env.config";

// class S3Service {
//   private s3: AWS.S3;

//   constructor() {
//     this.s3 = new AWS.S3({
//       accessKeyId: env.AWS.accessKeyId,
//       secretAccessKey: env.AWS.secretAccessKey,
//       region: env.AWS.region,
//     });
//   }

//   async uploadFile(file: Express.Multer.File): Promise<string> {
//     try {
//       const fileExtension = file.originalname.split(".").pop();
//       const fileName = `parking/${uuidv4()}.${fileExtension}`;

//       const params = {
//         Bucket: env.AWS.bucketName,
//         Key: fileName,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ACL: "public-read",
//       };

//       const result = await this.s3.upload(params).promise();
//       return result.Location;
//     } catch (error) {
//       console.error("Error uploading to S3:", error);
//       throw new Error("Failed to upload image");
//     }
//   }

//   async deleteFile(fileUrl: string): Promise<void> {
//     try {
//       const urlParts = fileUrl.split("/");
//       const key = urlParts.slice(3).join("/");

//       const params = {
//         Bucket: env.AWS.bucketName,
//         Key: key,
//       };

//       await this.s3.deleteObject(params).promise();
//     } catch (error) {
//       console.error("Error deleting from S3:", error);
//       throw new Error("Failed to delete image");
//     }
//   }
// }

// export const s3Service = new S3Service();

import fs from "fs";
import path from "path";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "../config";

import {  S3ClientConfig } from "@aws-sdk/client-s3";

const config: S3ClientConfig  = {
  region: env.AWS.region,
  retryMode: "standard",
  credentials: {
    accessKeyId: env.AWS.accessKeyId,
    secretAccessKey: env.AWS.secretAccessKey,
  },
};

const S3client = new S3Client(config);

async function generatePresignedURL(
  bucketName: string,
  objectKey: string,
  expirationTimeInSeconds = 604800
) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  try {
    const url = await getSignedUrl(S3client, command, {
      expiresIn: expirationTimeInSeconds,
    });
    return url;
  } catch (error) {
    throw error;
  }
}

export const uploadToS3 = async (localFilePath: string) => {
  if (!localFilePath) {
    throw new Error("File path is required");
  }

  const fileStream = fs.createReadStream(localFilePath);
  const folderName = "users-uploaded-files";
  const objectKey = `${folderName}/${path.basename(localFilePath)}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: objectKey,
  };

  const uploadOptions = {
    partSize: 100 * 1024 * 1024, // 100 MB per part
    queueSize: 4, // 4 parts concurrently
  };

  try {
    const parallelUpload = new Upload({
      client: S3client,
      params: uploadParams,
      leavePartsOnError: false, // optional
      ...uploadOptions,
    });

    const data = await parallelUpload.done();
    fs.unlinkSync(localFilePath);

    return objectKey;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw error;
  }
};
