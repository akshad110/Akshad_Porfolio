"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  // Media fragment helps browsers paint the first frame as bytes arrive.
  const resolvedSrc = `${src.split("#")[0]}#t=0.001`;
  const resolvedPoster = poster.split("#")[0];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setReady(true);
    const tryPlay = () => {
      if (userPausedRef.current) return;
      void video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    const onCanPlay = () => {
      markReady();
      tryPlay();
    };

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", onCanPlay);
    video.preload = "auto";
    try {
      video.load();
    } catch {
      // ignore
    }
    tryPlay();

    return () => {
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [resolvedSrc]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const sync = (visible: boolean) => {
      setInView(visible);
      if (visible) {
        if (!userPausedRef.current) {
          void video
            .play()
            .then(() => setPlaying(true))
            .catch(() => setPlaying(false));
        }
      } else {
        video.pause();
        setPlaying(false);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        sync(entry.isIntersecting && entry.intersectionRatio > 0.05);
      },
      { threshold: [0, 0.05, 1] },
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
    <div ref={wrapRef} className="absolute inset-0 z-0 overflow-hidden bg-[#0e0f0f]">
      <div
        className="absolute inset-0 hidden h-full w-full bg-cover bg-[center_88%] md:block"
        style={{ backgroundImage: `url(${resolvedPoster})` }}
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        src={resolvedSrc}
        poster={resolvedPoster}
        className={`absolute inset-0 h-full w-full bg-black object-contain object-top transition-opacity duration-200 md:bg-transparent md:object-cover md:object-[center_88%] ${ready ? "opacity-100" : "opacity-0"}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // @ts-expect-error fetchPriority is supported for media in modern browsers
        fetchPriority="high"
      >
        Your browser does not support video playback.
      </video>
      <div className="absolute top-16 right-4 z-[3] md:top-[5.5rem] md:right-8">
        <div className="flex items-center gap-1 md:gap-2">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!inView}
            className="rounded-md border border-white/20 bg-black/45 p-1 backdrop-blur-md disabled:opacity-40 md:p-2"
            aria-label={playing ? "Pause introduction video" : "Play introduction video"}
          >
            {playing ? <Pause className="h-3 w-3 md:h-4 md:w-4" /> : <Play className="h-3 w-3 md:h-4 md:w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-md border border-white/20 bg-black/45 p-1 backdrop-blur-md md:p-2"
            aria-label={muted ? "Unmute introduction video" : "Mute introduction video"}
          >
            {muted ? <VolumeX className="h-3 w-3 md:h-4 md:w-4" /> : <Volume2 className="h-3 w-3 md:h-4 md:w-4" />}
          </button>
          <button
            type="button"
            onClick={stop}
            className="rounded-md border border-white/20 bg-black/45 px-1.5 py-1 font-heading text-[8px] tracking-widest uppercase backdrop-blur-md md:px-3 md:py-2 md:text-[11px]"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
