import { supabase } from '../services/supabase';

export async function sendDM({ senderId, receiverId, message }: { senderId: string; receiverId: string; message: string }) {
  await supabase.from('messages').insert({ sender_id: senderId, receiver_id: receiverId, message });
}

export async function fetchDMs(userId: string, otherUserId: string) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
    .order('created_at', { ascending: true });
  return data;
} 