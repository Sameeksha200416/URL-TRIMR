// Manual test utility - Add this to console to test Supabase connection

import supabase from "@/db/supabase";

export const testSupabaseConnection = async () => {
  try {
    console.log("🔍 Testing Supabase connection...");
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('test')
      .select('*')
      .limit(1);
      
    if (testError && !testError.message.includes('relation "test" does not exist')) {
      console.error("❌ Connection test failed:", testError);
      return false;
    }
    
    console.log("✅ Basic connection working");
    
    // Test 2: Storage buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error("❌ Storage access failed:", bucketError);
      return false;
    }
    
    console.log("✅ Storage access working. Buckets:", buckets);
    
    // Test 3: Auth status
    const { data: authData } = await supabase.auth.getUser();
    console.log("Current auth user:", authData.user);
    
    return true;
    
  } catch (error) {
    console.error("❌ Supabase test failed:", error);
    return false;
  }
};

// Add to window for easy console access
if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection;
}
