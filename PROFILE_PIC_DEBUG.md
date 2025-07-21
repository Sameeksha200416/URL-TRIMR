# Profile Picture Upload Troubleshooting Guide

## समस्या का समाधान (Problem Resolution)

आपकी profile picture upload की समस्या के लिए मैंने निम्नलिखित changes किए हैं:

### 1. Storage Bucket Name Fix
- **समस्या**: Code में `profile-pic` और `profile_pic` दोनों names use हो रहे थे
- **समाधान**: सभी जगह `profile-pic` का consistent use

### 2. Enhanced Error Handling
- Profile picture loading के लिए proper error handling
- Console में detailed debug information
- Image validation और fallback

### 3. New Utility Functions
- `profilePictureManager.js`: Complete profile picture management
- `debugProfilePic.js`: Debug utilities
- `testSupabase.js`: Connection testing

## Debug करने के Steps:

### Step 1: Supabase Connection Test
```javascript
// Browser console में run करें:
testSupabaseConnection()
```

### Step 2: Storage Bucket Check
```javascript
// Console में check करें:
checkStorageBucketSetup()
```

### Step 3: Manual Profile Picture URL Test
```javascript
// आपके current user के लिए:
debugProfilePicture(loggedInUser)
```

## Supabase Dashboard में Check करें:

1. **Storage Section** में जाएं
2. **Buckets** tab में `profile-pic` bucket होना चाहिए
3. **Policies** tab में public read access enable होना चाहिए

### Required RLS Policies for profile-pic bucket:

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pic');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'profile-pic' 
    AND auth.role() = 'authenticated'
);

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'profile-pic' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## अगर अभी भी problem है तो:

1. Browser Developer Tools → Console → errors check करें
2. Network tab में failed requests देखें
3. `testSupabaseConnection()` run करें
4. Supabase dashboard में RLS policies check करें

## Common Issues और Solutions:

### Issue 1: "bucket does not exist"
**Solution**: Code में bucket automatically create हो जाएगा

### Issue 2: "insufficient_scope" error
**Solution**: Supabase dashboard में storage access enable करें

### Issue 3: Image shows broken icon
**Solution**: URL manually browser में test करें

### Issue 4: Upload success but image not showing
**Solution**: RLS policies check करें Supabase dashboard में

## Testing Commands:

Development में console में ये commands use कर सकते हैं:

```javascript
// Basic connection test
await testSupabaseConnection()

// Storage setup check
await checkStorageBucketSetup()

// Current user debug
debugProfilePicture(window.loggedInUser)

// Manual image validation
await validateProfilePictureURL("your-image-url")
```
