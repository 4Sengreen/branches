import { useRef, useState, useEffect } from 'react';
import { supabase } from '../../supabase-client.js';

export default function AvatarUploader({ userId, currentAvatar, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e) => {
    try {
      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('SESSION:', sessionData.session);

      const file = e.target.files[0];
      if (!file) return;
      const filePath = `${user?.id}/avatar.png`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('userauth_id', user?.id);

      if (updateError) throw updateError;
      setPreview(publicUrl);
      onUpload?.(publicUrl);
    } catch (err) {
      console.error('Upload error:', err.message);
    } finally {
      setUploading(false);
    }
  };
  useEffect(() => {
    setPreview(currentAvatar);
  }, [currentAvatar]);

  if (!userId) return null;

  return (
    <div
      onClick={handleClick}
      className='w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer'
    >
      <input type='file' accept='image/*' ref={fileInputRef} onChange={handleUpload} className='hidden' />

      {uploading ? (
        <span className='text-sm text-gray-500'>Uploading…</span>
      ) : preview ? (
        <img src={preview} className='w-full h-full object-cover' />
      ) : (
        <div className='w-full h-full bg-gray-200 rounded-full' />
      )}
    </div>
  );
}
