import React, { useState } from 'react';

export const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  return (
    <div>
      <video src={src} controls onClick={togglePlay} autoPlay={true} width={650}>
      {/* <source src={src} type="video/mp4" /> */}
      </video>
    </div>
  );
};