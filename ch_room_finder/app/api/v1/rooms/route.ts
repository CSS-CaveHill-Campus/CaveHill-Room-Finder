import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'https://chroomfinduh.onrender.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const url = `${EXTERNAL_API_BASE}/rooms`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(65000),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Rooms API error:', error);
    return NextResponse.json(
      {
        status: 'failed',
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to fetch rooms',
          type: 'proxy_error',
        },
      },
      { status: 500 }
    );
  }
}
