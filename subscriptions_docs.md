## UPI Subscription APIs (Partner API)

This document describes the UPI subscription endpoints in `PGSubscriptionAPIViewSet`. You can use it as a source for Mintlify or other external API documentation.

---

### Create UPI Subscription

- **Method**: `POST`  
- **Path**: `/partner-api/subscriptions/`  
- **Operation ID**: `create_subscription`  
- **Description**:  
  Create a new UPI subscription order with standing instructions (SI). This accepts the same input as the S2S UPI order create API, plus a `standing_instruction` block describing the subscription schedule.

#### Request

- **Headers**
  - `Authorization`: `Bearer <access_token>` (or other scheme configured for Partner API)
  - `Content-Type`: `application/json`

- **Body**

```json
{
  "amount": "1000.00",
  "currency": "INR",
  "reference_id": "SUB-ORDER-001",
  "preferred_mop_type": "UPI",
  "preferred_collection_mode": "S2S",
  "preferred_upi_flow_type": "COLLECTION",
  "buyer_name": "John Doe",
  "buyer_email": "john@example.com",
  "buyer_phone": "+911234567890",
  "... other S2S UPI order fields ...": "…",

  "standing_instruction": {
    "billing_amount": "1000.00",
    "billing_currency": "INR",
    "billing_cycle": "MONTHLY",
    "billing_interval": 1,
    "payment_start_date": "2025-01-01",
    "payment_end_date": "2025-12-31",
    "billing_date": 5,
    "billing_limit": "AFTER",
    "billing_rule": "MAX",
    "remarks": "Subscription for plan X",
    "status": "ACTIVE"
  }
}
```

#### Success Response (201)

```json
{
  "success": true,
  "message": "UPI Subscription created successfully",
  "data": {
    "order_id": "ORD_xxx",
    "subscription_type": "UPI_RECURRING",
    "payment_link": "upi://pay?...",
    "acstemplate": "<html ...>",
    "subscription_id": "SUB_xxx",
    "subscription": {
      "billing_cycle": "MONTHLY",
      "billing_interval": 1,
      "payment_start_date": "2025-01-01",
      "payment_end_date": "2025-12-31",
      "status": "ACTIVE"
    }
  }
}
```

#### Error Responses

- **400 – Validation / business errors**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_ORDER_VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field_name": "Error description"
    }
  }
}
```

- **500 – Internal / configuration error**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_ERROR",
    "message": "Payment gateway error",
    "details": {
      "error": "An unexpected error occurred. Please try again later"
    }
  }
}
```

- **503 – PayU upstream failure**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_API_ERROR",
    "message": "Payment gateway API unavailable",
    "details": {
      "message": "Failed to call PayU"
    }
  }
}
```

---

### Get Subscription Order Details

- **Method**: `GET`  
- **Path**: `/partner-api/subscriptions/{uid}/`  
- **Operation ID**: `get_subscription`  
- **Description**:  
  Retrieve order-level details for a subscription by subscription UID.

#### Path Parameters

- `uid` (string, required): Subscription UID.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Subscription order fetched successfully",
  "data": {
    "order_id": "ORD_xxx",
    "reference_id": "REF-123",
    "amount": "1000.00",
    "currency": "INR",
    "status": "PAYMENT_PENDING",
    "subscription_type": "UPI_RECURRING"
  }
}
```

#### Error Responses

- **404 – Not found**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_ORDER_NOT_FOUND",
    "message": "Order not found",
    "details": {
      "order_id": "Subscription order not found"
    }
  }
}
```

---

### Get Subscription Mandate Status

- **Method**: `GET`  
- **Path**: `/partner-api/subscriptions/{uid}/mandate_status/`  
- **Operation ID**: `get_subscription_mandate_status`  
- **Description**:  
  Call PayU “Get UPI Mandate Status” for this subscription and return a minimized status.

#### Path Parameters

- `uid` (string, required): Subscription UID.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Subscription mandate status fetched successfully",
  "data": {
    "subscription_id": "SUB_xxx",
    "mandate_is_active": true
  }
}
```

#### Error Responses

- **400 – Business validation (e.g. mandate not yet created)**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_VALIDATION_ERROR",
    "message": "Validation error",
    "details": {
      "non_field_errors": "Subscription mandate not yet created. auth_payu_id is required for mandate status check."
    }
  }
}
```

- **503 – PayU API error**: `PAYMENT_GATEWAY_API_ERROR`  
- **500 – Configuration / unexpected**: `PAYMENT_GATEWAY_ERROR`

---

### Modify Subscription Mandate

- **Method**: `POST`  
- **Path**: `/partner-api/subscriptions/{uid}/modify_mandate/`  
- **Operation ID**: `modify_subscription_mandate`  
- **Description**:  
  Update mandate amount and/or end date via PayU’s “Modify Recurring Payment for UPI” API and sync the local subscription.

#### Path Parameters

- `uid` (string, required): Subscription UID.

#### Request Body

At least one of `amount` or `end_date` must be provided.

```json
{
  "amount": 1500.00,
  "end_date": "2025-12-31"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Subscription mandate modification request sent successfully",
  "data": {
    "subscription_id": "SUB_xxx",
    "mandate_modified": true,
    "updated_amount": "1500.00",
    "updated_end_date": "2025-12-31"
  }
}
```

#### Error Responses

- **400 – Validation / business**

Example 1 – missing both amount and end_date:

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_ORDER_VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "non_field_errors": [
        "Either amount or end_date must be provided to modify mandate"
      ]
    }
  }
}
```

Example 2 – mandate not yet created:

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_VALIDATION_ERROR",
    "message": "Validation error",
    "details": {
      "non_field_errors": "Subscription mandate not yet created. auth_payu_id is required to modify mandate."
    }
  }
}
```

- **503 – PayU API error**: `PAYMENT_GATEWAY_API_ERROR`  
- **500 – Configuration error**: `PAYMENT_GATEWAY_ERROR`

---

### Cancel Subscription Mandate

- **Method**: `POST`  
- **Path**: `/partner-api/subscriptions/{uid}/cancel_mandate/`  
- **Operation ID**: `cancel_subscription_mandate`  
- **Description**:  
  Cancel a UPI subscription mandate via PayU’s “Cancel Recurring Payment for UPI” API, and mark the subscription as `CANCELLED` on success.

#### Path Parameters

- `uid` (string, required): Subscription UID.

#### Request Body

- None.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Subscription mandate cancel request sent successfully",
  "data": {
    "subscription_id": "SUB_xxx",
    "mandate_cancelled": true,
    "subscription_status": "CANCELLED"
  }
}
```

#### Error Responses

- **400 – Business validation**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_VALIDATION_ERROR",
    "message": "Validation error",
    "details": {
      "non_field_errors": "Subscription mandate not yet created. auth_payu_id is required to cancel mandate."
    }
  }
}
```

- **503 – PayU API error**: `PAYMENT_GATEWAY_API_ERROR`  
- **500 – Configuration / unexpected**: `PAYMENT_GATEWAY_ERROR`

---

### Send Pre-Debit Notification

- **Method**: `POST`  
- **Path**: `/partner-api/subscriptions/{uid}/pre_debit_notification/`  
- **Operation ID**: `send_subscription_pre_debit_notification`  
- **Description**:  
  Trigger PayU’s Pre-Debit Notification API for an upcoming debit. Before sending, the service verifies that the mandate is still active.

#### Path Parameters

- `uid` (string, required): Subscription UID.

#### Request Body

```json
{
  "debit_date": "2025-06-10",
  "amount": 1000.00
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Pre-debit notification triggered successfully",
  "data": {
    "subscription_id": "SUB_xxx",
    "debit_date": "2025-06-10",
    "amount": "1000.00",
    "notification_sent": true
  }
}
```

#### Error Responses

- **400 – Validation / business**

Example – mandate not active:

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_VALIDATION_ERROR",
    "message": "Validation error",
    "details": {
      "non_field_errors": "Subscription mandate is not active"
    }
  }
}
```

- **503 – PayU API error**: `PAYMENT_GATEWAY_API_ERROR`  
- **500 – Configuration / unexpected**: `PAYMENT_GATEWAY_ERROR`

---

### Trigger Recurring Payment

- **Method**: `POST`  
- **Path**: `/partner-api/subscriptions/{uid}/recurring_payment/`  
- **Operation ID**: `trigger_subscription_recurring_payment`  
- **Description**:  
  Trigger a recurring payment installment via PayU’s Recurring Payment Transaction API. If amount is not provided, the subscription’s billing amount is used.

#### Path Parameters

- `uid` (string, required): Subscription UID.

#### Request Body

```json
{
  "amount": 1000.00,
  "transaction_id": "REC-1234"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Recurring payment triggered successfully",
  "data": {
    "order_id": "ORD_xxx",
    "message": "UPI Collection request sent to somevpa@upi"
  }
}
```

#### Error Responses

- **400 – Validation / business**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_GATEWAY_VALIDATION_ERROR",
    "message": "Validation error",
    "details": {
      "amount": "Business validation message (e.g. mandate not active)"
    }
  }
}
```

- **503 – PayU API error**: `PAYMENT_GATEWAY_API_ERROR`  
- **500 – Configuration / unexpected**: `PAYMENT_GATEWAY_ERROR`



