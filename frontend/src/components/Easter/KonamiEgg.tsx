'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import '@/styles/easter/konami.css';
import '@/styles/easter/fun-mode.css';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<string[]>([]);
  const animFrameRef = useRef<number>(0);
  const storedStylesRef = useRef<Element[]>([]);

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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const cols = Math.floor(canvas.width / fontSize);
    const rows = Math.floor(canvas.height / fontSize);

    // Start columns at random negative positions so they stagger in
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -rows));
    const colDone = new Array<boolean>(cols).fill(false);
    let doneCols = 0;
    const doneThreshold = Math.floor(cols * 0.92);

    const tick = () => {
      // Semi-transparent black to create trail fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        if (colDone[i]) return;
        const xPx = i * fontSize;
        const yPx = y * fontSize;

        // Leading character — bright white
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.fillText(
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          xPx,
          yPx
        );

        // Green trail above
        ctx.font = `${fontSize}px monospace`;
        for (let t = 1; t <= 8; t++) {
          const trailYPx = (y - t) * fontSize;
          if (trailYPx < 0) break;
          ctx.globalAlpha = Math.max(0, 1 - t * 0.13);
          ctx.fillStyle = t <= 2 ? '#88ffaa' : '#00ff41';
          ctx.fillText(
            MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
            xPx,
            trailYPx
          );
        }
        ctx.globalAlpha = 1;

        drops[i]++;

        // Mark column done once head exits bottom, with random chance for stagger
        if (!colDone[i] && yPx > canvas.height && Math.random() > 0.975) {
          colDone[i] = true;
          doneCols++;
        }
      });

      if (doneCols < doneThreshold) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // Darken to near-black before showing pills
        ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setPhase('choice');
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase]);

  const handleRedPill = useCallback(() => {
    // Store every stylesheet and style tag, then remove them
    const styles = Array.from(
      document.querySelectorAll<Element>('link[rel="stylesheet"], style')
    );
    storedStylesRef.current = styles;
    styles.forEach((el) => el.parentNode?.removeChild(el));
    setPhase('red');
  }, []);

  const handleBluePill = useCallback(() => {
    document.documentElement.classList.add('fun-mode');
    setPhase('blue');
  }, []);

  const handleRestore = useCallback(() => {
    storedStylesRef.current.forEach((el) => document.head.appendChild(el));
    storedStylesRef.current = [];
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
                  <em>See the bare truth</em>
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

      {/* Red pill: all CSS stripped — restore button uses only inline styles */}
      {phase === 'red' && (
        <button
          onClick={handleRestore}
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: 9999,
            background: '#cc0000',
            color: '#fff',
            border: '2px solid #ff4444',
            padding: '0.5rem 1.1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
          }}
        >
          ← Restore Site
        </button>
      )}

      {/* Blue pill: fun mode active — exit button */}
      {phase === 'blue' && (
        <button className="konami-exit-fun" onClick={handleExitFun}>
          Exit Fun Mode ✨
        </button>
      )}
    </>
  );
}
