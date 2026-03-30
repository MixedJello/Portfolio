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

// Typography: Figma style name → CSS variable prefix (or multiple prefixes)
const FONT_MAPPINGS: [string, string | string[]][] = [
  ['Title Big',        'fnt-t-big'],
  ['Callout',          'fnt-t-co'],
  ['Kicker',           'fnt-t-k'],
  ['Title 1',          'fnt-t-1'],
  ['Title 2',          'fnt-t-2'],
  ['Title 3',          'fnt-t-3'],
  ['Title 4',          'fnt-t-4'],
  ['Title 5',          'fnt-t-5'],
  ['Title 6',          'fnt-t-6'],
  ['Primary Nav Link', 'fnt-nv-pry'],
  ['Secondary Nav',    'fnt-nv-sec'],
  ['Quote',            'fnt-qte'],
  ['Author Name',      'fnt-atr'],
  ['Phone Number',     'fnt-phn'],
  ['Item',             'fnt-t-itm'],
  ['Note',             'fnt-t-nt'],
  ['Tag',              'tag'],
  ['Button text',      ['btn-v1', 'btn-v2']],
  ['Form Label',       'fnt-frm'],
];

// Which variable prefixes include a font-style (fs) property
const HAS_FONT_STYLE = new Set([
  'fnt-nv-pry', 'fnt-nv-sec', 'fnt-qte', 'fnt-atr',
]);

// Which variable prefixes omit the text-transform (tt) property
const NO_TEXT_TRANSFORM = new Set(['fnt-phn']);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function parseFileKey(input: string): string {
  const match = input.match(/(?:file|design)\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  // If no URL pattern, assume it's already a key
  return input.trim();
}

function textCaseToCSS(tc?: string): string {
  switch (tc) {
    case 'UPPER':       return 'uppercase';
    case 'LOWER':       return 'lowercase';
    case 'TITLE':       return 'capitalize';
    case 'SMALL_CAPS':  return 'none';
    default:            return 'none';
  }
}

function letterSpacingToEm(ls: number, fontSize: number): string {
  if (!fontSize || fontSize === 0) return '0';
  return (ls / fontSize).toFixed(4);
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
  // Determine --fnt-t and --fnt-m
  const titleBig = fonts['Title Big'];
  const paragraph = fonts['Paragraph'] ?? fonts['Body'] ?? fonts['Note'];
  const fntT = titleBig?.fontFamily ?? '/* not found */';

  // Pick a body font: first style whose fontFamily differs from fntT, else same
  let fntM = fntT;
  if (paragraph?.fontFamily) {
    fntM = paragraph.fontFamily;
  } else {
    for (const [name] of FONT_MAPPINGS) {
      const style = fonts[name];
      if (style && style.fontFamily && style.fontFamily !== fntT) {
        fntM = style.fontFamily;
        break;
      }
    }
  }

  const lines: string[] = [
    `    --fnt-t: "${fntT}", sans-serif;`,
    `    --fnt-m: "${fntM}", sans-serif;`,
    '',
  ];

  for (const [figmaName, prefixOrPrefixes] of FONT_MAPPINGS) {
    const style = fonts[figmaName];
    const prefixes = Array.isArray(prefixOrPrefixes) ? prefixOrPrefixes : [prefixOrPrefixes];

    for (const prefix of prefixes) {
      const ff  = style?.fontFamily   ?? '/* not found */';
      const ls  = style ? letterSpacingToEm(style.letterSpacing, style.fontSize) : '0';
      const w   = style?.fontWeight   ?? '/* not found */';
      const tt  = style ? textCaseToCSS(style.textCase) : '/* not found */';
      const fs  = style?.italic ? 'italic' : 'normal';

      lines.push(`    --${prefix}-ff: ${ff};`);
      lines.push(`    --${prefix}-ls: ${ls}em;`);
      lines.push(`    --${prefix}-w: ${w};`);

      if (!NO_TEXT_TRANSFORM.has(prefix)) {
        lines.push(`    --${prefix}-tt: ${tt};`);
      }

      if (HAS_FONT_STYLE.has(prefix)) {
        lines.push(`    --${prefix}-fs: ${fs};`);
      }

      lines.push('');
    }
  }

  // Remove trailing blank line
  while (lines[lines.length - 1] === '') lines.pop();

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
      const res = await fetch('/api/figma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey, apiKey }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Unknown error');
        return;
      }

      setData(json);
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
