'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import '@/styles/easter/konami.css';
import '@/styles/easter/fun-mode.css';
import RedPillMode from '@/components/Easter/RedPillMode';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

type Phase = 'idle' | 'matrix' | 'choice' | 'red' | 'blue';

const MATRIX_CHARS = '0123456789';

export default function KonamiEgg() {
  const [phase, setPhase] = useState<Phase>('idle');
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const keysRef      = useRef<string[]>([]);
  const animFrameRef = useRef<number>(0);

  // Konami code detection
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const updated = [...keysRef.current, e.key].slice(-KONAMI_SEQUENCE.length);
      keysRef.current = updated;
      if (updated.join(',') === KONAMI_SEQUENCE.join(',')) {
        setPhase('matrix');
        keysRef.current = [];
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Matrix rain effect
  useEffect(() => {
    if (phase !== 'matrix') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const cols     = Math.floor(canvas.width / fontSize);
    const rows     = Math.floor(canvas.height / fontSize);

    const drops    = Array.from({ length: cols }, () => Math.floor(Math.random() * -rows));
    const colDone  = new Array<boolean>(cols).fill(false);
    let doneCols   = 0;
    const doneThreshold = Math.floor(cols * 0.92);

    const tick = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        if (colDone[i]) return;
        const xPx = i * fontSize;
        const yPx = y * fontSize;

        ctx.font      = `bold ${fontSize}px monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.fillText(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)], xPx, yPx);

        ctx.font = `${fontSize}px monospace`;
        for (let t = 1; t <= 8; t++) {
          const trailYPx = (y - t) * fontSize;
          if (trailYPx < 0) break;
          ctx.globalAlpha = Math.max(0, 1 - t * 0.13);
          ctx.fillStyle   = t <= 2 ? '#88ffaa' : '#00ff41';
          ctx.fillText(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)], xPx, trailYPx);
        }
        ctx.globalAlpha = 1;
        drops[i]++;

        if (!colDone[i] && yPx > canvas.height && Math.random() > 0.975) {
          colDone[i] = true;
          doneCols++;
        }
      });

      if (doneCols < doneThreshold) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setPhase('choice');
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase]);

  const handleRedPill = useCallback(() => {
    document.documentElement.classList.add('red-pill-mode');
    setPhase('red');
  }, []);

  const handleBluePill = useCallback(() => {
    document.documentElement.classList.add('fun-mode');
    setPhase('blue');
  }, []);

  const handleRestoreRed = useCallback(() => {
    document.documentElement.classList.remove('red-pill-mode');
    setPhase('idle');
  }, []);

  const handleExitFun = useCallback(() => {
    document.documentElement.classList.remove('fun-mode');
    setPhase('idle');
  }, []);

  if (phase === 'idle') return null;

  const overlayActive = phase === 'matrix' || phase === 'choice';

  return (
    <>
      {overlayActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: phase === 'choice' ? 'auto' : 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, display: 'block' }}
          />
          {phase === 'choice' && (
            <div className="konami-overlay">
              <p className="konami-wake">Wake up, Neo&hellip;</p>
              <p className="konami-prompt">Which pill do you choose?</p>
              <div className="konami-pills">
                <button className="konami-pill konami-red" onClick={handleRedPill}>
                  <span className="konami-pill-glyph">💊</span>
                  <strong>Red Pill</strong>
                  <em>Engineer mode</em>
                </button>
                <button className="konami-pill konami-blue" onClick={handleBluePill}>
                  <span className="konami-pill-glyph">💊</span>
                  <strong>Blue Pill</strong>
                  <em>Stay in the dream</em>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Red pill: engineer mode */}
      {phase === 'red' && (
        <>
          <RedPillMode />
          <button
            className="rp-exit-btn"
            onClick={handleRestoreRed}
          >
            ← Exit Engineer Mode
          </button>
        </>
      )}

      {/* Blue pill: fun mode */}
      {phase === 'blue' && (
        <button className="konami-exit-fun" onClick={handleExitFun}>
          Exit Fun Mode ✨
        </button>
      )}
    </>
  );
}
