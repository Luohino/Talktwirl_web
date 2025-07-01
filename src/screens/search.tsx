import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Avatar from '../core/Avatar';

interface User {
  id: string;
  username: string;
  name: string;
  profile_photo: string;
}

const Search: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const user = supabase.auth.user();
    setCurrentUserId(user?.id || null);
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      setUsers([]);
      setFiltered([]);
      setLoading(false);
      return;
    }
    const userList = (data || []).map((u: any) => ({
      id: u.id,
      username: u.username || '',
      name: u.name || '',
      profile_photo: u.profile_photo || '',
    }));
    setUsers(userList);
    setFiltered(userList.filter((u: User) => u.id !== user?.id));
    setLoading(false);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setFiltered(users.filter((u) => u.id !== currentUserId));
      return;
    }
    const q = val.trim().toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.id !== currentUserId &&
          (u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q))
      )
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #261531 0%, #2B185A 100%)', padding: 0 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 0 80px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '32px 0 0 0' }}>
          <span style={{ fontSize: 28, color: '#fff', marginLeft: 18, marginRight: 10, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
          <img src="/assets/icon.png" alt="TalkTwirl" style={{ height: 32, marginRight: 10 }} />
          <span style={{
            fontSize: 28,
            fontWeight: 800,
            background: 'linear-gradient(90deg, #8F5CFF, #5B8BFE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1.1,
          }}>TalkTwirl</span>
        </div>
        {/* Search Bar */}
        <div style={{ margin: '28px 0 0 0', padding: '0 18px' }}>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '16px 18px',
              borderRadius: 16,
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: 17,
              marginBottom: 0,
              outline: 'none',
              boxShadow: '0 1px 2px #0001',
            }}
          />
        </div>
        {/* Suggested Users */}
        <div style={{ margin: '32px 0 0 0', padding: '0 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>Suggested Users</span>
            <span style={{ color: '#a259f7', fontSize: 15, cursor: 'pointer' }}>See All</span>
          </div>
          <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 8 }}>
            {filtered.slice(0, 8).map((user) => (
              <div key={user.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                <Avatar profilePhoto={user.profile_photo} name={user.name} username={user.username} radius={28} />
                <span style={{ color: '#fff', fontSize: 13, marginTop: 4, maxWidth: 60, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</span>
              </div>
            ))}
          </div>
        </div>
        {/* User Results List */}
        <div style={{ margin: '18px 0 0 0', padding: '0 18px' }}>
          {loading ? (
            <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading users...</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: '#fff', opacity: 0.7, textAlign: 'center', marginTop: 40 }}>No users found.</div>
          ) : (
            filtered.map((user) => (
              <div key={user.id} style={{
                background: 'rgba(24, 18, 43, 0.98)',
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                padding: '16px 18px',
                marginBottom: 14,
                boxShadow: '0 2px 8px #0002',
              }}>
                <Avatar profilePhoto={user.profile_photo} name={user.name} username={user.username} radius={22} fontSize={22} />
                <div style={{ marginLeft: 16 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>{user.username}</div>
                  <div style={{ color: '#fff', opacity: 0.7, fontSize: 14 }}>{user.name || 'TalkTwirl User'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Bottom nav bar placeholder */}
      {/* <BottomNavBar activeTab="none" /> */}
    </div>
  );
};

export default Search; 