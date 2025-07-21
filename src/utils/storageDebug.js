import supabase from "@/db/supabase";

export const checkStorageBucketSetup = async () => {
  try {
    console.log("=== Checking Supabase Storage Setup ===");
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error fetching buckets:", bucketsError);
      return;
    }
    
    console.log("Available buckets:", buckets);
    
    // Check if profile-pic bucket exists
    const profilePicBucket = buckets.find(bucket => bucket.name === 'profile-pic');
    
    if (profilePicBucket) {
      console.log("✅ profile-pic bucket found:", profilePicBucket);
      
      // Try to list files in the bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('profile-pic')
        .list();
        
      if (filesError) {
        console.error("❌ Error accessing profile-pic bucket:", filesError);
      } else {
        console.log("✅ Files in profile-pic bucket:", files);
      }
    } else {
      console.log("❌ profile-pic bucket not found");
    }
    
    console.log("=== End Storage Check ===");
    
  } catch (error) {
    console.error("Error checking storage setup:", error);
  }
};

export const testImageUpload = async (file) => {
  try {
    const testFileName = `test-${Date.now()}`;
    
    const { data, error } = await supabase.storage
      .from('profile-pic')
      .upload(testFileName, file);
      
    if (error) {
      console.error("Upload test failed:", error);
      return false;
    }
    
    console.log("Upload test successful:", data);
    
    // Clean up test file
    await supabase.storage.from('profile-pic').remove([testFileName]);
    
    return true;
  } catch (error) {
    console.error("Upload test error:", error);
    return false;
  }
};
