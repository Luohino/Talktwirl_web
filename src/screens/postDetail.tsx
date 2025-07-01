import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Avatar from '../core/Avatar';

interface Post {
  id: string;
  user_id: string;
  username: string;
  name: string;
  profile_photo: string;
  media_url: string;
  caption: string;
  likes: number;
  created_at: string;
}

const PostDetail: React.FC<{ postIds: string[]; initialIndex?: number }> = ({ postIds, initialIndex = 0 }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [postIds]);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('id,user_id,media_url,caption,likes,created_at,profiles(username,name,profile_photo)')
      .in('id', postIds);
    if (!error && data) {
      setPosts(
        data.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          username: p.profiles?.username || 'Unknown',
          name: p.profiles?.name || '',
          profile_photo: p.profiles?.profile_photo || '',
          media_url: p.media_url,
          caption: p.caption,
          likes: p.likes || 0,
          created_at: p.created_at,
        }))
      );
    }
    setLoading(false);
  }

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</div>;
  }

  if (posts.length === 0) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>No posts to display.</div>;
  }

  const post = posts[initialIndex];

  return (
    <div style={{ minHeight: '100vh', background: '#2B183A', color: '#fff', padding: 0 }}>
      <div style={{ background: '#2B183A', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, color: '#fff', fontSize: 28, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>Posts</span>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 0 0 0' }}>
        <div style={{ background: '#18122B', borderRadius: 20, boxShadow: '0 2px 8px #0002', padding: 0, margin: '0 0 32px 0' }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '24px 24px 0 24px' }}>
            <Avatar profilePhoto={post.profile_photo} name={post.name} username={post.username} radius={28} />
            <div style={{ marginLeft: 14 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>@{post.username}</div>
              <div style={{ color: '#fff', opacity: 0.8, fontSize: 15 }}>{post.name}</div>
            </div>
          </div>
          {/* Images Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, margin: '32px 0 0 0', background: '#18122B', borderRadius: 20 }}>
            {posts.map((p, i) => (
              <div key={p.id} style={{ aspectRatio: '1/1', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1430', borderRadius: i === 0 ? '20px 0 0 0' : i === 2 ? '0 20px 0 0' : '0' }}>
                <img src={p.media_url} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 320, maxWidth: 320 }} />
              </div>
            ))}
          </div>
          {/* Caption, Likes, etc. */}
          <div style={{ padding: '24px' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{post.caption}</div>
            <div style={{ color: '#fff', opacity: 0.7, fontSize: 15, marginBottom: 8 }}>{post.likes} likes</div>
            <div style={{ color: '#fff', opacity: 0.5, fontSize: 13 }}>{new Date(post.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 