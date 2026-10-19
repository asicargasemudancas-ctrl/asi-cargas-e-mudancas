"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Vídeo real em loop mudo: baixa e toca sozinho quando entra na tela e pausa ao sair.
// O botão de pausa atende a WCAG 2.2.2 (conteúdo em movimento com controle do usuário).
export function LoopVideo({
  src,
  poster,
  label,
  className,
}: Readonly<{ src: string; poster: string; label: string; className?: string }>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (pausedByUser.current) return;
        video.preload = "auto";
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    }, { threshold: 0.3 });
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      void video.play().catch(() => undefined);
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay={false}
        preload="none"
        poster={poster}
        aria-label={label}
        data-testid="loop-video"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={className}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pausar vídeo: ${label}` : `Reproduzir vídeo: ${label}`}
        className="absolute bottom-3 right-3 z-10 grid size-9 place-items-center rounded-full border border-white/25 bg-[#07142f]/70 text-white backdrop-blur transition hover:bg-[#07142f]"
      >
        {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4 translate-x-px" aria-hidden="true" />}
      </button>
    </div>
  );
}
