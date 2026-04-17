import { AppSupabaseClient } from "../queries/billing-queries";

export async function uploadFile(supabase: AppSupabaseClient, bucket: string, file: File, folderPath?: string) {
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    
    const filePath = folderPath 
        ? `${folderPath}/${Date.now()}-${safeFileName}` 
        : `${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
        console.error("File Upload Error:", uploadError);
        return { error: uploadError };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl };
}