import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import songAsset from "@/assets/song.mp3.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GTA 6 Ultimate Edition — Happy Birthday Trent!" },
      {
        name: "description",
        content:
          "A cinematic Ultimate Edition pre-order experience celebrating the return to Vice City.",
      },
      { property: "og:title", content: "GTA 6 Ultimate Edition" },
      {
        property: "og:description",
        content: "Pre-order confirmed. The future of GTA starts here.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const LOG_LINES = [
  "Connecting to Rockstar servers…",
  "Verifying pre-order token…",
  "Downloading Vice City assets…",
  "Unpacking neon skyline…",
  "Calibrating palm trees…",
  "Syncing soundtrack…",
  "Finalizing Ultimate Edition…",
];

function Index() {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [phase, setPhase] = useState<"install" | "done">("install");
  const [money, setMoney] = useState(160);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (phase !== "done") return;
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.7;
    a.currentTime = 0;
    const tryPlay = async () => {
      try {
        await a.play();
      } catch {
        setMuted(true);
        a.muted = true;
        try {
          await a.play();
        } catch {
          /* ignore */
        }
      }
    };
    tryPlay();
    return () => {
      a.pause();
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const start = performance.now();
    const duration = 4000;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 2);
      setMoney(Math.max(0, 160 - 160 * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else setMoney(0);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "install") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 4 + 1);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setPhase("done"), 900);
        }
        return next;
      });
    }, 220);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "install") return;
    const id = setInterval(() => {
      setLogIndex((i) => (i + 1) % LOG_LINES.length);
    }, 1600);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    // Launch date: November 19, 2026
    const target = new Date("2026-11-19T00:00:00Z").getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-noir text-foreground">
      {/* Cinematic bars */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[10vh] bg-black" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[10vh] bg-black" />

      {/* Ambient neon backdrop */}
      <div className="absolute inset-0 -z-10 bg-vice" />
      <div className="absolute inset-0 -z-10 bg-black/60" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.08]" />

      {phase === "install" ? (
        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center animate-zoom-in">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-vice-pink">
            🎉 Happy Birthday, Trent
          </p>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-transparent md:text-7xl bg-clip-text bg-vice-gradient drop-shadow-[0_0_30px_rgba(255,79,216,0.35)]">
            GTA VI
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.35em] text-vice-gold md:text-base">
            Ultimate Edition
          </p>

          <p className="mt-8 text-lg text-white/80 md:text-xl">
            Installing GTA 6 Ultimate Edition
          </p>

          <div className="mt-6 w-full max-w-xl">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-vice-gradient shadow-[0_0_20px_rgba(255,79,216,0.6)] transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-white/60">
              <span>{Math.floor(progress)}%</span>
              <span>{progress < 100 ? "Installing…" : "Finalizing…"}</span>
            </div>
          </div>

          <div className="relative mt-8 h-10 w-full max-w-xl overflow-hidden">
            {LOG_LINES.map((line, i) => (
              <p
                key={i}
                className={`absolute inset-x-0 text-sm transition-all duration-500 md:text-base ${
                  i === logIndex
                    ? "translate-y-0 opacity-100 text-white"
                    : "translate-y-4 opacity-0 text-white/40"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </section>
      ) : (
        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <audio ref={audioRef} src={songAsset.url} loop preload="auto" />

          <button
            type="button"
            onClick={() => {
              const a = audioRef.current;
              if (!a) return;
              const next = !muted;
              a.muted = next;
              setMuted(next);
              if (!next && a.paused) a.play().catch(() => {});
            }}
            aria-label={muted ? "Unmute soundtrack" : "Mute soundtrack"}
            className="absolute left-4 top-[11vh] z-20 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition hover:bg-black/70 md:left-8 md:top-[12vh]"
          >
            {muted ? "♪ Tap for sound" : "♪ On"}
          </button>

          {/* Scanline overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 animate-scan"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* GTA HUD money counter */}
          <div className="pointer-events-none absolute right-4 top-[11vh] z-20 flex items-baseline gap-1 md:right-8 md:top-[12vh]">
            <span
              className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]"
              style={{
                fontFamily: "var(--font-money)",
                fontSize: "clamp(2rem, 6vw, 3.75rem)",
                lineHeight: 1,
                letterSpacing: "0.02em",
                WebkitTextStroke: "1px rgba(0,0,0,0.85)",
              }}
            >
              ${money.toFixed(2)}
            </span>
          </div>

          <span
            className="mb-4 rounded-full border border-vice-pink/40 bg-vice-pink/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-vice-pink animate-rockstar-rise"
            style={{ animationDelay: "1.6s" }}
          >
            Pre-Order Confirmed
          </span>

          <h2 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-transparent md:text-7xl bg-clip-text bg-vice-gradient animate-rockstar-zoom drop-shadow-[0_0_40px_rgba(255,204,51,0.45)]">
            The Future of GTA
            <br />
            Starts Here
          </h2>

          <p
            className="mt-6 max-w-lg text-lg text-white/80 md:text-xl animate-rockstar-rise"
            style={{ animationDelay: "1.9s" }}
          >
            Welcome to Vice City, Trent.
            <br />
            The countdown starts now.
          </p>

          <div
            className="mt-10 grid grid-cols-4 gap-3 md:gap-6 animate-rockstar-rise"
            style={{ animationDelay: "2.2s" }}
          >
            {[
              { l: "Days", v: countdown.d },
              { l: "Hours", v: countdown.h },
              { l: "Minutes", v: countdown.m },
              { l: "Seconds", v: countdown.s },
            ].map((c) => (
              <div
                key={c.l}
                className="min-w-[70px] rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 backdrop-blur-sm md:min-w-[96px] md:px-5 md:py-4"
              >
                <div className="font-display text-3xl font-black text-white md:text-5xl">
                  {String(c.v).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/50 md:text-xs">
                  {c.l}
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://www.rockstargames.com/VI"
            target="_blank"
            rel="noopener noreferrer"
            style={{ animationDelay: "2.5s" }}
            className="mt-10 inline-block rounded-full bg-vice-gradient px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_35px_rgba(255,79,216,0.55)] transition-transform hover:scale-105 animate-rockstar-rise"
          >
            Next Stop → Vice City
          </a>

          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-white/40">
            Rockstar Games · Ultimate Edition · 2026
          </p>
        </section>
      )}
    </main>
  );
}
