"use client";

import React from 'react';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button className="sound-toggle hud-interactive" onClick={onToggle}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        {enabled ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </>
        ) : (
          <line x1="23" y1="1" x2="1" y2="23"></line>
        )}
      </svg>
      <span className="sound-text">SOUND {enabled ? 'ON' : 'OFF'}</span>
    </button>
  );
}
