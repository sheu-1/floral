// This route has been replaced by /api/orders and Paystack integration
// Keeping this file for backward compatibility, but it's no longer used

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Use /api/orders instead.' },
    { status: 410 }
  )
}
