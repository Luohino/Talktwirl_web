import React, { useRef, useState } from 'react';
import { supabase } from '../services/supabase';

const AddPost: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function handlePost() {
    if (!imageFile || !caption.trim()) return;
    setUploading(true);
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setUploading(false);
      alert('User not authenticated!');
      return;
    }
    try {
      // Upload image to Supabase Storage
      const ext = imageFile.name.split('.').pop();
      const fileName = `post-images/${user.id}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('post-images').upload(fileName, imageFile, { upsert: true });
      if (uploadError) throw uploadError.message;
      const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
      const publicUrl = urlData?.publicUrl;
      // Insert post into posts table
      await supabase.from('posts').insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: 'image',
        caption: caption.trim(),
        category: 'Post',
      });
      setUploading(false);
      window.history.back();
    } catch (e) {
      setUploading(false);
      alert('Failed to post: ' + e);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#18122B', color: '#fff', padding: 0 }}>
      <div style={{ background: '#261531', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, color: '#fff', fontSize: 28, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>New Post</span>
        <span style={{ position: 'absolute', right: 18, color: '#fff', fontWeight: 700, fontSize: 18, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.5 : 1 }} onClick={uploading ? undefined : handlePost}>Post</span>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ margin: '0 0 32px 0' }}>
          {!imageUrl ? (
            <div
              style={{ width: 220, height: 220, background: '#3a294a', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <span style={{ color: '#bdb6d6', fontSize: 64 }}>📷</span>
            </div>
          ) : (
            <img src={imageUrl} alt="preview" style={{ width: 220, height: 220, objectFit: 'cover', borderRadius: 20, cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()} />
          )}
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageChange} />
        </div>
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Write a caption..."
          style={{ width: '100%', maxWidth: 900, minHeight: 56, background: '#32244a', color: '#fff', border: 'none', borderRadius: 18, padding: '18px', fontSize: 18, outline: 'none', marginBottom: 24 }}
        />
        {uploading && <div style={{ color: '#fff', marginTop: 18 }}>Uploading...</div>}
      </div>
    </div>
  );
};

export default AddPost; 