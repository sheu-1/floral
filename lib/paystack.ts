// Paystack configuration
export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
}

// Initialize Paystack payment
export const initializePaystackPayment = async (
  email: string,
  amount: number,
  orderId: string,
  callbackUrl: string
) => {
  const response = await fetch('/api/paystack/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects amount in kobo (cents)
      orderId,
      callbackUrl,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to initialize payment')
  }

  return response.json()
}

// Verify Paystack payment
export const verifyPaystackPayment = async (reference: string) => {
  const response = await fetch('/api/paystack/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reference }),
  })

  if (!response.ok) {
    throw new Error('Failed to verify payment')
  }

  return response.json()
}
