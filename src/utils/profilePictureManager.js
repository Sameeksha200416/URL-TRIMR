// Comprehensive solution for profile picture issues

import supabase, { supabaseUrl } from "@/db/supabase";

export const createProfilePictureBucket = async () => {
  try {
    console.log("Creating profile-pic bucket...");
    
    const { data, error } = await supabase.storage.createBucket('profile-pic', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error("Error creating bucket:", error);
      return false;
    }
    
    console.log("✅ Bucket created or already exists");
    return true;
  } catch (error) {
    console.error("Bucket creation failed:", error);
    return false;
  }
};

export const uploadProfilePicture = async (file, userName) => {
  try {
    // Ensure bucket exists
    await createProfilePictureBucket();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `dp-${userName.split(' ').join('-')}-${Date.now()}.${fileExt}`;
    
    console.log("Uploading file:", fileName);
    
    const { data, error } = await supabase.storage
      .from('profile-pic')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message);
    }
    
    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('profile-pic')
      .getPublicUrl(fileName);
    
    console.log("✅ Upload successful. Public URL:", urlData.publicUrl);
    
    return {
      fileName: fileName,
      publicUrl: urlData.publicUrl,
      fullPath: data.path
    };
    
  } catch (error) {
    console.error("Profile picture upload failed:", error);
    throw error;
  }
};

export const deleteProfilePicture = async (fileName) => {
  try {
    const { error } = await supabase.storage
      .from('profile-pic')
      .remove([fileName]);
      
    if (error) {
      console.error("Delete error:", error);
      return false;
    }
    
    console.log("✅ Profile picture deleted successfully");
    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    return false;
  }
};

export const validateProfilePictureURL = async (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
};
