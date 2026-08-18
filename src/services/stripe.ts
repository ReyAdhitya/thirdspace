/**
 * Stripe test/demo checkout. No live keys required.
 * If EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing, we simulate success.
 */
export function stripeMode(): 'simulate' | 'test-key-present' {
  return process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? 'test-key-present'
    : 'simulate';
}

export async function simulateCheckout(cardNumber: string): Promise<void> {
  const digits = cardNumber.replace(/\s/g, '');
  await new Promise((r) => setTimeout(r, 500));
  if (digits && digits !== '4242424242424242' && !digits.startsWith('4242')) {
    throw new Error('測試卡請用 4242 開頭');
  }
}
