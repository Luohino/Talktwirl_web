import { supabase } from '../services/supabase';

export async function fetchMessages(userId: string) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });
  return data;
}

export async function markMessagesAsRead(userId: string) {
  await supabase.from('messages').update({ is_read: true }).eq('receiver_id', userId).eq('is_read', false);
} 