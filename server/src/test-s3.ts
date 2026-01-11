import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function test() {
  console.log("Testing AWS Config:");
  console.log("Region:", process.env.AWS_REGION);
  console.log("Bucket:", process.env.AWS_BUCKET_NAME);
  console.log("AccessKey:", process.env.AWS_ACCESS_KEY_ID ? "PRESENT" : "MISSING");
  
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log("Success! Buckets found:", data.Buckets?.map(b => b.Name));
  } catch (err: any) {
    console.error("Test Failed!", err.message);
  }
}

test();
