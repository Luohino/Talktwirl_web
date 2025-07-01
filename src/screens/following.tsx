import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Avatar from '../core/Avatar';

interface FollowingUser {
  uid: string;
  username: string;
  name: string;
  profilePhoto: string;
}

const Following: React.FC<{ userId: string }> = ({ userId }) => {
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
    // eslint-disable-next-line
  }, [userId]);

  async function fetchFollowing() {
    setLoading(true);
    // Get following target_ids
    const { data: rels } = await supabase
      .from('user_relationships')
      .select('target_id')
      .eq('user_id', userId);
    const followingIds = rels ? rels.map((r: any) => r.target_id) : [];
    if (followingIds.length === 0) {
      setFollowing([]);
      setLoading(false);
      return;
    }
    // Get profiles
    const { data: users } = await supabase
      .from('profiles')
      .select('id,username,name,profile_photo')
      .in('id', followingIds);
    setFollowing(
      users.map((u: any) => ({
        uid: u.id,
        username: u.username || '',
        name: u.name || '',
        profilePhoto: u.profile_photo || '',
      }))
    );
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#261531', color: '#fff', padding: 0 }}>
      <div style={{ background: '#261531', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, color: '#fff', fontSize: 28, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 26 }}>Following</span>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 0 0 0' }}>
        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</div>
        ) : following.length === 0 ? (
          <div style={{ color: '#fff', opacity: 0.7, textAlign: 'center', marginTop: 40 }}>No following yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {following.map((user, i) => (
              <div key={user.uid} style={{ background: '#3D2565', borderRadius: 16, display: 'flex', alignItems: 'center', padding: '12px 18px', boxShadow: '0 2px 8px #0002' }}>
                <Avatar profilePhoto={user.profilePhoto} name={user.name} username={user.username} radius={24} />
                <div style={{ marginLeft: 18 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>{user.name || 'TalkTwirl User'}</div>
                  <div style={{ color: '#fff', opacity: 0.8, fontSize: 15 }}>@{user.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Bottom nav placeholder */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(40,20,60,0.95)', borderRadius: 32, margin: 16, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64 }}>
        <span style={{ color: '#fff', fontSize: 32, margin: '0 32px' }}>🏠</span>
        <span style={{ color: '#fff', fontSize: 32, margin: '0 32px' }}>＋</span>
        <span style={{ color: '#fff', fontSize: 32, margin: '0 32px' }}>👤</span>
      </div>
    </div>
  );
};

export default Following; 