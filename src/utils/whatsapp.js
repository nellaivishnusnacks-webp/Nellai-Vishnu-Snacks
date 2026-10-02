export const WHATSAPP_NUMBER = '919940419171'

export function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function generalOrderMessage() {
  return "Hello Nellai Vishnu Snacks! I'd like to know more about your snacks and place an order."
}

// The single source of truth for a cart-based WhatsApp order message.
// Every ordering entry point (product card, order slip, nav) routes
// through this instead of building its own message text.
export function orderMessage(items = []) {
  if (!items.length) return generalOrderMessage()

  const allPriced = items.every(({ product }) => typeof product.price === 'number')

  const lines = items.map(({ product, quantity }) => {
    if (typeof product.price === 'number') {
      const subtotal = product.price * quantity
      return `• ${product.name} (${product.weight}) — ₹${product.price} x ${quantity} = ₹${subtotal}`
    }
    return `• ${product.name} (${product.weight}) x ${quantity}`
  })

  const totalLines = allPriced
    ? ['', `Total: ₹${items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)}`]
    : []

  const closing = allPriced
    ? 'Please confirm availability and final total.'
    : 'Please confirm availability and the total amount.'

  return [
    'Hello Nellai Vishnu Snacks!',
    '',
    "I'd like to order:",
    ...lines,
    ...totalLines,
    '',
    closing,
  ].join('\n')
}
