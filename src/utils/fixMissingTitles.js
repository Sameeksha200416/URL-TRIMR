// Utility to fix missing titles in existing URLs

import supabase from "@/db/supabase";

export const updateMissingTitles = async (userId) => {
  try {
    console.log("🔧 Checking for URLs with missing titles...");
    
    // Get all URLs for the user
    const { data: urls, error: fetchError } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error("Error fetching URLs:", fetchError);
      return;
    }
    
    // Find URLs with missing or empty titles
    const urlsWithoutTitles = urls.filter(url => 
      !url.title_of_url || url.title_of_url.trim() === ''
    );
    
    console.log(`Found ${urlsWithoutTitles.length} URLs without titles`);
    
    if (urlsWithoutTitles.length === 0) {
      console.log("✅ All URLs have titles!");
      return;
    }
    
    // Update each URL with a generated title
    for (const url of urlsWithoutTitles) {
      const generatedTitle = generateTitleFromUrl(url.original_url);
      
      const { error: updateError } = await supabase
        .from('urls')
        .update({ title_of_url: generatedTitle })
        .eq('id', url.id);
        
      if (updateError) {
        console.error(`Error updating URL ${url.id}:`, updateError);
      } else {
        console.log(`✅ Updated URL ${url.id} with title: "${generatedTitle}"`);
      }
    }
    
    console.log("🎉 Title update process completed!");
    
  } catch (error) {
    console.error("Error in updateMissingTitles:", error);
  }
};

const generateTitleFromUrl = (originalUrl) => {
  try {
    const url = new URL(originalUrl);
    const domain = url.hostname.replace('www.', '');
    const pathname = url.pathname;
    
    // Try to create a meaningful title
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return 'YouTube Video';
    } else if (domain.includes('github.com')) {
      return 'GitHub Repository';
    } else if (domain.includes('google.com')) {
      return 'Google Link';
    } else if (pathname && pathname !== '/') {
      const pathParts = pathname.split('/').filter(part => part);
      const lastPart = pathParts[pathParts.length - 1];
      return lastPart ? `${domain} - ${lastPart}` : domain;
    } else {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  } catch (error) {
    return 'Link';
  }
};

// Add to window for easy console access
if (typeof window !== 'undefined') {
  window.updateMissingTitles = updateMissingTitles;
}
