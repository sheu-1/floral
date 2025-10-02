import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const verificationData = await paystackResponse.json()

    if (!paystackResponse.ok || !verificationData.status) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    const paymentData = verificationData.data

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment was not successful' },
        { status: 400 }
      )
    }

    // Extract order ID from metadata
    const orderId = paymentData.metadata?.order_id

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID not found in payment metadata' },
        { status: 400 }
      )
    }

    // Update order status in Supabase
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        paystack_reference: reference,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }

    // Mark order as confirmed after successful payment
    await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    return NextResponse.json({
      success: true,
      orderId,
      reference,
      amount: paymentData.amount / 100, // Convert from kobo to naira
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
