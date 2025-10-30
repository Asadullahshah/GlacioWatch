import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  fallbackColor?: string;
  overlayOpacity?: number;
}

export function VideoBackground({
  src,
  fallbackColor = 'hsl(var(--background))',
  overlayOpacity = 0.3
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isMobile) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      video.play().catch(() => setHasError(true));
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [isMobile]);

  if (isMobile || hasError) {
    return (
      <div
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          background: `linear-gradient(135deg, ${fallbackColor} 0%, hsl(var(--muted)) 100%)`
        }}
      />
    );
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full -z-10 transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: `linear-gradient(135deg, ${fallbackColor} 0%, hsl(var(--muted)) 100%)`
        }}
      />

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`fixed top-0 left-0 w-full h-full object-cover -z-10 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          pointerEvents: 'none',
          transform: 'translateZ(0)',
          willChange: 'auto'
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className="fixed top-0 left-0 w-full h-full bg-background -z-10"
        style={{ opacity: overlayOpacity }}
      />
    </>
  );
}
