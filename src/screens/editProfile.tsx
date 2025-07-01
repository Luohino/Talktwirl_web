import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabase';

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [fields, setFields] = useState({
    name: '',
    username: '',
    website: '',
    bio: '',
    email: '',
    phone: '',
    gender: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      setProfile(data);
      setFields({
        name: data.name || '',
        username: data.username || '',
        website: data.website || '',
        bio: data.bio || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || '',
      });
      setPhotoUrl(data.profile_photo || null);
    }
    setLoading(false);
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function uploadProfilePhoto(file: File, userId: string) {
    const ext = file.name.split('.').pop();
    const fileName = `profile_photos/${userId}_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('profile-photos').upload(fileName, file, { upsert: true });
    if (error) return null;
    const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  }

  async function handleSave() {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    let uploadedPhotoUrl = photoUrl;
    if (photoFile) {
      uploadedPhotoUrl = await uploadProfilePhoto(photoFile, user.id);
    }
    // Check username uniqueness if changed
    if (fields.username && fields.username !== profile.username) {
      const { data: uname } = await supabase
        .from('usernames')
        .select('user_id')
        .eq('username', fields.username.toLowerCase())
        .maybeSingle();
      if (uname && uname.user_id !== user.id) {
        alert('This username is already taken. Please choose another one.');
        setSaving(false);
        return;
      }
      // Update usernames table
      await supabase.from('usernames').insert({ username: fields.username.toLowerCase(), user_id: user.id });
      if (profile.username) {
        await supabase.from('usernames').delete().eq('username', profile.username.toLowerCase());
      }
    }
    // Update profile
    const updatedProfile = {
      id: user.id,
      ...fields,
      profile_photo: uploadedPhotoUrl,
    };
    await supabase.from('profiles').upsert(updatedProfile);
    setSaving(false);
    window.history.back();
  }

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#261531', color: '#fff', padding: 0 }}>
      <div style={{ background: '#261531', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, color: '#fff', fontSize: 18, cursor: 'pointer' }} onClick={() => window.history.back()}>Cancel</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 26 }}>Edit Profile</span>
        <span style={{ position: 'absolute', right: 18, color: '#5B8BFE', fontSize: 18, cursor: 'pointer' }} onClick={handleSave}>{saving ? 'Saving...' : 'Done'}</span>
      </div>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ margin: '24px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#5B4EBF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#fff', marginBottom: 8, overflow: 'hidden' }}>
            {photoUrl ? <img src={photoUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
          </div>
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handlePhotoChange} />
          <span style={{ color: '#5B8BFE', fontWeight: 700, cursor: 'pointer', marginTop: 8 }} onClick={() => fileInputRef.current?.click()}>Change Profile Photo</span>
        </div>
        <form style={{ width: '100%', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <ProfileField label="Name" name="name" value={fields.name} onChange={handleFieldChange} />
          <ProfileField label="Username" name="username" value={fields.username} onChange={handleFieldChange} />
          <ProfileField label="Website" name="website" value={fields.website} onChange={handleFieldChange} />
          <ProfileField label="Bio" name="bio" value={fields.bio} onChange={handleFieldChange} textarea />
          <div style={{ color: '#fff', fontWeight: 700, margin: '24px 0 0 0', fontSize: 16, alignSelf: 'flex-start' }}>Private Information</div>
          <ProfileField label="Email" name="email" value={fields.email} onChange={handleFieldChange} />
          <ProfileField label="Phone" name="phone" value={fields.phone} onChange={handleFieldChange} />
          <ProfileField label="Gender" name="gender" value={fields.gender} onChange={handleFieldChange} />
        </form>
      </div>
    </div>
  );
};

const ProfileField: React.FC<{ label: string; name: string; value: string; onChange: any; textarea?: boolean }> = ({ label, name, value, onChange, textarea }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <div style={{ width: 110, color: '#fff', fontWeight: 500 }}>{label}</div>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        style={{ flex: 1, background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1.5px solid #5B8BFE', borderRadius: 8, padding: '10px 12px', fontSize: 16, minHeight: 60 }}
      />
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={{ flex: 1, background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1.5px solid #5B8BFE', borderRadius: 8, padding: '10px 12px', fontSize: 16 }}
      />
    )}
  </div>
);

export default EditProfile; 