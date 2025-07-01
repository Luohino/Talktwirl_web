import React, { useRef, useState } from 'react';
import { supabase } from '../services/supabase';

const Post: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setVideoUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function handlePost() {
    if (!videoFile || !caption.trim()) return;
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
      // Upload video to Supabase Storage
      const ext = videoFile.name.split('.').pop();
      const fileName = `twirls/${user.id}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('twirls').upload(fileName, videoFile, { upsert: true });
      if (uploadError) throw uploadError.message;
      const { data: urlData } = supabase.storage.from('twirls').getPublicUrl(fileName);
      const publicUrl = urlData?.publicUrl;
      // Insert post into posts table
      await supabase.from('posts').insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: 'video',
        caption: caption.trim(),
        category: 'Twirl',
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
          {!videoUrl ? (
            <div
              style={{ width: 220, height: 350, background: '#3a294a', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <span style={{ color: '#bdb6d6', fontSize: 64 }}>▶️</span>
            </div>
          ) : (
            <video src={videoUrl} style={{ width: 220, height: 350, objectFit: 'cover', borderRadius: 20, cursor: 'pointer' }} controls />
          )}
          <input type="file" accept="video/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleVideoChange} />
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

export default Post; 