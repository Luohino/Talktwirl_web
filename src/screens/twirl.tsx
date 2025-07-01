import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Avatar from '../core/Avatar';

interface TwirlPost {
  id: string;
  user_id: string;
  username: string;
  profile_photo: string;
  media_url: string;
  caption: string;
  likes: number;
  isLiked: boolean;
}

const Twirl: React.FC = () => {
  const [twirls, setTwirls] = useState<TwirlPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data?.user || null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchTwirls();
    // eslint-disable-next-line
  }, [currentUser]);

  async function fetchTwirls() {
    setLoading(true);
    // Fetch all twirl posts (category Twirl, media_type video or image)
    const { data, error } = await supabase
      .from('posts')
      .select('id,user_id,media_url,caption,likes,profiles(username,profile_photo)')
      .eq('category', 'Twirl');
    if (!error && data) {
      // Fetch likes for current user
      let likedIds: string[] = [];
      if (currentUser) {
        const { data: likes } = await supabase
          .from('twirl_likes')
          .select('twirl_id')
          .eq('user_id', currentUser.id);
        likedIds = likes ? likes.map((l: any) => l.twirl_id) : [];
      }
      setTwirls(
        data.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          username: p.profiles?.username || 'Unknown',
          profile_photo: p.profiles?.profile_photo || '',
          media_url: p.media_url,
          caption: p.caption,
          likes: p.likes || 0,
          isLiked: likedIds.includes(p.id),
        }))
      );
    }
    setLoading(false);
  }

  async function toggleLike(idx: number) {
    if (!currentUser) return;
    const post = twirls[idx];
    if (post.isLiked) {
      await supabase.from('twirl_likes').delete().eq('twirl_id', post.id).eq('user_id', currentUser.id);
      setTwirls(twirls => twirls.map((t, i) => i === idx ? { ...t, isLiked: false, likes: t.likes - 1 } : t));
    } else {
      await supabase.from('twirl_likes').insert({ twirl_id: post.id, user_id: currentUser.id });
      setTwirls(twirls => twirls.map((t, i) => i === idx ? { ...t, isLiked: true, likes: t.likes + 1 } : t));
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {loading ? (
        <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</div>
      ) : twirls.length === 0 ? (
        <div style={{ color: '#fff', opacity: 0.7, textAlign: 'center', marginTop: 40 }}>No Twirls yet!</div>
      ) : (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Only show one twirl at a time, center media */}
          {twirls.map((post, idx) => idx === 0 && (
            <div key={post.id} style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {/* User info */}
              <div style={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center' }}>
                <Avatar profilePhoto={post.profile_photo} name={post.username} username={post.username} radius={28} />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 12 }}>{post.username}</span>
              </div>
              {/* Media */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                {post.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={post.media_url} style={{ maxWidth: 400, maxHeight: 400, borderRadius: 8 }} controls autoPlay loop muted />
                ) : (
                  <img src={post.media_url} alt="twirl" style={{ maxWidth: 400, maxHeight: 400, borderRadius: 8 }} />
                )}
              </div>
              {/* Caption overlay */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 700, fontSize: 22, textAlign: 'center', textShadow: '0 2px 8px #000' }}>{post.caption}</div>
              {/* Action bar */}
              <div style={{ position: 'absolute', right: 32, top: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleLike(idx)}>
                  <span style={{ fontSize: 32, color: post.isLiked ? '#ff69b4' : '#fff' }}>{post.isLiked ? '♥' : '♡'}</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{post.likes}</span>
                </div>
                <div style={{ fontSize: 32, color: '#00ff99', cursor: 'pointer' }}>💬</div>
                <div style={{ fontSize: 32, color: '#3faaff', cursor: 'pointer' }}>🔗</div>
                <div style={{ fontSize: 32, color: '#fff', cursor: 'pointer' }}>🔖</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Bottom nav placeholder */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(40,20,60,0.95)', borderRadius: 32, margin: 16, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64 }}>
        <span style={{ color: '#ff69b4', fontSize: 32, margin: '0 32px' }}>♥</span>
        <span style={{ color: '#fff', fontSize: 32, margin: '0 32px' }}>🏠</span>
        <span style={{ color: '#fff', fontSize: 32, margin: '0 32px' }}>＋</span>
        <span style={{ color: '#fff', fontSize: 32, margin: '0 32px' }}><Avatar profilePhoto={currentUser?.user_metadata?.profile_photo || ''} name={currentUser?.user_metadata?.username || ''} username={currentUser?.user_metadata?.username || ''} radius={20} /></span>
      </div>
    </div>
  );
};

export default Twirl; 