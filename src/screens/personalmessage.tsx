import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabase';
import Avatar from '../core/Avatar';

interface PersonalMessageProps {
  otherUserId: string;
  username: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

const PersonalMessage: React.FC<PersonalMessageProps> = ({ otherUserId, username, name, avatar }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const currentUser = supabase.auth.user();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    // Optionally, subscribe to real-time updates here
    // eslint-disable-next-line
  }, [otherUserId]);

  async function fetchMessages() {
    setLoading(true);
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order('created_at', { ascending: true });
    if (!error && data) {
      setMessages(data.filter((m: Message) =>
        (m.sender_id === currentUser.id && m.receiver_id === otherUserId) ||
        (m.sender_id === otherUserId && m.receiver_id === currentUser.id)
      ));
    }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
  }

  async function sendMessage() {
    if (!input.trim() || !currentUser) return;
    setSending(true);
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: otherUserId,
      message: input.trim(),
      is_read: false,
    });
    setInput('');
    setSending(false);
    fetchMessages();
  }

  // Optionally, fetch online status from a profile field
  useEffect(() => {
    let isMounted = true;
    async function fetchOnline() {
      const { data } = await supabase.from('profiles').select('is_online').eq('id', otherUserId).maybeSingle();
      if (isMounted) setOtherUserOnline(data?.is_online === true);
    }
    fetchOnline();
    return () => { isMounted = false; };
  }, [otherUserId]);

  function formatDate(date: string) {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #261531 0%, #2B185A 100%)', padding: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#18122B', padding: '0 0 0 0', display: 'flex', alignItems: 'center', height: 64, position: 'relative' }}>
        <span style={{ fontSize: 28, color: '#fff', marginLeft: 18, marginRight: 10, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
        <Avatar profilePhoto={avatar} name={name} username={username} radius={22} />
        <div style={{ marginLeft: 12 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{name}</div>
          <div style={{ color: '#fff', opacity: 0.7, fontSize: 14 }}>@{username} <span style={{ color: otherUserOnline ? 'lime' : 'red', fontSize: 12, marginLeft: 8 }}>{otherUserOnline ? 'Online' : 'Offline'}</span></div>
        </div>
      </div>
      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 0 0 0', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ color: '#fff', opacity: 0.7, textAlign: 'center', marginTop: 40 }}>No messages yet.</div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                margin: '0 18px 12px 18px',
              }}>
                <div style={{
                  background: isMe ? '#a259f7' : '#fff',
                  color: isMe ? '#fff' : '#222',
                  borderRadius: 14,
                  padding: '10px 16px',
                  maxWidth: '60%',
                  fontSize: 16,
                  boxShadow: isMe ? '0 2px 8px #a259f733' : '0 2px 8px #0001',
                  position: 'relative',
                  wordBreak: 'break-word',
                }}>
                  {msg.message}
                  <span style={{ fontSize: 16, marginLeft: 6, color: isMe ? '#fff' : '#a259f7', verticalAlign: 'middle' }}>↵</span>
                  <div style={{ fontSize: 12, color: isMe ? '#e0e0ff' : '#888', marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>{formatDate(msg.created_at)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Input */}
      <div style={{ padding: '0 0 24px 0', background: 'transparent' }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
          style={{ display: 'flex', alignItems: 'center', maxWidth: 900, margin: '0 auto', padding: '0 18px' }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: '16px 18px',
              borderRadius: 16,
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: 17,
              outline: 'none',
              boxShadow: '0 1px 2px #0001',
              marginRight: 8,
            }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 28,
              cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
              padding: '0 8px',
            }}
            aria-label="Send"
          >
            ▶
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalMessage; 