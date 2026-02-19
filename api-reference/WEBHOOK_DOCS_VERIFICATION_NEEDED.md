# VERIFICATION_NEEDED Webhook Documentation

## Overview
The `VERIFICATION_NEEDED` webhook is sent to merchants when Cashfree updates the verification status of an import payment (collect-from-India). This webhook informs the merchant about the payment verification status and which fields (if any) require action.

This webhook is triggered when the system receives a `PAYMENT_VERIFICATION_UPDATE` webhook from Cashfree.

---

## When This Webhook is Sent

The webhook is sent in the following scenarios:

1. **Payment Under Review**: Cashfree has started reviewing the payment verification details
2. **Action Required**: Cashfree requires additional or corrected information
3. **Payment Verified**: Cashfree has successfully verified the payment

### Important: When the Webhook is NOT Sent

The webhook will **not** be sent if any of the following conditions are met:
- Merchant has no webhook URL configured
- Required verification fields are missing in the order:
  - `buyer_name`
  - `product_description`
  - `invoice_number`
  - `buyer_postal_code`
  - `hs_code` (or `hs_code_description`)

---

## Webhook Event Type
```
VERIFICATION_NEEDED
```

---

## Webhook Payload Structure

### Base Structure
```json
{
  "payment_id": "string (UUID)",
  "order_id": "string (UUID)",
  "verification_status": "string",
  "message": "string",
  "action_required_fields": ["string"]
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `payment_id` | string (UUID) | Unique identifier of the payment request |
| `order_id` | string (UUID) | Unique identifier of the order |
| `verification_status` | string | Current verification status. One of: `IN_REVIEW`, `ACTION_REQUIRED`, `VERIFIED` |
| `message` | string | Human-readable message describing the verification status |
| `action_required_fields` | array of strings | List of order fields that require merchant action. Empty when `verification_status` is `VERIFIED` |

---

## Verification Statuses

### 1. IN_REVIEW
**Internal Status**: `UNDER_REVIEW`

**Description**: Cashfree has received the verification details and is reviewing them.

**Action Required**: No immediate action needed. Wait for Cashfree's review to complete.

**Example Payload**:
```json
{
  "payment_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "order_id": "98765432-10ab-cdef-9876-543210fedcba",
  "verification_status": "IN_REVIEW",
  "message": "Payment verification action required",
  "action_required_fields": []
}
```

---

### 2. ACTION_REQUIRED
**Internal Status**: `ACTION_REQUIRED`

**Description**: Cashfree requires additional information or corrections to specific fields before the payment can be verified.

**Action Required**: Update the specified fields using the Upload Verification Details API and resubmit.

**Example Payload**:
```json
{
  "payment_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "order_id": "98765432-10ab-cdef-9876-543210fedcba",
  "verification_status": "ACTION_REQUIRED",
  "message": "Payment verification action required",
  "action_required_fields": [
    "buyer_name",
    "invoice_number",
    "hs_code"
  ]
}
```

**Common Reasons for ACTION_REQUIRED**:
- Incorrect or incomplete buyer information
- Invalid or missing HS code
- Invoice number mismatch
- Incomplete or unclear product description
- Missing or expired invoice document

---

### 3. VERIFIED
**Internal Status**: `VERIFIED`

**Description**: Cashfree has successfully verified the payment details. The payment can proceed to settlement.

**Action Required**: None. The payment verification is complete.

**Example Payload**:
```json
{
  "payment_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "order_id": "98765432-10ab-cdef-9876-543210fedcba",
  "verification_status": "VERIFIED",
  "message": "Payment verified",
  "action_required_fields": []
}
```

---

## Action Required Fields Reference

When `verification_status` is `ACTION_REQUIRED`, the `action_required_fields` array contains field names that need attention. These fields map to order fields as follows:

### Field Mapping Table

| Field Name in Webhook | Order Field | Description |
|-----------------------|-------------|-------------|
| `buyer_name` | buyer_name | Full name of the buyer/importer |
| `buyer_address` | buyer_address | Complete address of the buyer |
| `buyer_postal_code` | buyer_postal_code | Postal/ZIP code of the buyer |
| `product_description` | product_description | Description of goods/services |
| `invoice_number` | invoice_number | Invoice or order number |
| `invoice_file` | invoice_file | Invoice document/file |
| `hs_code` | hs_code | Harmonized System code for goods |
| `country_of_origin` | country_of_origin | Country where goods originated |

### Cashfree Internal Field Names

These are the field names as they appear in Cashfree's `PAYMENT_VERIFICATION_UPDATE` webhook:

| Cashfree Field Name | Our Field Name |
|---------------------|----------------|
| `importer_name` | buyer_name |
| `importer_address` | buyer_address |
| `importer_address_postal_code` | buyer_postal_code |
| `goods_description` | product_description |
| `invoice_number` | invoice_number |
| `invoice_file` | invoice_file |
| `hs_code` | hs_code |
| `country_of_origin` | country_of_origin |

---

## Webhook Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Merchant uploads verification details via API              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  System pushes details to Cashfree                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Cashfree reviews the verification details                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Cashfree sends PAYMENT_VERIFICATION_UPDATE webhook         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  System processes webhook and updates payment status        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  System sends VERIFICATION_NEEDED webhook to merchant        │
└─────────────────────────────────────────────────────────────┘
```

---

## Example Scenarios

### Scenario 1: Verification Approved
```json
{
  "payment_id": "123e4567-e89b-12d3-a456-426614174000",
  "order_id": "987f6543-e21c-45d6-b789-123456789012",
  "verification_status": "VERIFIED",
  "message": "Payment verified",
  "action_required_fields": []
}
```

**Merchant Action**: None required. Payment is successfully verified.

---

### Scenario 2: Missing Buyer Name and HS Code
```json
{
  "payment_id": "123e4567-e89b-12d3-a456-426614174000",
  "order_id": "987f6543-e21c-45d6-b789-123456789012",
  "verification_status": "ACTION_REQUIRED",
  "message": "Payment verification action required",
  "action_required_fields": [
    "buyer_name",
    "hs_code"
  ]
}
```

**Merchant Action**: 
1. Update the order with correct buyer name
2. Update the order with valid HS code
3. Call the Upload Verification Details API to resubmit

---

### Scenario 3: Missing Invoice Document
```json
{
  "payment_id": "123e4567-e89b-12d3-a456-426614174000",
  "order_id": "987f6543-e21c-45d6-b789-123456789012",
  "verification_status": "ACTION_REQUIRED",
  "message": "Payment verification action required",
  "action_required_fields": [
    "invoice_file"
  ]
}
```

**Merchant Action**: 
1. Upload the invoice document
2. Call the Upload Verification Details API to resubmit

---

### Scenario 4: Payment Under Review
```json
{
  "payment_id": "123e4567-e89b-12d3-a456-426614174000",
  "order_id": "987f6543-e21c-45d6-b789-123456789012",
  "verification_status": "IN_REVIEW",
  "message": "Payment verification action required",
  "action_required_fields": []
}
```

**Merchant Action**: Wait for Cashfree to complete their review. You'll receive another webhook when review is complete.

---

## Handling the Webhook

### Recommended Flow

1. **Receive the webhook** at your configured webhook endpoint
2. **Parse the payload** and extract the verification status
3. **Check verification_status**:
   - If `VERIFIED`: Update your system to reflect successful verification
   - If `ACTION_REQUIRED`: 
     - Check `action_required_fields` to see what needs to be updated
     - Notify the merchant/admin about required actions
     - Prepare to update the specified fields
   - If `IN_REVIEW`: Update status and wait for next webhook
4. **Return 200 OK** to acknowledge receipt
5. **Take action** based on the status (update UI, send notifications, etc.)

### Example Response
Your endpoint should return:
```
HTTP/1.1 200 OK
```

---

## Security Considerations

1. **Verify Webhook Signature**: Always verify the webhook signature to ensure it's from a trusted source
2. **Validate Payment ID**: Confirm the payment_id exists in your system
3. **Check Order Ownership**: Ensure the order belongs to the expected merchant
4. **Idempotency**: Handle duplicate webhooks gracefully (Cashfree may retry)

---

## Related APIs

### Upload Verification Details API
When you receive `ACTION_REQUIRED` status, use this API to update the fields:

**Endpoint**: `POST /partner-api/payments/{payment_id}/upload-verification-details/`

**Documentation**: See `API_DOCS_UPLOAD_VERIFICATION_DETAILS.md`

---

## Troubleshooting

### Webhook Not Received

**Possible Reasons**:
1. Webhook URL not configured for the merchant account
2. Required verification fields missing in the order (buyer_name, product_description, invoice_number, buyer_postal_code, hs_code)
3. Network/firewall issues blocking webhook delivery
4. Webhook endpoint returning error status codes

**Solution**: 
- Verify webhook URL is configured in merchant settings
- Check that all required order fields are populated before expecting webhooks
- Ensure your endpoint is accessible and returns 200 OK
- Check webhook logs in the system

---

### Action Required Fields Not Clear

**Problem**: Not sure what data is invalid or missing

**Solution**:
1. Review the field names in `action_required_fields`
2. Check the current values in your order
3. Refer to the Upload Verification Details API documentation for field requirements
4. For HS codes, verify against official HS code databases
5. Contact support if field requirements are unclear

---

### Webhook Received Multiple Times

**Problem**: Same webhook payload received multiple times

**Solution**:
- This is normal behavior (webhooks may be retried)
- Implement idempotency in your webhook handler
- Use `payment_id` + `verification_status` as a unique key
- If already processed with same status, skip processing but still return 200 OK

---

## Webhook Payload Validation Schema

```json
{
  "type": "object",
  "required": ["payment_id", "order_id", "verification_status", "message", "action_required_fields"],
  "properties": {
    "payment_id": {
      "type": "string",
      "format": "uuid"
    },
    "order_id": {
      "type": "string",
      "format": "uuid"
    },
    "verification_status": {
      "type": "string",
      "enum": ["IN_REVIEW", "ACTION_REQUIRED", "VERIFIED"]
    },
    "message": {
      "type": "string"
    },
    "action_required_fields": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "buyer_name",
          "buyer_address",
          "buyer_postal_code",
          "product_description",
          "invoice_number",
          "invoice_file",
          "hs_code",
          "country_of_origin"
        ]
      }
    }
  }
}
```

---

## Testing

### Test Scenarios

1. **Successful Verification**
   - Upload complete and valid verification details
   - Wait for VERIFIED webhook
   - Verify `action_required_fields` is empty

2. **Action Required**
   - Upload incomplete verification details
   - Wait for ACTION_REQUIRED webhook
   - Verify specific fields are listed in `action_required_fields`

3. **Under Review**
   - Upload verification details for the first time
   - May receive IN_REVIEW webhook initially
   - Wait for subsequent ACTION_REQUIRED or VERIFIED webhook

4. **Missing Order Fields**
   - Create order without buyer_name
   - Upload verification details
   - Verify webhook is NOT sent (check logs)

### Mock Webhook Payloads

You can use these mock payloads for testing your webhook handler:

**Mock: Verified Payment**
```bash
curl -X POST https://your-webhook-endpoint.com/webhooks/cashfree \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "order_id": "98765432-10ab-cdef-9876-543210fedcba",
    "verification_status": "VERIFIED",
    "message": "Payment verified",
    "action_required_fields": []
  }'
```

**Mock: Action Required**
```bash
curl -X POST https://your-webhook-endpoint.com/webhooks/cashfree \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "order_id": "98765432-10ab-cdef-9876-543210fedcba",
    "verification_status": "ACTION_REQUIRED",
    "message": "Payment verification action required",
    "action_required_fields": ["buyer_name", "hs_code"]
  }'
```

---

## FAQ

### Q: How long does verification typically take?
**A**: Verification time varies but typically ranges from a few hours to 1-2 business days. You'll receive a webhook when Cashfree updates the status.

### Q: Can I resubmit verification details after ACTION_REQUIRED?
**A**: Yes, use the Upload Verification Details API to update the required fields and resubmit. You'll receive a new webhook after Cashfree reviews the updated information.

### Q: What happens if I don't fix the action required fields?
**A**: The payment will remain in ACTION_REQUIRED status and won't proceed to settlement until the required fields are corrected and verified.

### Q: Will I receive this webhook for all payment types?
**A**: No, this webhook is specific to Cashfree import payments (collect-from-India) that require verification. Regular payments don't trigger this webhook.

### Q: Can I get historical verification statuses?
**A**: Yes, query the payment detail API to see the current `settlement_status` which reflects the verification status.

### Q: What if the webhook endpoint is temporarily down?
**A**: The system will retry sending the webhook. Ensure your endpoint is reliable and returns 200 OK quickly. You can also poll the payment status API as a fallback.

---

## Support

For additional information or issues:
- Check payment status via the Payment Detail API
- Review webhook delivery logs in the merchant dashboard
- Contact technical support with payment ID and timestamp

---

**Last Updated**: February 2026  
**Related Documentation**: 
- `API_DOCS_UPLOAD_VERIFICATION_DETAILS.md`
- Cashfree Import Payment API Documentation
