import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface FigmaPaint {
  type: string;
  color?: FigmaColor;
  opacity?: number;
}

interface FigmaTypeStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  textCase?: string;
  italic?: boolean;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  styles?: Record<string, string>;
  fills?: FigmaPaint[];
  style?: FigmaTypeStyle;
  children?: FigmaNode[];
}

interface FigmaStyle {
  key: string;
  name: string;
  description: string;
  remote: boolean;
  styleType: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function colorToHex(color: FigmaColor, opacity?: number): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = opacity !== undefined ? opacity : (color.a !== undefined ? color.a : 1);
  if (a < 0.99) {
    return `rgba(${r}, ${g}, ${b}, ${parseFloat(a.toFixed(2))})`;
  }
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  ).toUpperCase();
}

/** Iterative BFS — avoids call-stack overflow on deep trees */
function collectNodes(root: FigmaNode): FigmaNode[] {
  const result: FigmaNode[] = [];
  const queue: FigmaNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift() as FigmaNode;
    result.push(node);
    if (node.children) {
      for (const child of node.children) queue.push(child);
    }
  }
  return result;
}

async function figmaFetch(path: string, apiKey: string) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': apiKey },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Figma returned non-JSON (status ${res.status}): ${text.slice(0, 200)}`);
  }
}

// ─────────────────────────────────────────────────────────────
// Route
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileKey, apiKey } = body as { fileKey: string; apiKey: string };

    if (!fileKey || !apiKey) {
      return NextResponse.json({ error: 'fileKey and apiKey are required.' }, { status: 400 });
    }

    // ── Step 1: Fetch file at depth=1 (pages only) to locate "Figma API" page ──
    const fileData = await figmaFetch(`/files/${fileKey}?depth=1`, apiKey);

    const pages: FigmaNode[] = fileData.document?.children ?? [];
    const figmaApiPage = pages.find((p: FigmaNode) => p.name === 'Figma API');

    if (!figmaApiPage) {
      const pageNames = pages.map((p: FigmaNode) => `"${p.name}"`).join(', ');
      return NextResponse.json(
        {
          error: `No page named "Figma API" found in this file. Pages found: ${pageNames || '(none)'}`,
        },
        { status: 404 }
      );
    }

    // Styles map lives at the file level regardless of depth
    const stylesMap: Record<string, FigmaStyle> = fileData.styles ?? {};

    // ── Step 2: Fetch only the nodes of the "Figma API" page ──
    const encodedId = encodeURIComponent(figmaApiPage.id);
    const nodesData = await figmaFetch(`/files/${fileKey}/nodes?ids=${encodedId}`, apiKey);

    const pageNodeEntry = nodesData.nodes?.[figmaApiPage.id];
    const pageDocument: FigmaNode | undefined = pageNodeEntry?.document;

    if (!pageDocument) {
      return NextResponse.json(
        { error: 'Could not retrieve nodes for the "Figma API" page.' },
        { status: 500 }
      );
    }

    // Merge styles from the nodes response (may include remote library styles)
    const nodeStyles: Record<string, FigmaStyle> = pageNodeEntry?.styles ?? {};
    Object.assign(stylesMap, nodeStyles);

    // ── Step 3: Traverse nodes, collect colors and text styles ──
    const colorsByStyleName: Record<string, string> = {};
    const textStylesByName: Record<string, FigmaTypeStyle> = {};

    const allNodes = collectNodes(pageDocument);
    for (const node of allNodes) {
      if (!node.styles) continue;

      // FILL style
      const fillStyleId = node.styles['fill'] ?? node.styles['fills'];
      if (fillStyleId && stylesMap[fillStyleId]?.styleType === 'FILL') {
        const styleName = stylesMap[fillStyleId].name;
        if (!colorsByStyleName[styleName] && node.fills) {
          const solid = node.fills.find((f) => f.type === 'SOLID' && f.color);
          if (solid?.color) {
            colorsByStyleName[styleName] = colorToHex(solid.color, solid.opacity);
          }
        }
      }

      // TEXT style
      const textStyleId = node.styles['text'];
      if (textStyleId && stylesMap[textStyleId]?.styleType === 'TEXT') {
        const styleName = stylesMap[textStyleId].name;
        if (!textStylesByName[styleName] && node.style) {
          textStylesByName[styleName] = node.style;
        }
      }
    }

    return NextResponse.json({
      colors: colorsByStyleName,
      fonts: textStylesByName,
    });
  } catch (err) {
    console.error('[figma route]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
