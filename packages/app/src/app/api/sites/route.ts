import { NextRequest, NextResponse } from 'next/server';
import { WeddingData } from '@/lib/types';

// In-memory storage for demo purposes - in production use a database
const siteStorage: Record<string, WeddingData> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');

  if (!siteId) {
    return NextResponse.json({ error: 'Site ID required' }, { status: 400 });
  }

  const siteData = siteStorage[siteId];

  if (!siteData) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  return NextResponse.json(siteData);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, data }: { siteId: string; data: WeddingData } = body;

    if (!siteId || !data) {
      return NextResponse.json({ error: 'Site ID and data required' }, { status: 400 });
    }

    siteStorage[siteId] = data;

    return NextResponse.json({ success: true, message: 'Site saved successfully' });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}