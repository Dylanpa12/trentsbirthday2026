import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import songAsset from "@/assets/song.mp3.asset.json";

// ⇩⇩⇩ Paste the direct URL of the GTA VI trailer clip you want scroll-scrubbed here.
// Any MP4/WebM URL (or a Lovable Asset URL) works. Leave blank to hide the section.
const SCROLL_VIDEO_URL = "";

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
  const [phase, setPhase] = useState<"logo" | "install" | "done">("logo");
  const [money, setMoney] = useState(160);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollSectionRef = useRef<HTMLDivElement | null>(null);

  // Rockstar logo flash intro → install screen
  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => setPhase("install"), 2600);
    return () => clearTimeout(t);
  }, [phase]);

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
    const duration = 8000;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
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

  // Scroll-scrub the trailer video
  useEffect(() => {
    if (phase !== "done" || !SCROLL_VIDEO_URL) return;
    const section = scrollSectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let ready = false;
    const onMeta = () => {
      ready = true;
      onScroll();
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    const onScroll = () => {
      if (!ready || !video.duration) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      video.currentTime = p * video.duration;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [phase]);

  const moneyFont = 'Pricedown, "Bebas Neue", Impact, sans-serif';

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-noir text-foreground">
      {/* Cinematic bars */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[10vh] bg-black" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[10vh] bg-black" />

      {/* Ambient neon backdrop */}
      <div className="fixed inset-0 -z-10 bg-vice" />
      <div className="fixed inset-0 -z-10 bg-black/60" />
      <div className="fixed inset-0 -z-10 bg-grid opacity-[0.08]" />

      {phase === "logo" && (
        <section className="relative z-10 flex min-h-screen items-center justify-center bg-black">
          <div className="animate-logo-flash text-center">
            <div
              className="text-white"
              style={{
                fontFamily: moneyFont,
                fontSize: "clamp(6rem, 22vw, 16rem)",
                lineHeight: 0.85,
                letterSpacing: "0.02em",
                textShadow: "0 0 40px rgba(255,255,255,0.35)",
              }}
            >
              R<span className="text-vice-gold">★</span>
            </div>
            <div
              className="mt-2 uppercase tracking-[0.6em] text-white/80"
              style={{ fontFamily: moneyFont, fontSize: "clamp(1rem, 2.4vw, 1.6rem)" }}
            >
              Rockstar Games
            </div>
          </div>
        </section>
      )}

      {phase === "install" && (
        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center animate-zoom-in">
          <p
            className="mb-6 text-transparent bg-clip-text bg-vice-gradient drop-shadow-[0_0_25px_rgba(255,79,216,0.35)]"
            style={{
              fontFamily: moneyFont,
              fontSize: "clamp(3rem, 9vw, 6rem)",
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            Happy Birthday Trent
          </p>
          <h1
            className="font-black uppercase tracking-tight text-transparent bg-clip-text bg-vice-gradient drop-shadow-[0_0_30px_rgba(255,79,216,0.35)]"
            style={{
              fontFamily: moneyFont,
              fontSize: "clamp(5rem, 16vw, 10rem)",
              lineHeight: 0.9,
            }}
          >
            GTA VI
          </h1>
          <p
            className="mt-3 uppercase tracking-[0.35em] text-vice-gold"
            style={{ fontSize: "clamp(1rem, 2.2vw, 1.5rem)" }}
          >
            Ultimate Edition
          </p>

          <p className="mt-10 text-xl text-white/80 md:text-2xl">
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
      )}

      {phase === "done" && (
        <>
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
                  fontFamily: moneyFont,
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
              See you on launch day.
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

            {SCROLL_VIDEO_URL && (
              <div className="pointer-events-none absolute bottom-[12vh] left-1/2 -translate-x-1/2 animate-bounce text-xs uppercase tracking-[0.3em] text-white/60">
                Scroll ↓
              </div>
            )}
          </section>

          {SCROLL_VIDEO_URL && (
            <section
              ref={scrollSectionRef}
              className="relative"
              style={{ height: "400vh" }}
            >
              <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={SCROLL_VIDEO_URL}
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                <div className="pointer-events-none absolute bottom-[14vh] left-0 right-0 text-center">
                  <p
                    className="text-transparent bg-clip-text bg-vice-gradient"
                    style={{
                      fontFamily: moneyFont,
                      fontSize: "clamp(3rem, 10vw, 8rem)",
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                    }}
                  >
                    Vice City Awaits
                  </p>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
