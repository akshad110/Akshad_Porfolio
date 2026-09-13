"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const sync = (visible: boolean) => {
      setInView(visible);
      if (visible) {
        if (!userPausedRef.current) {
          void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        }
      } else {
        video.pause();
        setPlaying(false);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        sync(entry.isIntersecting && entry.intersectionRatio > 0.35);
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      void video.play();
      setPlaying(true);
    } else {
      userPausedRef.current = true;
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    userPausedRef.current = true;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 bg-background">
      <video
        ref={videoRef}
        src={src}
        className="h-full min-h-full w-full min-w-full object-cover object-[center_88%] bg-background"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        Your browser does not support video playback.
      </video>
      <div className="absolute top-[4.75rem] right-3 z-[3] sm:top-[5.5rem] sm:right-8">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!inView}
            className="rounded-md border border-white/20 bg-black/45 p-2 backdrop-blur-md disabled:opacity-40"
            aria-label={playing ? "Pause introduction video" : "Play introduction video"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-md border border-white/20 bg-black/45 p-2 backdrop-blur-md"
            aria-label={muted ? "Unmute introduction video" : "Mute introduction video"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={stop}
            className="rounded-md border border-white/20 bg-black/45 px-3 py-2 font-heading text-[11px] tracking-widest uppercase backdrop-blur-md"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
