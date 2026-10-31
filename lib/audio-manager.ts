/* ── Ghost of Tsushima Audio Manager ──────────────────────────── */

let bgAudio: HTMLAudioElement | null = null;
let introAudio: HTMLAudioElement | null = null;
let dlcIntroAudio: HTMLAudioElement | null = null;
let isBgPlaying = false;

// Register global user interaction listener to unlock browser audio autoplay policies
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };
  window.addEventListener("click", unlockAudio);
  window.addEventListener("keydown", unlockAudio);
  window.addEventListener("touchstart", unlockAudio);
}

/**
 * Play intro sound (/intro.mp3) during the intro scene only.
 */
export function playIntroAudio(): void {
  if (typeof window === "undefined") return;
  try {
    if (!introAudio) {
      introAudio = new Audio("/intro-2.mp3");
    }
    introAudio.pause();
    introAudio.currentTime = 0;
    introAudio.volume = 0.95;
    const playPromise = introAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay was prevented, setting up one-time interaction handler:", err);
        const resumeOnUserAction = () => {
          if (introAudio) {
            introAudio.volume = 0.95;
            introAudio.play().catch(() => {});
          }
          window.removeEventListener("click", resumeOnUserAction);
          window.removeEventListener("touchstart", resumeOnUserAction);
          window.removeEventListener("keydown", resumeOnUserAction);
        };
        window.addEventListener("click", resumeOnUserAction);
        window.addEventListener("touchstart", resumeOnUserAction);
        window.addEventListener("keydown", resumeOnUserAction);
      });
    }
  } catch (err) {
    console.error("Failed to play intro audio:", err);
  }
}

/**
 * Smoothly fade out intro sound if length is longer than intro scene.
 */
export function stopIntroAudio(): void {
  if (typeof window === "undefined" || !introAudio) return;
  try {
    const audio = introAudio;
    let vol = audio.volume;
    const fadeInterval = setInterval(() => {
      vol = Math.max(0, vol - 0.15);
      audio.volume = vol;
      if (vol <= 0) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
      }
    }, 50);
  } catch {}
}

/**
 * Play DLC intro sound (/intro_dlc.mp3) during DLC intro scene.
 */
export function playDLCIntroAudio(forceRestart = false): void {
  if (typeof window === "undefined") return;
  try {
    if (!dlcIntroAudio) {
      dlcIntroAudio = new Audio("/intro_dlc.mp3");
    }
    if (forceRestart || dlcIntroAudio.paused) {
      dlcIntroAudio.currentTime = 0;
      dlcIntroAudio.volume = 0.85;
      const p = dlcIntroAudio.play();
      if (p !== undefined) {
        p.catch(() => {
          const retryOnInteraction = () => {
            if (dlcIntroAudio) {
              dlcIntroAudio.play().catch(() => {});
            }
            window.removeEventListener("click", retryOnInteraction);
            window.removeEventListener("keydown", retryOnInteraction);
          };
          window.addEventListener("click", retryOnInteraction);
          window.addEventListener("keydown", retryOnInteraction);
        });
      }
    }
  } catch {}
}

/**
 * Smoothly fade out DLC intro sound.
 */
export function stopDLCIntroAudio(): void {
  if (typeof window === "undefined" || !dlcIntroAudio) return;
  try {
    const audio = dlcIntroAudio;
    let vol = audio.volume;
    const fadeInterval = setInterval(() => {
      vol = Math.max(0, vol - 0.12);
      audio.volume = vol;
      if (vol <= 0) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
      }
    }, 60);
  } catch {}
}

/**
 * Play transition sound effect (/transition.mp3) when moving between screens.
 */
export function playTransitionAudio(): void {
  if (typeof window === "undefined") return;
  try {
    const sfx = new Audio("/transition.mp3");
    sfx.volume = 0.65;
    sfx.play().catch(() => {});
  } catch {}
}

/**
 * Start background music (/bg_loop_sound.mp3) on loop at 20% volume.
 */
export function startBackgroundAudio(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (!bgAudio) {
      bgAudio = new Audio("/bg_loop_sound.mp3");
      bgAudio.loop = true;
    }
    bgAudio.volume = 0.20;
    bgAudio.play().then(() => {
      isBgPlaying = true;
    }).catch(() => {
      isBgPlaying = false;
      const retryBg = () => {
        if (bgAudio) {
          bgAudio.volume = 0.20;
          bgAudio.play().then(() => {
            isBgPlaying = true;
          }).catch(() => {});
        }
        window.removeEventListener("click", retryBg);
        window.removeEventListener("keydown", retryBg);
      };
      window.addEventListener("click", retryBg);
      window.addEventListener("keydown", retryBg);
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Stop background music completely.
 */
export function stopBackgroundAudio(): void {
  if (typeof window === "undefined" || !bgAudio) return;
  try {
    bgAudio.pause();
    isBgPlaying = false;
  } catch {}
}

/**
 * Pause background music (preserves playback position for resuming later).
 */
export function pauseBackgroundAudio(): void {
  if (typeof window === "undefined" || !bgAudio) return;
  try {
    bgAudio.pause();
  } catch {}
}

/**
 * Resume background music from where it was paused.
 */
export function resumeBackgroundAudio(): void {
  if (typeof window === "undefined" || !bgAudio) return;
  try {
    bgAudio.volume = 0.20;
    bgAudio.play().then(() => {
      isBgPlaying = true;
    }).catch(() => {});
  } catch {}
}

/**
 * Toggle background music.
 */
export function toggleBackgroundAudio(): boolean {
  if (isBgPlaying && bgAudio) {
    stopBackgroundAudio();
    return false;
  } else {
    startBackgroundAudio();
    return true;
  }
}

export function isBgAudioPlaying(): boolean {
  return isBgPlaying;
}

/* Legacy Alias Exports for backwards compatibility */
export const startAmbient = startBackgroundAudio;
export const stopAmbient = stopBackgroundAudio;
export const toggleAmbient = toggleBackgroundAudio;
export const isAmbientPlaying = isBgAudioPlaying;
