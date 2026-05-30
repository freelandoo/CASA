import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('[v0] API Route: Fetching rankings from Railway...')
    
    const base = process.env.RANKING_API_URL ?? 'https://casa-views-ranking-production.up.railway.app'
    const response = await fetch(`${base}/users`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Don't cache the response
    })

    console.log('[v0] API Route: Response status:', response.status)

    if (!response.ok) {
      console.error('[v0] API Route: Error response from Railway API')
      return NextResponse.json(
        { error: 'Failed to fetch rankings', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[v0] API Route: Successfully fetched', data.length, 'users')

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] API Route: Error fetching rankings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
