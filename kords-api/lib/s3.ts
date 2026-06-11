import { createClient } from "@supabase/supabase-js";
import 'multer';

const supabase = createClient(
    `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const uploadImage = async (
    file: Express.Multer.File,
    folder: string
): Promise<string> => {
    const sanitizedName = file.originalname
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${sanitizedName}`;
    const key = `${folder}/${fileName}`;

    const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME!)
        .upload(key, file.buffer, { contentType: file.mimetype });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME!)
        .getPublicUrl(key);

    return data.publicUrl;
};