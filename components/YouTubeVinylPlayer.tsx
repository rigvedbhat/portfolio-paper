/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";

export interface YouTubeVinylPlayerProps {
  videoId?: string;
  list?: string;
  accent?: string;
  autoplay?: boolean;
}

export function YouTubeVinylPlayer({
  videoId = "n61ULEU7CO0",
  list = "",
  accent = "#ff6a00",
  autoplay = true,
}: YouTubeVinylPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || (!list && !videoId)) return;

    let player: any = null;
    let timer: any = 0;
    let skips = 0;
    let pendingPlay = false;
    let ready = false;
    let firstVideoId = videoId ? String(videoId) : "";
    let destroyed = false;

    const hostWrap = el.querySelector(".as-ytp-yt") as HTMLElement | null;
    const titleEl = el.querySelector(".as-ytp-title") as HTMLElement | null;
    const subEl = el.querySelector(".as-ytp-sub") as HTMLElement | null;
    const artEl = el.querySelector(".as-ytp-art") as HTMLElement | null;
    const fill = el.querySelector(".as-ytp-prog i") as HTMLElement | null;
    const prog = el.querySelector(".as-ytp-prog") as HTMLElement | null;
    const playBtn = el.querySelector(".as-ytp-play") as HTMLElement | null;
    const discBtn = el.querySelector(".as-ytp-disc") as HTMLElement | null;
    const muteBtn = el.querySelector(".as-ytp-mute") as HTMLElement | null;
    const prevBtn = el.querySelector(".as-ytp-prev") as HTMLElement | null;
    const nextBtn = el.querySelector(".as-ytp-next") as HTMLElement | null;

    el.style.setProperty("--as-ytp-accent", accent);

    const storeKey = "as-ytp:" + String(list || firstVideoId).replace(/[^\w-]/g, "");
    let restoreTime = 0;
    let restoreIndex = 0;
    let restoreMuted = false;
    let restoreVol = 100;
    let restored = false;
    let wantResume = false;

    function serializePersist(input: any) {
      input = input || {};
      let time = Number(input.time);
      let index = parseInt(input.index, 10);
      let vol = Number(input.vol);
      if (!isFinite(time) || time < 0) time = 0;
      if (!isFinite(index) || index < 0) index = 0;
      if (!isFinite(vol)) vol = 100;
      if (vol < 0) vol = 0;
      if (vol > 100) vol = 100;
      return {
        v: 1,
        list: String(input.list || ""),
        videoId: String(input.videoId || "").replace(/[^\w-]/g, ""),
        index: Math.floor(index),
        time: time,
        playing: !!input.playing,
        muted: !!input.muted,
        vol: vol,
      };
    }

    function parsePersist(raw: any) {
      if (!raw) return null;
      let obj = raw;
      if (typeof raw === "string") {
        try {
          obj = JSON.parse(raw);
        } catch {
          return null;
        }
      }
      if (!obj || typeof obj !== "object") return null;
      if (obj.v && obj.v !== 1) return null;
      return serializePersist(obj);
    }

    function readSaved() {
      if (!storeKey) return null;
      try {
        return parsePersist(localStorage.getItem(storeKey));
      } catch {
        return null;
      }
    }

    function writeSaved() {
      if (!storeKey || !player || !player.getCurrentTime) return;
      let playing = false;
      let curVid = firstVideoId;
      let index = 0;
      let muted = false;
      let vol = 100;
      let time = 0;
      try {
        const st = player.getPlayerState();
        const YT = (window as any).YT;
        playing = !!(YT && (st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING));
      } catch {}
      try {
        const data = player.getVideoData() || {};
        if (data.video_id) curVid = data.video_id;
        if (player.getPlaylistIndex) index = player.getPlaylistIndex() || 0;
      } catch {}
      try {
        muted = !!(player.isMuted && player.isMuted());
        if (player.getVolume) vol = player.getVolume();
        time = player.getCurrentTime() || 0;
      } catch {}
      if (!restored && restoreTime > time) time = restoreTime;
      if (time < 0.75) {
        const prev = readSaved();
        let dead = false;
        try {
          const st2 = player.getPlayerState();
          const YT = (window as any).YT;
          dead = !YT || st2 < 0 || st2 === YT.PlayerState.UNSTARTED;
        } catch {
          dead = true;
        }
        if (dead && prev && prev.time > 1) time = prev.time;
      }
      try {
        localStorage.setItem(
          storeKey,
          JSON.stringify(
            serializePersist({
              list: list,
              videoId: curVid,
              index: index,
              time: time,
              playing: playing || wantResume,
              muted: muted,
              vol: vol,
            })
          )
        );
      } catch {}
    }

    let seekTries = 0;
    function applyRestore(target: any) {
      if (restored || !target) return;
      try {
        if (restoreMuted && target.mute) target.mute();
        if (target.setVolume) target.setVolume(restoreVol);
        if (restoreTime > 0.5 && target.seekTo) {
          let now = 0;
          try {
            now = target.getCurrentTime() || 0;
          } catch {}
          if (now < restoreTime - 0.75 && seekTries < 8) {
            seekTries += 1;
            target.seekTo(restoreTime, true);
            if (wantResume && target.playVideo) target.playVideo();
            return;
          }
        }
        restored = true;
        if (wantResume && target.playVideo) target.playVideo();
      } catch {}
    }

    const saved = readSaved();
    if (saved) {
      restoreTime = saved.time;
      restoreIndex = saved.index;
      restoreMuted = saved.muted;
      restoreVol = saved.vol;
      if (saved.videoId) firstVideoId = saved.videoId;
      wantResume = !!saved.playing;
      if (saved.muted) {
        el.classList.add("is-muted");
        if (muteBtn) muteBtn.setAttribute("aria-label", "Unmute");
      }
    }

    function thumb(id: string) {
      return id ? "https://i.ytimg.com/vi/" + String(id).replace(/[^\w-]/g, "") + "/hqdefault.jpg" : "";
    }

    if (firstVideoId && artEl) {
      artEl.style.backgroundImage = 'url("' + thumb(firstVideoId) + '")';
    }

    function setOn(on: boolean) {
      if (destroyed) return;
      el.classList.toggle("is-on", on);
      if (playBtn) {
        playBtn.setAttribute("aria-pressed", on ? "true" : "false");
        playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
      }
      if (discBtn) {
        discBtn.setAttribute("aria-label", on ? "Pause" : "Play");
      }
    }

    function syncMeta() {
      if (!player || !player.getVideoData || destroyed) return;
      const data = player.getVideoData() || {};
      if (data.title && titleEl) titleEl.textContent = data.title;
      if (data.video_id && artEl) {
        artEl.style.backgroundImage = 'url("' + thumb(data.video_id) + '")';
      }
      try {
        const pl = player.getPlaylist() || [];
        const idx = player.getPlaylistIndex();
        if (pl.length && subEl) subEl.textContent = idx + 1 + " of " + pl.length;
        else if (!list && subEl) subEl.textContent = "Looping";
      } catch {}
    }

    function paint() {
      if (!player || !player.getDuration || destroyed) return;
      const d = player.getDuration() || 0;
      const t = player.getCurrentTime() || 0;
      const p = d ? t / d : 0;
      if (fill) fill.style.width = (p * 100).toFixed(2) + "%";
      if (prog) prog.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    }

    function embedSrc(shouldAutoplay: boolean) {
      const vid = firstVideoId;
      const q = ["enablejsapi=1", "playsinline=1", "rel=0", "modestbranding=1", "controls=0"];
      if (vid && list) {
        if (shouldAutoplay) q.push("autoplay=1");
        if (restoreTime > 0) q.push("start=" + Math.floor(restoreTime));
        return "https://www.youtube.com/embed/" + encodeURIComponent(vid) + "?" + q.join("&");
      }
      q.push("loop=1");
      if (shouldAutoplay) q.push("autoplay=1");
      if (restoreTime > 0) q.push("start=" + Math.floor(restoreTime));
      if (list) {
        return "https://www.youtube.com/embed/videoseries?list=" + encodeURIComponent(list) + "&" + q.join("&");
      }
      q.push("playlist=" + encodeURIComponent(vid));
      return "https://www.youtube.com/embed/" + encodeURIComponent(vid) + "?" + q.join("&");
    }

    function mountIframe(shouldAutoplay: boolean) {
      if (!hostWrap) return null;
      let iframe = hostWrap.querySelector("iframe");
      if (!iframe) {
        hostWrap.innerHTML = "";
        iframe = document.createElement("iframe");
        iframe.id = "as-ytp-frame";
        iframe.width = "200";
        iframe.height = "200";
        iframe.setAttribute("title", list ? "YouTube playlist" : "YouTube video");
        iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.style.border = "0";
        iframe.style.width = "200px";
        iframe.style.height = "200px";
        hostWrap.appendChild(iframe);
      }
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      iframe.src = embedSrc(shouldAutoplay);
      return iframe;
    }

    function skipUnavailable() {
      if (!list) {
        setOn(false);
        if (subEl) subEl.textContent = "This video can’t be embedded";
        return;
      }
      if (skips++ >= 12) {
        setOn(false);
        if (subEl) subEl.textContent = "This playlist can’t be embedded";
        return;
      }
      try {
        if (player && typeof player.nextVideo === "function") player.nextVideo();
        else if (player && typeof player.playVideoAt === "function") {
          player.playVideoAt((player.getPlaylistIndex() || 0) + 1);
        }
      } catch {}
    }

    function attachApi(iframe: HTMLIFrameElement) {
      const win = window as any;
      if (player || !win.YT || !win.YT.Player || !iframe || destroyed) return;
      player = new win.YT.Player(iframe, {
        events: {
          onReady: function (e: any) {
            if (destroyed) return;
            ready = true;
            skips = 0;
            try {
              if (e.target.setLoop) e.target.setLoop(true);
            } catch {}
            if (list && typeof e.target.loadPlaylist === "function") {
              try {
                e.target.loadPlaylist({
                  list: list,
                  listType: "playlist",
                  index: restoreIndex || 0,
                  startSeconds: restoreTime || 0,
                });
              } catch {}
            } else {
              applyRestore(e.target);
            }
            syncMeta();
            paint();
            if (!timer) {
              timer = window.setInterval(function () {
                paint();
                syncMeta();
                writeSaved();
              }, 400);
            }
            if (pendingPlay) {
              try {
                e.target.playVideo();
              } catch {}
            }
          },
          onStateChange: function (e: any) {
            if (destroyed) return;
            const YT = (window as any).YT;
            if (
              !restored &&
              YT &&
              (e.data === YT.PlayerState.CUED ||
                e.data === YT.PlayerState.UNSTARTED ||
                e.data === YT.PlayerState.PLAYING)
            ) {
              applyRestore(e.target);
            }
            if (
              pendingPlay &&
              YT &&
              (e.data === YT.PlayerState.CUED || e.data === YT.PlayerState.UNSTARTED)
            ) {
              try {
                e.target.playVideo();
              } catch {}
            }
            if (YT && e.data === YT.PlayerState.ENDED) {
              try {
                if (list && player.getPlaylist) {
                  const pl = player.getPlaylist() || [];
                  const idx = player.getPlaylistIndex();
                  if (pl.length && idx >= pl.length - 1 && player.playVideoAt) player.playVideoAt(0);
                } else if (player.seekTo) {
                  player.seekTo(0, true);
                  player.playVideo();
                } else player.playVideo();
              } catch {}
              setOn(true);
              return;
            }
            const playing = e.data === YT.PlayerState.PLAYING;
            if (playing) {
              pendingPlay = false;
              skips = 0;
              if (!restored) applyRestore(e.target);
            }
            setOn(playing);
            syncMeta();
            if (restored) writeSaved();
          },
          onError: function () {
            skipUnavailable();
          },
        },
      });
    }

    function create(shouldAutoplay: boolean) {
      if (!hostWrap || destroyed) return;
      function go() {
        const iframe = mountIframe(!!shouldAutoplay);
        if (iframe) {
          whenYT(function () {
            attachApi(iframe);
          });
        }
      }
      if (list && !firstVideoId) {
        fetchOembed(function (data) {
          applyOembed(data);
          go();
        });
        return;
      }
      go();
    }

    function toggle() {
      const YT = (window as any).YT;
      if (player && ready && typeof player.getPlayerState === "function") {
        const st = player.getPlayerState();
        if (YT && st === YT.PlayerState.PLAYING) {
          player.pauseVideo();
          setOn(false);
          writeSaved();
        } else {
          player.playVideo();
          setOn(true);
          writeSaved();
        }
        return;
      }
      pendingPlay = true;
      setOn(true);
      create(true);
    }

    function whenYT(cb: () => void) {
      const win = window as any;
      if (win.YT && win.YT.Player) {
        cb();
        return;
      }
      if (!win.__AS_YTP_Q__) win.__AS_YTP_Q__ = [];
      win.__AS_YTP_Q__.push(cb);
      const prev = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = function () {
        if (typeof prev === "function") prev();
        const q = win.__AS_YTP_Q__ || [];
        win.__AS_YTP_Q__ = [];
        for (let i = 0; i < q.length; i++) q[i]();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.async = true;
        document.head.appendChild(s);
      }
    }

    function applyOembed(data: any) {
      if (!data || destroyed) return;
      if (data.title && titleEl) titleEl.textContent = data.title;
      if (data.author && subEl) subEl.textContent = data.author;
      if (data.thumb && artEl) artEl.style.backgroundImage = 'url("' + data.thumb + '")';
      if (data.videoId && !firstVideoId) {
        firstVideoId = data.videoId;
      }
    }

    function fetchOembed(cb: (data: any) => void) {
      const target = firstVideoId
        ? "https://www.youtube.com/watch?v=" + firstVideoId
        : "https://www.youtube.com/playlist?list=" + list;
      const url = "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(target);
      if (!window.fetch) {
        cb(null);
        return;
      }
      window
        .fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error("oembed");
          return res.json();
        })
        .then(function (json) {
          const thumbUrl = json.thumbnail_url || "";
          const m = thumbUrl.match(/\/vi\/([\w-]+)\//);
          cb({
            title: json.title || "",
            author: json.author_name || "YouTube",
            thumb: thumbUrl,
            videoId: m ? m[1] : "",
          });
        })
        .catch(function () {
          cb(null);
        });
    }

    const handlePlayClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    };

    const handlePrevClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (player && player.previousVideo) player.previousVideo();
      else if (player && player.seekTo) {
        player.seekTo(0, true);
        player.playVideo();
      }
    };

    const handleNextClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (player && player.nextVideo) player.nextVideo();
      else if (player && player.seekTo) {
        player.seekTo(0, true);
        player.playVideo();
      }
    };

    const handleMuteClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!player) return;
      if (player.isMuted && player.isMuted()) {
        player.unMute();
        el.classList.remove("is-muted");
        if (muteBtn) muteBtn.setAttribute("aria-label", "Mute");
      } else {
        player.mute();
        el.classList.add("is-muted");
        if (muteBtn) muteBtn.setAttribute("aria-label", "Unmute");
      }
      writeSaved();
    };

    const handleProgClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!player || !player.getDuration || !prog) return;
      const rect = prog.getBoundingClientRect();
      const p = rect.width ? (e.clientX - rect.left) / rect.width : 0;
      const d = player.getDuration() || 0;
      if (d) player.seekTo(Math.max(0, Math.min(1, p)) * d, true);
    };

    if (playBtn) playBtn.addEventListener("click", handlePlayClick);
    if (discBtn) discBtn.addEventListener("click", handlePlayClick);
    if (prevBtn) prevBtn.addEventListener("click", handlePrevClick);
    if (nextBtn) nextBtn.addEventListener("click", handleNextClick);
    if (muteBtn) muteBtn.addEventListener("click", handleMuteClick);
    if (prog) prog.addEventListener("click", handleProgClick);

    let oembedDone = false;
    function startMeta(data: any) {
      if (oembedDone || destroyed) return;
      oembedDone = true;
      applyOembed(data);
      whenYT(function () {});
    }
    fetchOembed(startMeta);
    const metaTimeout = window.setTimeout(function () {
      startMeta(null);
    }, 1800);

    const onPageHide = () => {
      writeSaved();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") writeSaved();
    };

    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (autoplay || wantResume) {
      pendingPlay = true;
      setOn(true);
      create(true);
    }

    return () => {
      destroyed = true;
      writeSaved();
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(metaTimeout);

      if (playBtn) playBtn.removeEventListener("click", handlePlayClick);
      if (discBtn) discBtn.removeEventListener("click", handlePlayClick);
      if (prevBtn) prevBtn.removeEventListener("click", handlePrevClick);
      if (nextBtn) nextBtn.removeEventListener("click", handleNextClick);
      if (muteBtn) muteBtn.removeEventListener("click", handleMuteClick);
      if (prog) prog.removeEventListener("click", handleProgClick);

      ready = false;
      pendingPlay = false;
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
      if (player && player.destroy) {
        try {
          player.destroy();
        } catch {}
      }
      player = null;
    };
  }, [videoId, list, accent, autoplay]);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
#as-ytp{--as-ytp-accent:#ff6a00;--as-ytp-ink:#0b0f1a;--as-ytp-ink2:rgba(11,15,26,0.74);--as-ytp-ink3:rgba(11,15,26,0.52);--as-ytp-muted:#c5c8ce;--as-ytp-ease:cubic-bezier(0.23,1,0.32,1);position:relative;width:292px;padding-top:12px;overflow:visible;user-select:none;touch-action:manipulation;-webkit-font-smoothing:antialiased;font-family:"SF Pro Text",-apple-system,BlinkMacSystemFont,system-ui,sans-serif}
html.dark #as-ytp, [data-theme="dark"] #as-ytp{--as-ytp-ink:#edebe6;--as-ytp-ink2:rgba(237,235,230,0.85);--as-ytp-ink3:rgba(237,235,230,0.60);--as-ytp-muted:#7e7b74}
#as-ytp.pos-bl{position:fixed;left:48px;bottom:28px;z-index:2147483000}
#as-ytp.pos-br{position:fixed;right:48px;left:auto;bottom:28px;z-index:2147483000}
#as-ytp.pos-in{position:relative;left:auto;bottom:auto;z-index:1}
#as-ytp .as-ytp-bar{position:relative;height:48px;padding:0 6px 0 78px;border-radius:24px;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:none;display:flex;align-items:center;transition:background 220ms ease,box-shadow 220ms var(--as-ytp-ease)}
#as-ytp .as-ytp-body{display:flex;flex-direction:row;align-items:center;gap:6px;min-width:0;width:100%;opacity:0.75;transition:opacity 220ms ease}
#as-ytp:hover .as-ytp-bar,#as-ytp:focus-within .as-ytp-bar{background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 1px 2px rgba(15,23,42,0.05),0 10px 28px rgba(15,23,42,0.1)}
html.dark #as-ytp:hover .as-ytp-bar,html.dark #as-ytp:focus-within .as-ytp-bar,[data-theme="dark"] #as-ytp:hover .as-ytp-bar,[data-theme="dark"] #as-ytp:focus-within .as-ytp-bar{background:rgba(28,27,25,0.95);border:1px solid #383530;box-shadow:0 4px 20px rgba(0,0,0,0.5)}
#as-ytp:hover .as-ytp-body,#as-ytp:focus-within .as-ytp-body{opacity:1}
#as-ytp .as-ytp-names{flex:1;min-width:0}
#as-ytp .as-ytp-title{display:block;font-size:13px;font-weight:650;letter-spacing:-0.03em;color:var(--as-ytp-ink);line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#as-ytp .as-ytp-sub{display:block;margin-top:1px;font-size:11px;font-weight:500;color:var(--as-ytp-ink3);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#as-ytp .as-ytp-prog{margin-top:6px;height:2px;border-radius:1px;background:rgba(15,23,42,0.1);cursor:pointer}
html.dark #as-ytp .as-ytp-prog,[data-theme="dark"] #as-ytp .as-ytp-prog{background:rgba(255,255,255,0.18)}
#as-ytp .as-ytp-prog i{display:block;width:0%;height:100%;border-radius:1px;pointer-events:none;background:var(--as-ytp-accent)}
#as-ytp .as-ytp-disc{position:absolute;left:4px;top:-10px;width:68px;height:68px;border:0;padding:0;border-radius:50%;cursor:pointer;background:transparent;overflow:hidden;z-index:2;box-shadow:none;outline:1px solid transparent;opacity:0.85;filter:saturate(0.9);transition:transform 120ms var(--as-ytp-ease),opacity 220ms ease,filter 220ms ease,background 220ms ease,box-shadow 220ms var(--as-ytp-ease),outline-color 220ms ease}
#as-ytp:hover .as-ytp-disc,#as-ytp:focus-within .as-ytp-disc{opacity:1;filter:saturate(1);background:#fff;box-shadow:0 6px 18px rgba(15,23,42,0.14);outline-color:rgba(0,0,0,0.1)}
html.dark #as-ytp:hover .as-ytp-disc,html.dark #as-ytp:focus-within .as-ytp-disc,[data-theme="dark"] #as-ytp:hover .as-ytp-disc,[data-theme="dark"] #as-ytp:focus-within .as-ytp-disc{background:#181716;box-shadow:0 6px 18px rgba(0,0,0,0.6);outline-color:#383530}
#as-ytp .as-ytp-disc:active{transform:scale(0.96)}
#as-ytp .as-ytp-yt{position:absolute;width:200px;height:200px;left:50%;top:50%;transform:translate(-50%,-50%) scale(0.34);transform-origin:center center;pointer-events:none}
#as-ytp .as-ytp-yt iframe{width:200px!important;height:200px!important;border:0}
#as-ytp .as-ytp-art{position:absolute;inset:3px;border-radius:50%;background:#111 center/cover no-repeat;pointer-events:none;z-index:1;animation:as-ytp-spin 8s linear infinite;animation-play-state:paused}
#as-ytp.is-on .as-ytp-art{animation-play-state:running}
#as-ytp .as-ytp-hole{position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,0.2);z-index:3;pointer-events:none}
html.dark #as-ytp .as-ytp-hole,[data-theme="dark"] #as-ytp .as-ytp-hole{background:#262522;box-shadow:0 0 0 1px rgba(255,255,255,0.2)}
#as-ytp .as-ytp-hit{position:absolute;inset:0;z-index:4}
#as-ytp .as-ytp-controls{display:flex;align-items:center;flex-shrink:0}
#as-ytp .as-ytp-ctrl{position:relative;width:26px;height:26px;border:0;padding:0;background:transparent;color:var(--as-ytp-muted);cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center}
#as-ytp .as-ytp-ctrl:hover{color:var(--as-ytp-ink)}
#as-ytp .as-ytp-ctrl svg{width:13px;height:13px;display:block}
#as-ytp .as-ytp-play{width:28px;height:28px;color:var(--as-ytp-ink);background:transparent}
#as-ytp:hover .as-ytp-play,#as-ytp:focus-within .as-ytp-play{background:rgba(15,23,42,0.06)}
html.dark #as-ytp:hover .as-ytp-play,html.dark #as-ytp:focus-within .as-ytp-play,[data-theme="dark"] #as-ytp:hover .as-ytp-play,[data-theme="dark"] #as-ytp:focus-within .as-ytp-play{background:rgba(255,255,255,0.1)}
#as-ytp .as-ytp-play svg{position:absolute;width:13px;height:13px}
#as-ytp .as-ytp-play-ico{transform:translateX(1px)}
#as-ytp .as-ytp-mute{width:26px;height:26px;border:0;padding:0;background:transparent;color:var(--as-ytp-muted);cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
#as-ytp .as-ytp-mute svg{position:absolute;width:13px;height:13px}
#as-ytp.is-muted .as-ytp-vol-ico,#as-ytp:not(.is-muted) .as-ytp-mute-ico{opacity:0;transform:scale(0.25);pointer-events:none}
#as-ytp.is-on .as-ytp-play-ico,#as-ytp:not(.is-on) .as-ytp-pause-ico{opacity:0;transform:scale(0.25);pointer-events:none}
#as-ytp.is-on .as-ytp-pause-ico{opacity:1;transform:scale(1)}
#as-ytp:not(.is-on) .as-ytp-play-ico{opacity:1;transform:translateX(1px) scale(1)}
@keyframes as-ytp-spin{to{transform:rotate(360deg)}}
@media (max-width:480px){#as-ytp.pos-bl{left:16px;bottom:16px;width:min(292px,calc(100% - 32px))}#as-ytp.pos-br{right:16px;bottom:16px;width:min(292px,calc(100% - 32px))}}
@media (prefers-reduced-motion:reduce){#as-ytp .as-ytp-art{animation:none!important}#as-ytp .as-ytp-bar,#as-ytp .as-ytp-body,#as-ytp .as-ytp-disc,#as-ytp .as-ytp-play svg,#as-ytp .as-ytp-mute svg{transition:none}}
        `,
      }} />

      <div id="as-ytp" ref={containerRef} className="pos-br">
        <div className="as-ytp-bar">
          <button type="button" className="as-ytp-disc" aria-label="Play or pause">
            <span className="as-ytp-yt">
              <span className="as-ytp-yt-host"></span>
            </span>
            <span className="as-ytp-art" aria-hidden="true"></span>
            <span className="as-ytp-hole" aria-hidden="true"></span>
            <span className="as-ytp-hit"></span>
          </button>
          <div className="as-ytp-body">
            <div className="as-ytp-names">
              <span className="as-ytp-title">Your mix</span>
              <span className="as-ytp-sub">Paste a link</span>
              <div
                className="as-ytp-prog"
                role="slider"
                aria-label="Progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
              >
                <i></i>
              </div>
            </div>
            <div className="as-ytp-controls">
              <button type="button" className="as-ytp-ctrl as-ytp-prev" aria-label="Previous">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M11 12L20 6v12L11 12zm-7 6V6h2v12H4z" />
                </svg>
              </button>
              <button
                type="button"
                className="as-ytp-ctrl as-ytp-play"
                aria-label="Play"
                aria-pressed="false"
              >
                <svg className="as-ytp-play-ico" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M8 6.2v11.6L18.2 12z" />
                </svg>
                <svg className="as-ytp-pause-ico" viewBox="0 0 24 24" aria-hidden="true">
                  <rect fill="currentColor" x="6.8" y="6" width="3.6" height="12" rx="1" />
                  <rect fill="currentColor" x="13.6" y="6" width="3.6" height="12" rx="1" />
                </svg>
              </button>
              <button type="button" className="as-ytp-ctrl as-ytp-next" aria-label="Next">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M13 12L4 6v12l9-6zm7-6v12h-2V6h2z" />
                </svg>
              </button>
            </div>
            <button type="button" className="as-ytp-mute" aria-label="Mute">
              <svg className="as-ytp-vol-ico" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3 10v4h3.2L11 18V6L6.2 10H3zm11.5 2a3.5 3.5 0 0 0-1.8-3v6a3.5 3.5 0 0 0 1.8-3zm-1.8-7.2v2.1A6.5 6.5 0 0 1 18.5 12a6.5 6.5 0 0 1-5.8 5.1v2.1A8.5 8.5 0 0 0 20.5 12a8.5 8.5 0 0 0-7.8-7.2z"
                />
              </svg>
              <svg className="as-ytp-mute-ico" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3 10v4h3.2L11 18V6L6.2 10H3zm13.5 1.1l-1.4-1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
