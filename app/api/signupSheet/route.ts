// app/api/signupSheet/route.ts
import type { NextRequest } from 'next/server';
import { googleSheetsAppend } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    await googleSheetsAppend({ name, email, phone });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error in /api/signupSheet', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
