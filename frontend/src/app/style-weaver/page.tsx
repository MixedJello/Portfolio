'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface FigmaTypeStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  textCase?: string;
  italic?: boolean;
}

interface FigmaData {
  colors: Record<string, string>;
  fonts: Record<string, FigmaTypeStyle>;
}

// ─────────────────────────────────────────────────────────────
// CSS Variable Mappings
// ─────────────────────────────────────────────────────────────

// Colors: [cssVar, figmaStyleName]
const COLOR_MAPPINGS: [string, string][] = [
  ['--buttons',       '--buttons'],
  ['--primary',       '--primary'],
  ['--secondary',     '--secondary'],
  ['--text',          '--text'],
  ['--link',          '--link'],
  ['--main-bg',       '--main-bg'],
  ['--inner-bg',      '--inner-bg'],
  ['--accent-bg',     '--accent'],
  ['--primary-alt',   '--primary-alt'],
  ['--secondary-alt', '--secondary-alt'],
  ['--text-alt',      '--text-alt'],
  ['--link-alt',      '--link-alt'],
  ['--main-bg-alt',   '--main-bg-alt'],
  ['--inner-bg-alt',  '--inner-bg-alt'],
  ['--accent-bg-alt', '--accent-alt'],
];

// Typography style definitions
// figmaName  — name of the Figma TEXT style
// prefix     — CSS variable prefix  (e.g. 'fnt-t-big' → --fnt-t-big-ff, -ls, -w, -tt)
// friendly   — human label used inside /* comments */
// hasTt      — emit --prefix-tt (text-transform)?  default true
// hasFs      — emit --prefix-fs (font-style)?      default false
// altPrefix / altFriendly — emit a second identical block (Button text → btn-v1 AND btn-v2)
interface FontStyleDef {
  figmaName:    string;
  prefix:       string;
  friendly:     string;
  hasTt?:       boolean;
  hasFs?:       boolean;
  altPrefix?:   string;
  altFriendly?: string;
}

const FONT_STYLE_DEFS: FontStyleDef[] = [
  { figmaName: 'Title Big',        prefix: 'fnt-t-big',  friendly: 'Title Big' },
  { figmaName: 'Callout',          prefix: 'fnt-t-co',   friendly: 'Callout' },
  { figmaName: 'Kicker',           prefix: 'fnt-t-k',    friendly: 'Header Kicker' },
  { figmaName: 'Title 1',          prefix: 'fnt-t-1',    friendly: 'Title 1' },
  { figmaName: 'Title 2',          prefix: 'fnt-t-2',    friendly: 'Title 2' },
  { figmaName: 'Title 3',          prefix: 'fnt-t-3',    friendly: 'Title 3' },
  { figmaName: 'Title 4',          prefix: 'fnt-t-4',    friendly: 'Title 4' },
  { figmaName: 'Title 5',          prefix: 'fnt-t-5',    friendly: 'Title 5' },
  { figmaName: 'Title 6',          prefix: 'fnt-t-6',    friendly: 'Title 6' },
  { figmaName: 'Primary Nav Link', prefix: 'fnt-nv-pry', friendly: 'Top Nav Link',        hasFs: true },
  { figmaName: 'Secondary Nav',    prefix: 'fnt-nv-sec', friendly: 'Secondary Nav Link',   hasFs: true },
  { figmaName: 'Quote',            prefix: 'fnt-qte',    friendly: 'Quote',                hasFs: true },
  { figmaName: 'Author Name',      prefix: 'fnt-atr',    friendly: 'Author Name',          hasFs: true },
  { figmaName: 'Phone Number',     prefix: 'fnt-phn',    friendly: 'Phone',                hasTt: false },
  { figmaName: 'Item',             prefix: 'fnt-t-itm',  friendly: 'Item Title' },
  { figmaName: 'Note',             prefix: 'fnt-t-nt',   friendly: 'Note' },
  { figmaName: 'Tag',              prefix: 'tag',         friendly: 'Tag' },
  { figmaName: 'Button text',      prefix: 'btn-v1',     friendly: 'Button V1', altPrefix: 'btn-v2', altFriendly: 'Button V2' },
  { figmaName: 'Form Label',       prefix: 'fnt-frm',    friendly: 'Form Label' },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function parseFileKey(input: string): string {
  const match = input.match(/(?:file|design)\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return input.trim();
}

function textCaseToCSS(tc?: string): string {
  switch (tc) {
    case 'UPPER':      return 'uppercase';
    case 'LOWER':      return 'lowercase';
    case 'TITLE':      return 'capitalize';
    default:           return 'none';
  }
}

// Convert Figma letterSpacing (px) to em, trimming insignificant trailing zeros
function lsToEm(ls: number, fontSize: number): number {
  if (!fontSize) return 0;
  return parseFloat((ls / fontSize).toFixed(4));
}

// Build the min/max/step part of the letter-spacing comment
// Formula: convert em → notional px at 16px base; min = -px, max = px × 3
function lsCommentRange(lsEm: number): string {
  if (lsEm === 0) return 'min: -0.5, max: 0.5, step: .01';
  const px  = lsEm * 16;
  const min = parseFloat((-px).toFixed(2));
  const max = parseFloat((px * 3).toFixed(2));
  return `min: ${min}, max: ${max}, step: .01`;
}

// ─────────────────────────────────────────────────────────────
// CSS Generators
// ─────────────────────────────────────────────────────────────
function generateColorCSS(colors: Record<string, string>): string {
  const lines = COLOR_MAPPINGS.map(([cssVar, figmaName]) => {
    const value = colors[figmaName] ?? '/* not found */';
    return `    ${cssVar}: ${value};`;
  });
  return `:root {\n${lines.join('\n')}\n}`;
}

function generateFontCSS(fonts: Record<string, FigmaTypeStyle>): string {
  // ── Identify the two root font families ──────────────────────────
  const fntTRaw = fonts['Title Big']?.fontFamily ?? '';
  const fntT    = fntTRaw.toLowerCase();

  // Body font: first style whose fontFamily differs from the title font
  let fntM = fntT;
  for (const def of FONT_STYLE_DEFS) {
    const ff = fonts[def.figmaName]?.fontFamily?.toLowerCase();
    if (ff && ff !== fntT) { fntM = ff; break; }
  }

  // Resolve var() reference for a given fontFamily
  const ffVar = (fontFamily?: string) =>
    (fontFamily?.toLowerCase() === fntT) ? 'var(--fnt-t)' : 'var(--fnt-m)';

  // ── Build CSS lines ───────────────────────────────────────────────
  const lines: string[] = [
    `    --fnt-t: "${fntT || 'not found'}", sans-serif;`,
    `    --fnt-m: "${fntM || 'not found'}", sans-serif;`,
  ];

  // Helper: emit one complete block for a single prefix + friendly label
  const emitBlock = (
    prefix: string,
    friendly: string,
    style: FigmaTypeStyle | undefined,
    hasTt: boolean,
    hasFs: boolean,
  ) => {
    lines.push('');
    const lsEm = style ? lsToEm(style.letterSpacing, style.fontSize) : 0;
    const ff   = ffVar(style?.fontFamily);
    const w    = style?.fontWeight ?? 400;
    const tt   = style ? textCaseToCSS(style.textCase) : 'none';
    const fs   = style?.italic ? 'italic' : 'normal';

    lines.push(`    --${prefix}-ff: ${ff}; /* { friendly: '${friendly} Font Family' } */`);
    lines.push(`    --${prefix}-ls: ${lsEm}em; /* { ${lsCommentRange(lsEm)}, friendly: '${friendly} Letter Spacing' } */`);
    lines.push(`    --${prefix}-w: ${w}; /* { friendly: '${friendly} Font Weight' } */`);
    if (hasTt) lines.push(`    --${prefix}-tt: ${tt}; /* { friendly: '${friendly} Case' } */`);
    if (hasFs) lines.push(`    --${prefix}-fs: ${fs}; /* { friendly: '${friendly} Style' } */`);
  };

  for (const def of FONT_STYLE_DEFS) {
    const style  = fonts[def.figmaName];
    const hasTt  = def.hasTt !== false;
    const hasFs  = def.hasFs === true;

    emitBlock(def.prefix, def.friendly, style, hasTt, hasFs);

    // Button text emits a second identical block for btn-v2
    if (def.altPrefix && def.altFriendly) {
      emitBlock(def.altPrefix, def.altFriendly, style, hasTt, hasFs);
    }
  }

  return `:root {\n${lines.join('\n')}\n}`;
}

// ─────────────────────────────────────────────────────────────
// Copy Button
// ─────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-1.5 text-sm font-semibold rounded border transition-all duration-200"
      style={{
        borderColor: copied ? 'var(--secondary, #00ff99)' : 'var(--primary, #00f0ff)',
        color:       copied ? 'var(--secondary, #00ff99)' : 'var(--primary, #00f0ff)',
        background:  'transparent',
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// CSS Output Block
// ─────────────────────────────────────────────────────────────
function CSSBlock({ title, css }: { title: string; css: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-bold uppercase tracking-widest"
          style={{ color: 'var(--primary, #00f0ff)', fontFamily: 'var(--fnt-t, monospace)' }}
        >
          {title}
        </h2>
        <CopyButton text={css} />
      </div>
      <pre
        className="overflow-auto rounded-lg p-4 text-sm leading-relaxed"
        style={{
          background: '#0d0d0d',
          border: '1px solid #2a2a2a',
          color: '#e0e0e0',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          maxHeight: '480px',
          whiteSpace: 'pre',
        }}
      >
        {css}
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function StyleWeaverPage() {
  const [figmaUrl,  setFigmaUrl]  = useState('');
  const [apiKey,    setApiKey]    = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [data,      setData]      = useState<FigmaData | null>(null);

  const colorCSS = data ? generateColorCSS(data.colors) : null;
  const fontCSS  = data ? generateFontCSS(data.fonts)   : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);
    setLoading(true);

    try {
      const fileKey = parseFileKey(figmaUrl);
      const res = await fetch('/figma-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey, apiKey }),
      });

      // Read as text first so a non-JSON body (HTML error page, etc.) gives a useful message
      const text = await res.text();
      let json: Record<string, unknown>;
      try {
        json = JSON.parse(text);
      } catch {
        setError(`Server returned an unexpected response (status ${res.status}):\n${text.slice(0, 400)}`);
        return;
      }

      if (!res.ok) {
        setError((json.error as string) ?? 'Unknown error');
        return;
      }

      setData(json as unknown as FigmaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    padding: '0.6rem 0.875rem',
    fontSize: '0.9375rem',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ background: 'var(--dk-bg, #0a0a0a)', color: '#fff' }}
    >
      <div className="mx-auto max-w-4xl flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-4xl font-bold uppercase tracking-widest"
            style={{
              fontFamily: 'var(--fnt-t, monospace)',
              color: 'var(--primary, #00f0ff)',
            }}
          >
            Style Weaver
          </h1>
          <p style={{ color: '#888', maxWidth: '540px', lineHeight: 1.6 }}>
            Extract colors and typography from a Figma file&apos;s{' '}
            <span style={{ color: '#ccc' }}>&ldquo;Figma API&rdquo;</span> page and generate
            ready-to-paste CSS variable stylesheets.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label style={labelStyle} htmlFor="figma-url">
                Figma File URL or Key
              </label>
              <input
                id="figma-url"
                type="text"
                placeholder="https://www.figma.com/design/AbCdEfGh/..."
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #00f0ff)')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = '#333')}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="api-key">
                Figma Personal Access Token
              </label>
              <input
                id="api-key"
                type="password"
                placeholder="figd_•••••••••••••"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #00f0ff)')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = '#333')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="self-start px-7 py-2.5 font-semibold uppercase tracking-widest rounded transition-all duration-200"
            style={{
              fontFamily:  'var(--fnt-t, monospace)',
              fontSize:    '0.875rem',
              background:  loading ? '#222' : 'transparent',
              border:      '2px solid var(--primary, #00f0ff)',
              color:       loading ? '#555' : 'var(--primary, #00f0ff)',
              cursor:      loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'var(--primary, #00f0ff)';
                e.currentTarget.style.color = '#000';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary, #00f0ff)';
              }
            }}
          >
            {loading ? 'Extracting…' : 'Generate CSS'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg px-5 py-4 text-sm"
            style={{ background: '#1a0a0a', border: '1px solid #7f1d1d', color: '#f87171' }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Stats */}
        {data && (
          <div className="flex gap-6 text-sm" style={{ color: '#555' }}>
            <span>
              <span style={{ color: 'var(--secondary, #00ff99)', fontWeight: 700 }}>
                {Object.keys(data.colors).length}
              </span>{' '}
              color styles found
            </span>
            <span>
              <span style={{ color: 'var(--secondary, #00ff99)', fontWeight: 700 }}>
                {Object.keys(data.fonts).length}
              </span>{' '}
              text styles found
            </span>
          </div>
        )}

        {/* Output */}
        {colorCSS && fontCSS && (
          <div className="flex flex-col gap-10">
            <CSSBlock title="Colors" css={colorCSS} />
            <CSSBlock title="Typography" css={fontCSS} />
          </div>
        )}

        {/* Help */}
        <details
          className="rounded-lg px-5 py-4 text-sm"
          style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', color: '#666' }}
        >
          <summary
            className="cursor-pointer font-semibold"
            style={{ color: '#999', listStyle: 'none' }}
          >
            How does this work?
          </summary>
          <div className="mt-4 flex flex-col gap-3 leading-relaxed" style={{ color: '#666' }}>
            <p>
              Style Weaver calls the Figma REST API using your personal access token and reads
              the local color and text styles from a page named exactly{' '}
              <code style={{ color: '#ccc', background: '#1a1a1a', padding: '1px 5px', borderRadius: '3px' }}>
                Figma API
              </code>{' '}
              inside your file.
            </p>
            <p>
              <strong style={{ color: '#999' }}>Colors</strong> are extracted from FILL styles
              and mapped to the CSS variables defined in the colors template (
              <code style={{ color: '#ccc', background: '#1a1a1a', padding: '1px 5px', borderRadius: '3px' }}>
                --primary
              </code>
              ,{' '}
              <code style={{ color: '#ccc', background: '#1a1a1a', padding: '1px 5px', borderRadius: '3px' }}>
                --secondary
              </code>
              , etc.). Name your Figma color styles with the exact CSS variable name (e.g.{' '}
              <code style={{ color: '#ccc', background: '#1a1a1a', padding: '1px 5px', borderRadius: '3px' }}>
                --primary
              </code>
              ).
            </p>
            <p>
              <strong style={{ color: '#999' }}>Typography</strong> is extracted from TEXT
              styles. Name them exactly:{' '}
              {['Title Big','Callout','Kicker','Title 1–6','Primary Nav Link','Secondary Nav',
                'Quote','Author Name','Phone Number','Item','Note','Tag','Button text','Form Label']
                .map((n) => (
                  <code key={n} style={{ color: '#ccc', background: '#1a1a1a', padding: '1px 5px', borderRadius: '3px', marginRight: '4px', display: 'inline-block', marginBottom: '3px' }}>
                    {n}
                  </code>
                ))}
            </p>
            <p>
              Generate a personal access token at{' '}
              <span style={{ color: '#777' }}>
                figma.com → Settings → Security → Personal access tokens
              </span>
              .
            </p>
          </div>
        </details>

      </div>
    </main>
  );
}
