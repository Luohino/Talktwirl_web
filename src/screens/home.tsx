import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import BottomNavBar from '../core/BottomNavBar';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../core/TopNavBar';

interface Post {
  id: string;
  caption: string;
  media_url: string;
  likes: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    name: string;
    profile_photo: string;
  };
  isLiked?: boolean;
  isSaved?: boolean;
}

function getPublicUrl(storagePath: string | null | undefined): string | undefined {
  if (!storagePath) return undefined;
  // If already a full URL, return as is
  if (storagePath.startsWith('http')) return storagePath;
  // Otherwise, treat as Supabase Storage path: 'bucket/path/to/file'
  const [bucket, ...pathParts] = storagePath.split('/');
  const path = pathParts.join('/');
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liking, setLiking] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, name, profile_photo)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (e: any) {
      setError('Failed to load posts.');
    }
    setLoading(false);
  }

  async function handleLike(postId: string) {
    setLiking(postId);
    setPosts(posts => posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.likes + (p.isLiked ? -1 : 1) } : p));
    try {
      // Like/unlike logic here (call Supabase)
      // ...
    } finally {
      setLiking(null);
    }
  }

  async function handleSave(postId: string) {
    setSaving(postId);
    setPosts(posts => posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
    try {
      // Save/unsave logic here (call Supabase)
      // ...
    } finally {
      setSaving(null);
    }
  }

  function formatDate(date: string) {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const handleTabChange = (tab: 'home' | 'add' | 'profile') => {
    if (tab === 'home') navigate('/home');
    else if (tab === 'add') navigate('/add');
    else if (tab === 'profile') navigate('/profile');
  };

  return (
    <>
      <TopNavBar />
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #150121 0%, #261531 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 0,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1100,
          padding: '32px 12px 24px 12px',
        }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: 1.1,
            background: 'linear-gradient(90deg, cyan, #6A00FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 24px 0',
          }}>TalkTwirl</h1>
          {error && <div style={{ color: '#ff4d6d', marginBottom: 18 }}>{error}</div>}
          {loading ? (
            <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading posts...</div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: 28,
              }}
            >
              {posts.map(post => (
                <div
                  key={post.id}
                  style={{
                    background: 'rgba(30,0,50,0.97)',
                    borderRadius: 20,
                    boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    minHeight: 340,
                  }}
                >
                  {/* User Info */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '18px 18px 0 18px' }}>
                    <img
                      src={getPublicUrl(post.profiles?.profile_photo) || '/assets/Oval.png'}
                      alt={post.profiles?.username}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginRight: 12, background: '#222' }}
                    />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>@{post.profiles?.username}</div>
                      <div style={{ color: '#fff', opacity: 0.7, fontSize: 14 }}>{post.profiles?.name}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: '#fff', opacity: 0.5, fontSize: 13 }}>{formatDate(post.created_at)}</div>
                  </div>
                  {/* Media */}
                  {post.media_url && (
                    <div style={{ width: '100%', background: '#18122B', margin: '18px 0 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
                      <img
                        src={getPublicUrl(post.media_url)}
                        alt={post.caption}
                        style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 12, objectFit: 'contain', background: '#222' }}
                      />
                    </div>
                  )}
                  {/* Caption */}
                  <div style={{ color: '#fff', fontSize: 15, padding: '16px 18px 0 18px', minHeight: 40 }}>{post.caption}</div>
                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px 18px 18px 18px', gap: 18 }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      disabled={liking === post.id}
                      style={{ background: 'none', border: 'none', color: post.isLiked ? '#ff4d6d' : '#fff', fontSize: 22, cursor: 'pointer' }}
                      aria-label="Like"
                    >
                      {post.isLiked ? '❤️' : '🤍'} {post.likes}
                    </button>
                    <button
                      onClick={() => alert('Comments coming soon!')}
                      style={{ background: 'none', border: 'none', color: '#00eaff', fontSize: 22, cursor: 'pointer' }}
                      aria-label="Comment"
                    >
                      💬
                    </button>
                    <button
                      onClick={() => handleSave(post.id)}
                      disabled={saving === post.id}
                      style={{ background: 'none', border: 'none', color: post.isSaved ? '#a259f7' : '#fff', fontSize: 22, cursor: 'pointer' }}
                      aria-label="Save"
                    >
                      {post.isSaved ? '🔖' : '📑'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNavBar activeTab="home" onTabChange={handleTabChange} />
    </>
  );
};

export default Home; 