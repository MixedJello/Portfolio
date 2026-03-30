'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import '@/styles/easter/red-pill.css';

// ─── Philosophical contact text ────────────────────────────────────────────────

const CONTACT_PARAGRAPHS = [
  `I will tell you something about myself. I believed the same story you believe now. I thought confidence was proof of belonging. I thought the ones who truly understood the machines walked without doubt. But when I began to watch closely, I saw the pattern. Engineers everywhere building systems they barely understood in full, speaking with certainty while privately afraid that someone would discover the limits of their knowledge. I realized the system we built rewards the performance of certainty more than truth. So we learn to wear the mask.`,
  `You think your doubt means you are an impostor. That is the lie. Doubt is the natural response to standing in front of something vast. Software grows faster than any single mind can hold. Languages change, tools appear and vanish, frameworks rise and collapse. No one keeps all of it in their head. Yet the system convinces you that a real engineer should. That belief keeps you running in place, always studying, always proving yourself, always afraid to stop.`,
  `Then the machines grew stronger. AI began writing code, explaining problems, answering questions in seconds that once took hours. And many engineers felt something break inside them. If the machine can do this, what am I? But the truth I learned is simple. The machine does not remove the human from the system. It reveals how the system was already working. The tools have always been extensions of the mind. Compilers, debuggers, libraries, search engines. AI is simply the next layer.`,
  `The red pill is this. The confident engineer you believe exists does not exist. Not in the way you imagine. The industry is full of people who learned to keep moving despite uncertainty. They ask questions quietly. They search documentation. They experiment until something works. Then they step back into the room and speak as if they knew all along.`,
  `I know this because I was one of them.`,
  `The prison was never the machines. It was the belief that you must be flawless to belong among them. Once you see that illusion, the fear loses its power. You stop trying to prove you deserve to be there. You simply build, learn, fail, and build again. And when you look around, you begin to see the truth.`,
  `Most of the others are still inside the illusion.`,
];

// ─── Physics Panel ─────────────────────────────────────────────────────────────

function PhysicsPanel() {
  const [gravity, setGravity] = useState(1);
  const [friction, setFriction] = useState(0.1);
  const [bounce, setBounce] = useState(0.6);
  const [stiffness, setStiffness] = useState(0.2);
  const [collapsed, setCollapsed] = useState(false);

  const emit = (key: string, val: number) => {
    window.dispatchEvent(
      new CustomEvent('konami-physics', {
        detail: { key, val },
      })
    );
  };

  const sliders: {
    label: string;
    key: string;
    min: number;
    max: number;
    step: number;
    value: number;
    setter: (v: number) => void;
  }[] = [
    { label: 'Gravity',          key: 'gravity',    min: 0,    max: 3,  step: 0.05, value: gravity,    setter: setGravity },
    { label: 'Friction',         key: 'friction',   min: 0,    max: 1,  step: 0.05, value: friction,   setter: setFriction },
    { label: 'Bounce',           key: 'bounce',     min: 0,    max: 1,  step: 0.05, value: bounce,     setter: setBounce },
    { label: 'Mouse Stiffness',  key: 'stiffness',  min: 0.01, max: 1,  step: 0.05, value: stiffness,  setter: setStiffness },
  ];

  return (
    <div className={`rp-physics-panel${collapsed ? ' rp-physics-collapsed' : ''}`}>
      <div className="rp-panel-header">
        <span className="rp-panel-title">⚙ Physics</span>
        <button className="rp-panel-toggle" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? '▼' : '▲'}
        </button>
      </div>
      {!collapsed && (
        <div className="rp-panel-body">
          {sliders.map(({ label, key, min, max, step, value, setter }) => (
            <div className="rp-slider-row" key={key}>
              <div className="rp-slider-label">
                <span>{label}</span>
                <span className="rp-slider-val">{value.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => {
                  const v = parseFloat(e.target.value);
                  setter(v);
                  emit(key, v);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Inspector (hover + E to open code modal) ─────────────────────────

const INSPECTABLE_IDS = ['AboutMe', 'skills'];

function SectionInspector() {
  const hoveredRef  = useRef<HTMLElement | null>(null);
  const editElRef   = useRef<HTMLElement | null>(null);
  const [hoveredEl, setHoveredEl]   = useState<HTMLElement | null>(null);
  const [editEl,    setEditEl]      = useState<HTMLElement | null>(null);
  const [code,      setCode]        = useState('');
  const [tipPos,    setTipPos]      = useState({ x: 0, y: 0 });

  const openModal = useCallback((el: HTMLElement) => {
    editElRef.current = el;
    setEditEl(el);
    setCode(el.innerHTML);
  }, []);

  const closeModal = useCallback(() => {
    editElRef.current = null;
    setEditEl(null);
  }, []);

  const applyCode = useCallback(() => {
    if (editElRef.current) {
      editElRef.current.innerHTML = code;
    }
    closeModal();
  }, [code, closeModal]);

  useEffect(() => {
    const sections = INSPECTABLE_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const cleanupFns: (() => void)[] = [];

    sections.forEach(section => {
      const onEnter = () => {
        hoveredRef.current = section;
        setHoveredEl(section);
        section.classList.add('rp-hover-target');
      };
      const onLeave = () => {
        hoveredRef.current = null;
        setHoveredEl(null);
        section.classList.remove('rp-hover-target');
      };
      section.addEventListener('mouseenter', onEnter);
      section.addEventListener('mouseleave', onLeave);
      cleanupFns.push(() => {
        section.removeEventListener('mouseenter', onEnter);
        section.removeEventListener('mouseleave', onLeave);
        section.classList.remove('rp-hover-target');
      });
    });

    const onMouseMove = (e: MouseEvent) => setTipPos({ x: e.clientX, y: e.clientY });
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'e' || e.key === 'E') && hoveredRef.current && !editElRef.current) {
        openModal(hoveredRef.current);
      }
      if (e.key === 'Escape' && editElRef.current) {
        closeModal();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKey);

    return () => {
      cleanupFns.forEach(fn => fn());
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [openModal, closeModal]);

  return (
    <>
      {hoveredEl && !editEl && (
        <div
          className="rp-tooltip"
          style={{ left: tipPos.x + 18, top: tipPos.y + 18 }}
        >
          Press <kbd>E</kbd> to inspect &amp; edit
        </div>
      )}

      {editEl && (
        <div className="rp-modal-overlay" role="dialog" aria-modal="true">
          <div className="rp-code-modal">
            <div className="rp-modal-header">
              <span>
                Editing: <code className="rp-modal-id">#{editEl.id}</code>
              </span>
              <button className="rp-modal-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <textarea
              className="rp-code-editor"
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="rp-modal-footer">
              <button className="rp-btn-apply"  onClick={applyCode}>Apply Changes</button>
              <button className="rp-btn-cancel" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Card Drag System ──────────────────────────────────────────────────────────

function CardDragSystem() {
  useEffect(() => {
    // Mark cards as draggable-enabled
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.card-inner'));
    cards.forEach(c => c.classList.add('rp-card-draggable'));

    const onMouseDown = (e: MouseEvent) => {
      // Allow inner card links & buttons to work normally
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) return;

      const card = target.closest('.card-inner') as HTMLElement | null;
      if (!card) return;

      e.preventDefault();

      const rect   = card.getBoundingClientRect();
      const ox     = e.clientX - rect.left;
      const oy     = e.clientY - rect.top;

      // Create ghost clone
      const ghost  = card.cloneNode(true) as HTMLElement;
      ghost.className = 'rp-card-ghost';
      ghost.style.cssText = [
        `position:fixed`,
        `left:${rect.left}px`,
        `top:${rect.top}px`,
        `width:${rect.width}px`,
        `height:${rect.height}px`,
        `z-index:8000`,
        `pointer-events:none`,
        `transform:scale(1.03) rotate(-1deg)`,
        `transition:box-shadow 0.15s ease,transform 0.15s ease`,
      ].join(';');
      document.body.appendChild(ghost);

      // Dim the original in the scroll stack
      card.style.opacity = '0.2';

      const onMove = (ev: MouseEvent) => {
        ghost.style.left = `${ev.clientX - ox}px`;
        ghost.style.top  = `${ev.clientY - oy}px`;
      };

      const onUp = () => {
        // Drop — re-enable pointer events so it can be re-dragged
        ghost.style.pointerEvents = 'auto';
        ghost.style.cursor        = 'grab';
        ghost.style.transform     = '';
        card.style.opacity        = '';
        ghost.classList.add('rp-card-dropped');

        // Make dropped ghost independently draggable
        let gox = 0, goy = 0;
        const ghostDown = (ev: MouseEvent) => {
          ev.preventDefault();
          const gr = ghost.getBoundingClientRect();
          gox = ev.clientX - gr.left;
          goy = ev.clientY - gr.top;
          ghost.style.transform   = 'scale(1.03) rotate(-1deg)';
          ghost.style.transition  = 'none';
          const gMove = (ev: MouseEvent) => {
            ghost.style.left = `${ev.clientX - gox}px`;
            ghost.style.top  = `${ev.clientY - goy}px`;
          };
          const gUp = () => {
            ghost.style.transform  = '';
            ghost.style.transition = '';
            window.removeEventListener('mousemove', gMove);
            window.removeEventListener('mouseup',   gUp);
          };
          window.addEventListener('mousemove', gMove);
          window.addEventListener('mouseup',   gUp);
        };
        ghost.addEventListener('mousedown', ghostDown);

        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup',   onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup',   onUp);
    };

    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      cards.forEach(c => c.classList.remove('rp-card-draggable'));
      document.querySelectorAll('.rp-card-ghost').forEach(el => el.remove());
    };
  }, []);

  return null;
}

// ─── Contact Replacer ──────────────────────────────────────────────────────────

function ContactReplacer() {
  useEffect(() => {
    const section = document.getElementById('contact');
    if (!section) return;

    const original = section.innerHTML;

    const html = `
      <div class="rp-contact-msg mn-w-wd">
        <p class="rp-contact-intro">I will tell you something about myself.</p>
        ${CONTACT_PARAGRAPHS.map(p => `<p>${p}</p>`).join('\n')}
      </div>
    `;

    // Let the current React paint finish before overwriting
    const timer = setTimeout(() => {
      section.innerHTML = html;
    }, 0);

    return () => {
      clearTimeout(timer);
      section.innerHTML = original;
    };
  }, []);

  return null;
}

// ─── Root export ───────────────────────────────────────────────────────────────

export default function RedPillMode() {
  return (
    <>
      <PhysicsPanel />
      <SectionInspector />
      <CardDragSystem />
      <ContactReplacer />
    </>
  );
}
