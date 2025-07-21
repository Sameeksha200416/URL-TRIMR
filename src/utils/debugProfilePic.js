// Debug utility for profile picture issues

export const debugProfilePicture = (user) => {
  console.log("=== Profile Picture Debug Info ===");
  console.log("Full user object:", user);
  
  if (user?.user_metadata) {
    console.log("User metadata:", user.user_metadata);
    console.log("Profile pic path from metadata:", user.user_metadata.profile_pic_path_of_supabase);
  }
  
  if (user?.profile_pic_path_of_supabase) {
    console.log("Profile pic path direct:", user.profile_pic_path_of_supabase);
  }
  
  const profilePicUrl = user?.user_metadata?.profile_pic_path_of_supabase || user?.profile_pic_path_of_supabase;
  console.log("Final profile pic URL:", profilePicUrl);
  
  if (profilePicUrl) {
    // Test if the image URL is accessible
    const img = new Image();
    img.onload = () => console.log("✅ Profile picture loaded successfully");
    img.onerror = () => console.log("❌ Profile picture failed to load");
    img.src = profilePicUrl;
  } else {
    console.log("❌ No profile picture URL found");
  }
  
  console.log("=== End Debug Info ===");
};
