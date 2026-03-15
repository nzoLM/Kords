import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import 'multer';

const s3Client = new S3Client({
    region: process.env.SUPABASE_PROJECT_REGION,
    credentials: {
        accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.SUPABASE_DATA_ENDPOINT,
});

export const uploadImage = async (
    file: Express.Multer.File,
    folder: string
): Promise<string> => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const key = `${folder}/${fileName}`;

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: "Media",
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
        );

        return `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${process.env.SUPABASE_BUCKET_NAME}/${key}`;
    } catch (error) {
        throw new Error(`S3 upload failed: ${error}`);
    }
};