import { useEffect, useRef } from 'react';
import './BabyPage.css';

import frogImage from '../assets/frog3.webp';
import hectorSong from '../assets/hectors-song.mp3';

function BabyPage() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;
      const play = () => audio.play().catch(() => {});
      audio.addEventListener('canplaythrough', play);
      play();
      return () => audio.removeEventListener('canplaythrough', play);
    }
  }, []);

  return (
    <div className="baby-page">
      <audio ref={audioRef} src={hectorSong} loop />
      <div className="baby-page-content">
        <img
          src={frogImage}
          alt="Frog"
          className="baby-page-image"
        />
      </div>
    </div>
  );
}

export default BabyPage;
