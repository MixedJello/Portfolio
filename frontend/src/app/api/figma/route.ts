import { NextRequest, NextResponse } from 'next/server';

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

function colorToHex(color: FigmaColor, opacity?: number): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = opacity !== undefined ? opacity : (color.a !== undefined ? color.a : 1);
  if (a < 0.99) {
    return `rgba(${r}, ${g}, ${b}, ${parseFloat(a.toFixed(2))})`;
  }
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function traverseNodes(node: FigmaNode, callback: (node: FigmaNode) => void): void {
  callback(node);
  if (node.children) {
    for (const child of node.children) {
      traverseNodes(child, callback);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fileKey, apiKey } = await req.json();

    if (!fileKey || !apiKey) {
      return NextResponse.json({ error: 'fileKey and apiKey are required' }, { status: 400 });
    }

    const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: { 'X-Figma-Token': apiKey },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Figma API error ${res.status}: ${text}` },
        { status: res.status }
      );
    }

    const figmaFile = await res.json();

    // Find the "Figma API" page
    const figmaApiPage: FigmaNode | undefined = figmaFile.document?.children?.find(
      (page: FigmaNode) => page.name === 'Figma API'
    );

    if (!figmaApiPage) {
      return NextResponse.json(
        { error: 'No page named "Figma API" found in this Figma file.' },
        { status: 404 }
      );
    }

    // Build style ID → { name, styleType } map
    const stylesMap: Record<string, FigmaStyle> = figmaFile.styles ?? {};

    // Collect color values keyed by Figma style name
    const colorsByStyleName: Record<string, string> = {};
    // Collect text styles keyed by Figma style name
    const textStylesByName: Record<string, FigmaTypeStyle> = {};

    traverseNodes(figmaApiPage, (node) => {
      if (!node.styles) return;

      // FILL style
      const fillStyleId = node.styles['fill'] ?? node.styles['fills'];
      if (fillStyleId && stylesMap[fillStyleId]?.styleType === 'FILL') {
        const styleName = stylesMap[fillStyleId].name;
        if (node.fills && node.fills.length > 0) {
          const solidFill = node.fills.find((f) => f.type === 'SOLID' && f.color);
          if (solidFill?.color) {
            colorsByStyleName[styleName] = colorToHex(solidFill.color, solidFill.opacity);
          }
        }
      }

      // TEXT style
      const textStyleId = node.styles['text'];
      if (textStyleId && stylesMap[textStyleId]?.styleType === 'TEXT') {
        const styleName = stylesMap[textStyleId].name;
        if (node.style) {
          textStylesByName[styleName] = node.style;
        }
      }
    });

    return NextResponse.json({
      colors: colorsByStyleName,
      fonts: textStylesByName,
    });
  } catch (err) {
    console.error('Figma API route error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
