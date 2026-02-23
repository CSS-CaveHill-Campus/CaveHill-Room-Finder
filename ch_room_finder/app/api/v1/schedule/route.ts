import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = process.env.EXTERNAL_API_BASE || 'https://chroomfinduh.onrender.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${EXTERNAL_API_BASE}/schedule${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to handle cold starts better
      signal: AbortSignal.timeout(65000), // 65 seconds to handle cold starts
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Schedule API error:', error);
    return NextResponse.json(
      {
        status: 'failed',
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to fetch schedule',
          type: 'proxy_error',
        },
      },
      { status: 500 }
    );
  }
}
