# Checkout Handler Usage Guide

## Overview
The checkout handler is now available at `/api/checkout` and supports two types of checkout flows:

## 1. Static Checkout (GET) - Simple Use Case

Returns JSON with `checkout_url` that you redirect users to.

### Example Usage:
```typescript
// In your React component
const handleCheckout = async () => {
  const response = await fetch('/api/checkout?productId=pdt_xxxxx&quantity=1&metadata_userId=123');
  const { checkout_url } = await response.json();
  window.location.href = checkout_url; // Redirect to checkout
};
```

### Query Parameters:
- **Required:**
  - `productId`: Your product ID (e.g., `pdt_xxxxxxxxxxxxxxxxxxxxx`)

- **Optional:**
  - `quantity`: Number of items
  - Customer fields: `fullName`, `firstName`, `lastName`, `email`, `country`, `addressLine`, `city`, `state`, `zipCode`
  - Disable flags: `disableFullName`, `disableEmail`, etc. (set to `true`)
  - `metadata_*`: Any custom metadata (e.g., `metadata_userId=123`)

### Full Example URL:
```
/api/checkout?productId=pdt_xxxxx&quantity=1&email=user@example.com&metadata_userId=123
```

---

## 2. Checkout Session (POST) - Recommended

More flexible and customizable. Returns JSON with `checkout_url`.

### Example Usage:
```typescript
// In your React component
const handleCheckout = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: 'pdt_xxxxxxxxxxxxxxxxxxxxx',
      quantity: 1,
      customer: {
        email: 'user@example.com',
        full_name: 'John Doe'
      },
      metadata: {
        userId: '123',
        source: 'dashboard'
      }
    })
  });
  
  const { checkout_url } = await response.json();
  window.location.href = checkout_url;
};
```

### Supported Fields:
See the full documentation: https://docs.dodopayments.com/developer-resources/checkout-session

---

## Environment Variables Required

Make sure these are set in your `.env` file:

```bash
DODO_PAYMENTS_API_KEY=your-api-key
DODO_PAYMENTS_ENVIRONMENT=test_mode  # or live_mode
DODO_PAYMENTS_RETURN_URL=http://localhost:3000/dashboard/success
```

---

## Next Steps

1. **Update Product ID**: Replace `pdt_xxxxxxxxxxxxxxxxxxxxx` in your code with your actual product ID
2. **Test the Integration**: Try making a checkout request
3. **Create Success Page**: Create `/app/dashboard/success/page.tsx` for the return URL
4. **Add Error Handling**: Handle failed checkout requests gracefully

### Example Success Page:
```typescript
// app/dashboard/success/page.tsx
export default function CheckoutSuccess() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
    </div>
  );
}
```
