import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

interface Profile {
  username: string;
  name: string;
  profile_photo: string;
  bio?: string;
  website?: string;
  followers: number;
  following: number;
}

interface Post {
  id: string;
  caption: string;
  media_url: string;
  media_type?: string;
  created_at: string;
  category?: string;
}

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [twirls, setTwirls] = useState<Post[]>([]);
  const [tab, setTab] = useState<'posts' | 'twirls'>('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndPosts();
  }, []);

  async function fetchProfileAndPosts() {
    setLoading(true);
    const user = supabase.auth.user();
    if (!user) return;
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    // Fetch posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    // Fetch followers/following
    const { count: followers } = await supabase
      .from('user_relationships')
      .select('user_id', { count: 'exact', head: true })
      .eq('target_id', user.id);
    const { count: following } = await supabase
      .from('user_relationships')
      .select('target_id', { count: 'exact', head: true })
      .eq('user_id', user.id);
    setProfile({
      username: profileData?.username || '',
      name: profileData?.name || '',
      profile_photo: profileData?.profile_photo || '/assets/Oval.png',
      bio: profileData?.bio || '',
      website: profileData?.website || '',
      followers: followers || 0,
      following: following || 0,
    });
    setPosts((postsData || []).filter((p: Post) => p.category === 'Post'));
    setTwirls((postsData || []).filter((p: Post) => p.category === 'Twirl'));
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2B185A 0%, #261531 100%)',
      padding: 0,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 12px 24px 12px' }}>
        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading profile...</div>
        ) : profile && (
          <>
            <div style={{
              background: 'rgba(43,24,90,0.98)',
              borderRadius: 32,
              boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.13)',
              padding: '36px 18px 32px 18px',
              marginBottom: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <img
                  src={profile.profile_photo}
                  alt={profile.username}
                  style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '5px solid #fff', boxShadow: '0 2px 12px #0003' }}
                />
                <button
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    background: '#8F5CFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 20,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #0003',
                  }}
                  title="Edit profile"
                  onClick={() => alert('Edit profile coming soon!')}
                >
                  <span style={{ fontSize: 20 }}>✎</span>
                </button>
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 26, marginBottom: 2 }}>{profile.name}</div>
              <div style={{ color: '#fff', opacity: 0.85, fontSize: 18, marginBottom: 10, fontWeight: 500 }}>@{profile.username}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 48, margin: '18px 0 0 0', width: '100%' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>{posts.length + twirls.length}<div style={{ color: '#fff', opacity: 0.7, fontWeight: 400, fontSize: 14 }}>Posts</div></div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>{profile.followers}<div style={{ color: '#fff', opacity: 0.7, fontWeight: 400, fontSize: 14 }}>Followers</div></div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>{profile.following}<div style={{ color: '#fff', opacity: 0.7, fontWeight: 400, fontSize: 14 }}>Following</div></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 0 0', width: '100%' }}>
                <div style={{
                  background: '#2B185A',
                  borderRadius: 18,
                  display: 'flex',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px #0002',
                }}>
                  <button
                    onClick={() => setTab('posts')}
                    style={{
                      background: tab === 'posts' ? '#5B8BFE' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '18px 0 0 18px',
                      padding: '10px 32px',
                      fontWeight: 700,
                      fontSize: 20,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      outline: 'none',
                    }}
                  >
                    <span role="img" aria-label="Grid">🔲</span>
                  </button>
                  <button
                    onClick={() => setTab('twirls')}
                    style={{
                      background: tab === 'twirls' ? '#5B8BFE' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0 18px 18px 0',
                      padding: '10px 32px',
                      fontWeight: 700,
                      fontSize: 20,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      outline: 'none',
                    }}
                  >
                    <span role="img" aria-label="Play">▶️</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Posts/Twirls Grid */}
            <div style={{
              background: 'rgba(43,24,90,0.85)',
              borderRadius: 24,
              boxShadow: '0 2px 12px #0002',
              padding: '32px 18px',
              marginTop: 0,
              minHeight: 220,
            }}>
              {(tab === 'posts' ? posts : twirls).length === 0 ? (
                <div style={{ color: '#fff', opacity: 0.7, textAlign: 'center', marginTop: 48 }}>
                  {tab === 'posts' ? 'No posts yet.' : 'No twirls yet.'}
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 18,
                    marginTop: 8,
                  }}
                >
                  {(tab === 'posts' ? posts : twirls).map(post => (
                    <div key={post.id} style={{ background: '#18122B', borderRadius: 12, overflow: 'hidden', minHeight: 180, cursor: 'pointer', boxShadow: '0 2px 8px #0002' }}>
                      {post.media_url ? (
                        <img
                          src={post.media_url}
                          alt={post.caption}
                          style={{ width: '100%', height: 180, objectFit: 'cover', background: '#222' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: 180, background: '#222' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen; 