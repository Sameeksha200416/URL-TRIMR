// Quick fix for missing titles
import supabase from "@/db/supabase";

export const addTitlesToExistingUrls = async (userId) => {
  try {
    console.log("🔧 Adding titles to existing URLs...");
    
    // Get all URLs without titles
    const { data: urls, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', userId)
      .or('title_of_url.is.null,title_of_url.eq.');
      
    if (error) {
      console.error("Error fetching URLs:", error);
      return;
    }
    
    console.log(`Found ${urls.length} URLs without titles`);
    
    for (const url of urls) {
      let title = "Link";
      
      // Generate title from original URL
      try {
        const urlObj = new URL(url.original_url);
        const domain = urlObj.hostname.replace('www.', '');
        
        if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
          title = "YouTube Video";
        } else if (domain.includes('github.com')) {
          title = "GitHub Repository";
        } else if (domain.includes('takeuforward.org')) {
          if (url.original_url.includes('interview')) {
            title = "Interview Course";
          } else if (url.original_url.includes('striver')) {
            title = "Striver Course";
          } else {
            title = "TakeUForward";
          }
        } else if (domain.includes('codehelp.in')) {
          title = "CodeHelp Course";
        } else {
          title = domain.charAt(0).toUpperCase() + domain.slice(1);
        }
      } catch (e) {
        title = "Link";
      }
      
      // Update the URL with title
      const { error: updateError } = await supabase
        .from('urls')
        .update({ title_of_url: title })
        .eq('id', url.id);
        
      if (updateError) {
        console.error(`Error updating URL ${url.id}:`, updateError);
      } else {
        console.log(`✅ Updated URL ${url.id} with title: "${title}"`);
      }
    }
    
    console.log("🎉 Title update completed!");
    return true;
    
  } catch (error) {
    console.error("Error in addTitlesToExistingUrls:", error);
    return false;
  }
};

// Add to window for console access
if (typeof window !== 'undefined') {
  window.addTitlesToExistingUrls = addTitlesToExistingUrls;
}
