import { supabase } from '../services/supabase';

export async function likePost(postId: string, userId: string) {
  await supabase.from('likes').insert({ post_id: postId, user_id: userId });
}

export async function unlikePost(postId: string, userId: string) {
  await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId);
}

export async function savePost(postId: string, userId: string) {
  await supabase.from('saved_posts').insert({ post_id: postId, user_id: userId });
}

export async function unsavePost(postId: string, userId: string) {
  await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', userId);
}

export async function sendNotification({ type, toUserId, fromUserId, targetType, targetId, targetCaption, commentText }: {
  type: string;
  toUserId: string;
  fromUserId: string;
  targetType: string;
  targetId: string;
  targetCaption?: string;
  commentText?: string;
}) {
  await supabase.from('notifications').insert({
    type,
    to_user_id: toUserId,
    from_user_id: fromUserId,
    target_type: targetType,
    target_id: targetId,
    target_caption: targetCaption,
    comment_text: commentText,
    seen: false,
  });
} 