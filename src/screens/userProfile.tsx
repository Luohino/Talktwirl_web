import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Avatar from '../core/Avatar';

interface UserProfileProps {
  userId: string;
}

interface Profile {
  id: string;
  username: string;
  name: string;
  profile_photo: string;
  bio?: string;
}

interface Post {
  id: string;
  caption: string;
  media_url: string;
  media_type?: string;
  created_at: string;
  category?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [twirls, setTwirls] = useState<Post[]>([]);
  const [tab, setTab] = useState<'posts' | 'twirls'>('posts');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [bio, setBio] = useState('');
  const currentUser = supabase.auth.user();

  useEffect(() => {
    fetchProfileAndPosts();
    // eslint-disable-next-line
  }, [userId]);

  async function fetchProfileAndPosts() {
    setLoading(true);
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(profileData);
    setBio(profileData?.bio || '');
    // Fetch posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setPosts((postsData || []).filter((p: Post) => p.category === 'Post'));
    setTwirls((postsData || []).filter((p: Post) => p.category === 'Twirl'));
    // Fetch followers/following
    const { count: followersCount } = await supabase
      .from('user_relationships')
      .select('user_id', { count: 'exact', head: true })
      .eq('target_id', userId);
    setFollowers(followersCount || 0);
    const { count: followingCount } = await supabase
      .from('user_relationships')
      .select('target_id', { count: 'exact', head: true })
      .eq('user_id', userId);
    setFollowing(followingCount || 0);
    // Check if current user is following
    if (currentUser && currentUser.id !== userId) {
      const { data: rel } = await supabase
        .from('user_relationships')
        .select('user_id')
        .eq('user_id', currentUser.id)
        .eq('target_id', userId)
        .maybeSingle();
      setIsFollowing(!!rel);
    }
    setLoading(false);
  }

  async function handleFollow() {
    if (!currentUser || currentUser.id === userId) return;
    setFollowLoading(true);
    try {
      await supabase.from('user_relationships').insert({ user_id: currentUser.id, target_id: userId });
      setIsFollowing(true);
      setFollowers(f => f + 1);
    } finally {
      setFollowLoading(false);
    }
  }

  async function handleUnfollow() {
    if (!currentUser || currentUser.id === userId) return;
    setFollowLoading(true);
    try {
      await supabase.from('user_relationships').delete().eq('user_id', currentUser.id).eq('target_id', userId);
      setIsFollowing(false);
      setFollowers(f => Math.max(0, f - 1));
    } finally {
      setFollowLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2B185A 0%, #261531 100%)', padding: 0 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 0 80px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '32px 0 0 0', justifyContent: 'center' }}>
          <span style={{ fontSize: 28, color: '#fff', marginLeft: 18, marginRight: 10, cursor: 'pointer', position: 'absolute', left: 0 }} onClick={() => window.history.back()}>&larr;</span>
          <span style={{ fontSize: 24, color: '#fff', fontWeight: 700 }}>{profile?.username || ''}</span>
        </div>
        {/* Profile Card */}
        <div style={{
          background: 'rgba(43,24,90,0.98)',
          borderRadius: 32,
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.13)',
          padding: '36px 18px 32px 18px',
          margin: '32px 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          <Avatar profilePhoto={profile?.profile_photo} name={profile?.name} username={profile?.username} radius={56} fontSize={32} />
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 26, marginTop: 18 }}>{profile?.name || 'TalkTwirl User'}</div>
          <div style={{ color: '#fff', opacity: 0.85, fontSize: 18, marginBottom: 10, fontWeight: 500 }}>@{profile?.username}</div>
          <div style={{ color: '#fff', opacity: 0.8, fontSize: 15, marginBottom: 4, textAlign: 'center' }}>{bio || 'No bio yet...'}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, margin: '18px 0 0 0', width: '100%' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>{posts.length + twirls.length}<div style={{ color: '#fff', opacity: 0.7, fontWeight: 400, fontSize: 14 }}>Posts</div></div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>{followers}<div style={{ color: '#fff', opacity: 0.7, fontWeight: 400, fontSize: 14 }}>Followers</div></div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>{following}<div style={{ color: '#fff', opacity: 0.7, fontWeight: 400, fontSize: 14 }}>Following</div></div>
          </div>
          {/* Follow/Unfollow and Message */}
          {currentUser && currentUser.id !== userId && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 0 0', gap: 12 }}>
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                disabled={followLoading}
                style={{
                  width: 180,
                  height: 48,
                  background: isFollowing ? '#aaa' : '#8F5CFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: followLoading ? 'not-allowed' : 'pointer',
                  marginRight: 0,
                  transition: 'background 0.2s',
                }}
              >
                {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <button
                style={{
                  width: 48,
                  height: 48,
                  background: '#3D2565',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 22,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Message"
                onClick={() => alert('Messaging coming soon!')}
              >
                <span role="img" aria-label="Message">💬</span>
              </button>
            </div>
          )}
          {/* Tab Switcher */}
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
          {loading ? (
            <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</div>
          ) : (tab === 'posts' ? posts : twirls).length === 0 ? (
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
      </div>
    </div>
  );
};

export default UserProfile; 