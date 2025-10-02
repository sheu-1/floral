import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CartItem, CheckoutData } from '@/lib/types/database'

export async function POST(request: NextRequest) {
  try {
    const { items, checkoutData, userId }: {
      items: CartItem[]
      checkoutData: CheckoutData
      userId: string
    } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.service.price * item.quantity), 0)

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        total,
        status: 'draft',
        event_date: checkoutData.event_date,
        event_time: checkoutData.event_time,
        venue_address: checkoutData.venue_address,
        venue_contact: checkoutData.venue_contact,
        special_instructions: checkoutData.special_instructions,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      service_id: item.service.id,
      quantity: item.quantity,
      unit_price: item.service.price,
      subtotal: item.service.price * item.quantity,
      customizations: item.customizations || {},
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.service.title,
            description: item.service.short_description || item.service.description,
            images: item.service.images?.slice(0, 1) || [],
          },
          unit_amount: Math.round(item.service.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancelled`,
      metadata: {
        order_id: order.id,
        user_id: userId,
      },
      customer_email: undefined, // Let Stripe collect email
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    })

    // Update order with Stripe session ID
    await supabaseAdmin
      .from('orders')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
