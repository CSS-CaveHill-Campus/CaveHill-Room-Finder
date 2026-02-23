import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = process.env.EXTERNAL_API_BASE || 'https://chroomfinduh.onrender.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${EXTERNAL_API_BASE}/prefixes${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(65000),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Prefixes API error:', error);
    return NextResponse.json(
      {
        status: 'failed',
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to fetch prefixes',
          type: 'proxy_error',
        },
      },
      { status: 500 }
    );
  }
}
