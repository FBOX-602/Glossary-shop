/* ==========================================================================
   FreshMart Grocery eCommerce - Supabase Media Storage Upload Manager
   ========================================================================== */

async function uploadMediaToSupabaseBucket(bucketName, file, customFileName = null) {
    const client = getSupabaseClient();
    if (!client) {
        console.warn('Supabase client not available for storage upload.');
        return null;
    }

    try {
        const fileExt = file.name ? file.name.split('.').pop() : 'png';
        const fileName = customFileName || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await client.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error(`Supabase Storage upload to [${bucketName}] failed:`, error.message);
            return null;
        }

        const { data: urlData } = client.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return urlData ? urlData.publicUrl : null;
    } catch (err) {
        console.error('Supabase Storage exception:', err);
        return null;
    }
}
