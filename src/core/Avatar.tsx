import React from 'react';

interface AvatarProps {
  profilePhoto?: string;
  name?: string;
  username?: string;
  radius?: number;
  fontSize?: number;
}

const Avatar: React.FC<AvatarProps> = ({ profilePhoto, name = '', username = '', radius = 24, fontSize = 18 }) => {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : username ? username[0].toUpperCase() : '?';
  return (
    <div
      style={{
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        background: '#2a1840',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontWeight: 700,
        fontSize,
        color: '#fff',
        boxShadow: '0 1px 4px #0002',
      }}
    >
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt={name || username}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar; 