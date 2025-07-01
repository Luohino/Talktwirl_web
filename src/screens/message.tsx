import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Avatar from '../core/Avatar';
import PersonalMessage from './personalmessage';

interface Profile {
  id: string;
  username: string;
  name: string;
  profile_photo: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

interface Conversation {
  user: Profile;
  lastMessage: Message;
}

const MessageScreen: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState<null | { user: Profile }>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data?.user || null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchConversations();
    // eslint-disable-next-line
  }, [currentUser]);

  async function fetchConversations() {
    setLoading(true);
    if (!currentUser) return;
    // Fetch all messages where current user is sender or receiver
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !messages) {
      setLoading(false);
      return;
    }
    // Group by conversation partner, pick latest message
    const map = new Map<string, Message>();
    messages.forEach((msg: Message) => {
      const otherId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
      if (!map.has(otherId)) map.set(otherId, msg);
    });
    const userIds = Array.from(map.keys());
    // Fetch all user profiles in one go
    let profiles: Profile[] = [];
    if (userIds.length > 0) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id,username,name,profile_photo')
        .in('id', userIds);
      profiles = profs || [];
    }
    // Merge
    const convs: Conversation[] = userIds.map(uid => {
      const user = profiles.find(p => p.id === uid) || { id: uid, username: 'Unknown', name: 'Unknown', profile_photo: '' };
      return { user, lastMessage: map.get(uid)! };
    });
    setConversations(convs);
    setLoading(false);
  }

  function formatTime(date: string) {
    const d = new Date(date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  if (openChat) {
    return (
      <PersonalMessage
        otherUserId={openChat.user.id}
        username={openChat.user.username}
        name={openChat.user.name}
        avatar={openChat.user.profile_photo}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#261531', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#261531', display: 'flex', alignItems: 'center', height: 64, padding: '0 0 0 0' }}>
        <span style={{ fontSize: 28, color: '#fff', marginLeft: 18, marginRight: 10, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
        <img src={require('../assets/talktwirl_logo.png')} alt="logo" style={{ height: 36, marginRight: 10 }} />
        <span style={{ fontWeight: 700, fontSize: 28, background: 'linear-gradient(90deg,#8F5CFF,#5B8BFE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 }}>Talktwirl</span>
        <div style={{ flex: 1 }} />
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28, marginRight: 18, cursor: 'pointer' }}>+</button>
      </div>
      {/* Search */}
      <div style={{ padding: '18px 0 0 0', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            width: '100%',
            background: '#3a294a',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '14px 22px',
            fontSize: 18,
            marginBottom: 8,
            outline: 'none',
          }}
        />
      </div>
      {/* Conversation List */}
      <div style={{ flex: 1, marginTop: 8 }}>
        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</div>
        ) : conversations.length === 0 ? (
          <div style={{ color: '#fff', opacity: 0.7, textAlign: 'center', marginTop: 40 }}>No messages yet.</div>
        ) : (
          conversations
            .filter(c => c.user.username.toLowerCase().includes(search.toLowerCase()) || c.user.name.toLowerCase().includes(search.toLowerCase()))
            .map((conv, i) => (
              <div
                key={conv.user.id}
                style={{ display: 'flex', alignItems: 'center', padding: '0 24px', cursor: 'pointer', minHeight: 64 }}
                onClick={() => setOpenChat({ user: conv.user })}
              >
                <Avatar profilePhoto={conv.user.profile_photo} name={conv.user.name} username={conv.user.username} radius={26} />
                <div style={{ marginLeft: 16, flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>{conv.user.username}</div>
                  <div style={{ color: '#fff', opacity: 0.8, fontSize: 15, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 320 }}>{conv.lastMessage.message}</div>
                </div>
                <div style={{ color: '#aaa', fontSize: 14, marginLeft: 12, minWidth: 70, textAlign: 'right' }}>{formatTime(conv.lastMessage.created_at)}</div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MessageScreen; 