import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.7.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log(`Received webhook: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get order ID from metadata
        const orderId = session.metadata?.order_id
        if (!orderId) {
          console.error('No order ID in session metadata')
          return new Response('No order ID', { status: 400 })
        }

        // Update order status to paid
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Error updating order:', updateError)
          return new Response('Database error', { status: 500 })
        }

        console.log(`Order ${orderId} marked as paid`)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Find order by payment intent ID
        const { data: orders, error: findError } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (findError || !orders || orders.length === 0) {
          console.error('Order not found for payment intent:', paymentIntent.id)
          return new Response('Order not found', { status: 404 })
        }

        // Update order status to confirmed
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('id', orders[0].id)

        if (updateError) {
          console.error('Error updating order status:', updateError)
          return new Response('Database error', { status: 500 })
        }

        console.log(`Order ${orders[0].id} confirmed`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Find order by payment intent ID
        const { data: orders, error: findError } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (findError || !orders || orders.length === 0) {
          console.error('Order not found for payment intent:', paymentIntent.id)
          return new Response('Order not found', { status: 404 })
        }

        // Update order status to cancelled
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orders[0].id)

        if (updateError) {
          console.error('Error updating order status:', updateError)
          return new Response('Database error', { status: 500 })
        }

        console.log(`Order ${orders[0].id} cancelled due to payment failure`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('Webhook processed', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 400 })
  }
})
