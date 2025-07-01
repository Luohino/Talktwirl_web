import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Settings: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);

  async function fetchSavedPosts() {
    setLoadingSaved(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    const { data, error } = await supabase
      .from('saved_posts')
      .select('post_id, posts(*, profiles(username, profile_photo))')
      .eq('user_id', user.id);
    if (!error && data) {
      setSavedPosts(data.map((s: any) => s.posts));
      setShowSaved(true);
    }
    setLoadingSaved(false);
  }

  async function handleSignOut() {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#261531', padding: 0 }}>
      <div style={{ background: '#261531', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, color: '#fff', fontSize: 28, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 26 }}>Settings</span>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 0 0 0' }}>
        <div style={{ background: '#2d1840', borderRadius: 10, margin: '0 0 18px 0', overflow: 'hidden' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', cursor: 'pointer' }}
            onClick={fetchSavedPosts}
          >
            <span style={{ color: '#fff', fontSize: 22, marginRight: 16 }}>🔖</span>
            <span style={{ color: '#fff', fontSize: 18 }}>Saved Posts</span>
          </div>
        </div>
        <div style={{ background: '#2d1840', borderRadius: 10, margin: '0 0 32px 0', overflow: 'hidden' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', cursor: 'pointer' }}
            onClick={() => window.location.href = '/terms'}
          >
            <span style={{ color: '#fff', fontSize: 22, marginRight: 16 }}>ℹ️</span>
            <span style={{ color: '#fff', fontSize: 18 }}>About</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
          <button
            onClick={handleSignOut}
            style={{ flex: 1, background: 'linear-gradient(90deg,#a259f7,#8F5CFF)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}
          >
            Sign Out
          </button>
          <button
            onClick={handleDeleteAccount}
            style={{ flex: 1, background: '#ff5252', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}
          >
            Delete Account
          </button>
        </div>
      </div>
      {/* Saved Posts Modal */}
      {showSaved && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowSaved(false)}>
          <div style={{ background: '#18122B', borderRadius: 18, width: 420, maxWidth: '90vw', maxHeight: 500, overflowY: 'auto', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Saved Posts</div>
            {loadingSaved ? (
              <div style={{ color: '#fff', textAlign: 'center', margin: '40px 0' }}>Loading...</div>
            ) : savedPosts.length === 0 ? (
              <div style={{ color: '#fff', opacity: 0.7, textAlign: 'center', margin: '40px 0' }}>No saved posts</div>
            ) : (
              savedPosts.map((post, idx) => {
                const isTwirl = post.category === 'Twirl' || post.media_type === 'video';
                return (
                  <div key={idx} style={{ background: '#261531', borderRadius: 10, margin: '0 0 14px 0', padding: 14, display: 'flex', alignItems: 'center' }}>
                    {isTwirl ? (
                      <span style={{ fontSize: 32, color: '#a259f7', marginRight: 14 }}>▶️</span>
                    ) : post.media_url ? (
                      <img src={post.media_url} alt="media" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', marginRight: 14 }} />
                    ) : (
                      <span style={{ fontSize: 32, color: '#fff', marginRight: 14 }}>🖼️</span>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 700 }}>{post.profiles?.username || ''}</div>
                      <div style={{ color: '#fff', opacity: 0.8, fontSize: 15 }}>{post.caption || ''}</div>
                    </div>
                    <div style={{ color: isTwirl ? '#a259f7' : '#fff', fontWeight: 700, marginLeft: 10 }}>{isTwirl ? 'Twirl' : ''}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 