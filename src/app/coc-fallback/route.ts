export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Resolve from project root to the asset under src/assets/data/
    const filePath = path.join(process.cwd(), 'src', 'assets', 'data', 'file-sample_150kB.pdf');
    const data = await readFile(filePath);
    return new Response(data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Fallback PDF not found' }, { status: 404 });
  }
}
