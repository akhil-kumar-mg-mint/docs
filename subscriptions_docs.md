# UPI Intent Subscription API Documentation

## Create UPI Subscription with Intent Flow

This API endpoint creates a UPI subscription mandate using the Intent flow. The Intent flow allows customers to approve the mandate by scanning a QR code or using a UPI payment link, without requiring their VPA (Virtual Payment Address) upfront.

### Endpoint

```
POST /pg/subscriptions/
```

### Authentication

This endpoint requires API key authentication. Include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```

### Request Body

The request body follows the same structure as the regular order creation endpoint, with additional `standing_instruction` data for subscription configuration.

#### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `amount` | string | Order amount in decimal format (must be ≤ billing_amount) | `"1000.00"` |
| `currency` | string | ISO 4217 currency code | `"INR"` |
| `buyer_name` | string | Customer's full name | `"John Doe"` |
| `buyer_email` | string | Customer's email address | `"john.doe@example.com"` |
| `buyer_phone` | string | Customer's phone number (10 digits) | `"9876543210"` |
| `collection_mode` | string | Must be `"s2s"` for subscriptions | `"s2s"` |
| `preferred_mop_type` | string | Must be `"UPI"` for subscriptions | `"UPI"` |
| `preferred_upi_flow_type` | string | Must be `"INTENT"` for Intent flow | `"INTENT"` |
| `standing_instruction` | object | Standing instruction configuration (see below) | See below |

#### Standing Instruction Object

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `billing_amount` | string | Yes | Amount to be charged per billing cycle (decimal format) | `"1000.00"` |
| `billing_currency` | string | Yes | ISO 4217 currency code | `"INR"` |
| `billing_cycle` | string | Yes | Billing frequency: `ONCE`, `ADHOC`, `DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY` | `"MONTHLY"` |
| `billing_interval` | integer | Yes | Frequency multiplier (min: 1) | `1` |
| `payment_start_date` | string | Yes | Start date for recurring payments (YYYY-MM-DD) | `"2024-01-01"` |
| `payment_end_date` | string | Yes | End date for recurring payments (YYYY-MM-DD) | `"2024-12-31"` |
| `billing_date` | integer | No | Day of month/week for billing (1-31 for monthly/yearly, 1-7 for weekly) | `15` |
| `billing_limit` | string | No | Debit period: `ON`, `BEFORE`, `AFTER` (default: `AFTER`) | `"AFTER"` |
| `billing_rule` | string | No | Amount limitation: `MAX`, `EXACT` (default: `MAX`) | `"MAX"` |
| `remarks` | string | No | Additional remarks (max 50 characters) | `"Monthly subscription"` |

#### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `reference_id` | string | Merchant's reference ID for the order | `"ORD-12345"` |
| `return_url` | string | URL to redirect after payment completion | `"https://example.com/return"` |
| `description` | string | Order description | `"Monthly subscription payment"` |

### Request Example

```json
{
  "amount": "1000.00",
  "currency": "INR",
  "buyer_name": "John Doe",
  "buyer_email": "john.doe@example.com",
  "buyer_phone": "9876543210",
  "collection_mode": "s2s",
  "preferred_mop_type": "UPI",
  "preferred_upi_flow_type": "INTENT",
  "reference_id": "ORD-2024-001",
  "return_url": "https://example.com/return",
  "description": "Monthly subscription payment",
  "standing_instruction": {
    "billing_amount": "1000.00",
    "billing_currency": "INR",
    "billing_cycle": "MONTHLY",
    "billing_interval": 1,
    "payment_start_date": "2024-01-01",
    "payment_end_date": "2024-12-31",
    "billing_date": 15,
    "billing_limit": "AFTER",
    "billing_rule": "MAX",
    "remarks": "Monthly subscription"
  }
}
```

### Response

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "UPI Subscription created successfully",
  "data": {
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "subscription_id": "660e8400-e29b-41d4-a716-446655440001",
    "subscription_type": "UPI_RECURRING",
    "payment_link": "pa=merchant@payu&pn=Merchant%20Name&am=1000.00&cu=INR&tn=Order%20Description&tr=ORD-2024-001",
    "qr_code": {
      "url": "upi://pay?pa=merchant@payu&pn=Merchant%20Name&am=1000.00&cu=INR&tn=Order%20Description&tr=ORD-2024-001",
      "base64": "iVBORw0KGgoAAAANSUhEUgAA..."
    },
    "subscription": {
      "billing_cycle": "MONTHLY",
      "billing_interval": 1,
      "payment_start_date": "2024-01-01",
      "payment_end_date": "2024-12-31",
      "status": "PENDING"
    }
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `message` | string | Human-readable success message |
| `data.order_id` | string | Unique identifier for the created order |
| `data.subscription_id` | string | Unique identifier for the created subscription |
| `data.subscription_type` | string | Always `"UPI_RECURRING"` for subscriptions |
| `data.payment_link` | string | UPI Intent URI for mandate approval (QR code or payment link) |
| `data.qr_code.url` | string | Full UPI URL for QR code scanning |
| `data.qr_code.base64` | string | Base64-encoded QR code image (PNG format) |
| `data.subscription.billing_cycle` | string | Billing cycle frequency |
| `data.subscription.billing_interval` | integer | Billing interval multiplier |
| `data.subscription.payment_start_date` | string | Start date for recurring payments (ISO format) |
| `data.subscription.payment_end_date` | string | End date for recurring payments (ISO format) |
| `data.subscription.status` | string | Subscription status (`PENDING`, `ACTIVE`, `FAILED`) |

### Error Responses

#### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "error": "PAYMENT_GATEWAY_ORDER_VALIDATION_ERROR",
  "error_details": {
    "upi_flow_type": ["Subscriptions only support COLLECTION or INTENT UPI flow"],
    "amount": ["Amount must be less than or equal to billing_amount"]
  }
}
```

#### 400 Bad Request - Missing Required Fields

```json
{
  "success": false,
  "error": "PAYMENT_GATEWAY_ORDER_VALIDATION_ERROR",
  "error_details": {
    "standing_instruction": ["This field is required."],
    "billing_amount": ["This field is required."]
  }
}
```

#### 400 Bad Request - Invalid Date Range

```json
{
  "success": false,
  "error": "PAYMENT_GATEWAY_ORDER_VALIDATION_ERROR",
  "error_details": {
    "payment_end_date": ["Payment end date must be after payment start date"]
  }
}
```

#### 500 Internal Server Error - Configuration Error

```json
{
  "success": false,
  "error": "PAYMENT_GATEWAY_ERROR",
  "error_details": {
    "subscription": ["S2S UPI subscription INTENT flow is not supported for Pay10"]
  }
}
```

#### 503 Service Unavailable - Gateway Error

```json
{
  "success": false,
  "error": "PAYMENT_GATEWAY_API_ERROR",
  "error_details": {
    "payment": ["Failed to create S2S UPI Subscription Intent Request"]
  }
}
```

### Status Flow

1. **PENDING**: Initial status when subscription is created. The mandate is not yet approved.
2. **ACTIVE**: Status after successful mandate approval via callback/webhook.
3. **FAILED**: Status if mandate creation fails or is rejected.

### Integration Flow

1. **Create Subscription**: Call this API endpoint with subscription details.
2. **Display QR Code**: Show the QR code (`data.qr_code.base64`) or payment link (`data.payment_link`) to the customer.
3. **Customer Approval**: Customer scans QR code or uses payment link to approve the mandate.
4. **Callback Processing**: The payment gateway sends a callback to your configured callback URL.
5. **Status Update**: Subscription status changes from `PENDING` to `ACTIVE` or `FAILED` based on callback result.

### QR Code Display

The response includes a base64-encoded QR code image that can be displayed directly:

```html
<img src="data:image/png;base64,{data.qr_code.base64}" alt="UPI Payment QR Code" />
```

Alternatively, you can use the `payment_link` to generate a QR code client-side or use the provided `qr_code.url` for UPI app deep linking.

### Payment Link Usage

The `payment_link` can be used in two ways:

1. **QR Code**: Convert to QR code for scanning
2. **Deep Link**: Use as UPI deep link: `upi://pay?{payment_link}`

### Important Notes

1. **VPA Not Required**: Unlike Collection flow, Intent flow does not require the customer's VPA upfront.
2. **Mandate Approval**: The subscription mandate must be approved by the customer before recurring payments can be initiated.
3. **Status Monitoring**: Monitor subscription status via the subscription details endpoint or webhooks.
4. **Amount Validation**: The order `amount` must be less than or equal to `billing_amount` in standing instructions.
5. **Date Validation**: `payment_end_date` must be after `payment_start_date`.
6. **Billing Date Rules**:
   - For `WEEKLY` cycle: `billing_date` must be 1-7 (Monday-Sunday)
   - For `MONTHLY`/`YEARLY` cycle: `billing_date` must be 1-31
7. **Gateway Support**: Currently, only PayU gateway supports UPI Intent subscription flow.

### cURL Example

```bash
curl -X POST "https://api.example.com/pg/subscriptions/" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "1000.00",
    "currency": "INR",
    "buyer_name": "John Doe",
    "buyer_email": "john.doe@example.com",
    "buyer_phone": "9876543210",
    "collection_mode": "s2s",
    "preferred_mop_type": "UPI",
    "preferred_upi_flow_type": "INTENT",
    "reference_id": "ORD-2024-001",
    "return_url": "https://example.com/return",
    "description": "Monthly subscription payment",
    "standing_instruction": {
      "billing_amount": "1000.00",
      "billing_currency": "INR",
      "billing_cycle": "MONTHLY",
      "billing_interval": 1,
      "payment_start_date": "2024-01-01",
      "payment_end_date": "2024-12-31",
      "billing_date": 15,
      "billing_limit": "AFTER",
      "billing_rule": "MAX",
      "remarks": "Monthly subscription"
    }
  }'
```

### Related Endpoints

- **Get Subscription Details**: `GET /pg/subscriptions/{subscription_id}/`
- **Check Mandate Status**: `POST /pg/subscriptions/{subscription_id}/mandate_status/`
- **Modify Mandate**: `POST /pg/subscriptions/{subscription_id}/modify_mandate/`
- **Cancel Mandate**: `POST /pg/subscriptions/{subscription_id}/cancel_mandate/`
- **Pre-Debit Notification**: `POST /pg/subscriptions/{subscription_id}/pre_debit_notification/`

