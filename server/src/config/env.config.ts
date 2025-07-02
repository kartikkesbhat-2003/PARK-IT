import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
  FROM_EMAIL: process.env.FROM_EMAIL as string,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD as string,
  AWS: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    region: process.env.AWS_REGION as string,
    bucketName: process.env.AWS_BUCKET_NAME as string,
  } as const,
  RAZORPAY: {
    keyId: process.env.RAZORPAY_KEY_ID as string,
    secret: process.env.RAZORPAY_KEY_SECRET as string,
  },
} as const;


