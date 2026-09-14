# Proofreading review

Reviewed on 14 September 2026 after pulling `main` to `34dbb002`.

## Changes made

- Corrected spelling, grammar, missing articles, plural apostrophes, and capitalization across the versioned guides and API reference.
- Repaired 42 internal links using existing pages in the matching API version.
- Corrected the v3 introduction's reversed B2B buyer/seller direction: an Indian business buys from an overseas business.
- Clarified that B2B services declare `invoice_amount`, while `amount_to_be_settled` is not accepted, consistent with the B2B submission reference.
- Clarified that a null verification expiry means the gateway supplied no deadline; it does not promise unlimited time.
- Clarified how submitting the complete settlement-document set removes omitted uploads.

## Content that needs product confirmation

These are inconsistencies within the repository, not conclusions from testing the backend. API payloads, test credentials, and regulatory claims were not changed in this proofreading pass.

1. **B2B classification webhooks conflict.** `integration-guide/v3/web-integration/b2b-services-verification.mdx:31` says classification emits `PAYMENT_DETAILS_MISSING`. `api-reference/v3/webhooks/verification-needed.mdx:284` says non-LRS classification emits no fresh event. The v3 `PAYMENT_DETAILS_MISSING` reference was removed. Confirm the emitted event and payload before rewriting the integration instructions.
2. **v2 sandbox credentials conflict.** `api-reference/v2/test-data.mdx:27` gives OTP `123456`; `integration-guide/v2/web-integration/test-data.mdx:28` gives `111000`. The card numbers and bank-testing instructions differ too. Confirm whether these describe different gateways and label them, or consolidate the data.
3. **v1 UPI subscription sandbox support contradicts itself.** `integration-guide/v1/web-integration/subscription-upi-intent.mdx:37` gives sandbox amount limits, but line 41 says the flow is production-only. Confirm whether the sandbox supports it.
4. **Webhook polling guidance conflicts with the listed APIs.** `integration-guide/v3/web-integration/webhooks.mdx:8` says no polling endpoint can reveal an incoming credit, while `api-reference/v3/vba/list-payments.mdx` and `api-reference/v3/vba/get-payment-by-utr.mdx` document payment retrieval. Clarify whether webhooks are required for immediate notification or for discovering payments at all.
5. **Subscription outcome event names need clarification.** `integration-guide/v3/web-integration/manage-subscriptions.mdx:195` names `SUBSCRIPTION_PAYMENT_SUCCESS`, `SUBSCRIPTION_PAYMENT_FAILED`, and `SUBSCRIPTION_PAYMENT_CANCELLED`, but the later merchant-facing webhook instructions point to `PAYMENT_SUCCESSFUL` and `SUBSCRIPTION_STATUS`. Confirm whether the former are internal gateway events or events merchants receive.
6. **Legacy template content remains.** The v1/v2 authentication pages are placeholders; their API introduction pages describe a plant-store starter and Bearer tokens; their error-code pages contain FAQs. These pages are not listed in `docs.json` navigation. Decide whether to replace or remove them.
7. **Unused quickstart has four broken links.** `quickstart.mdx` links to `/essentials/markdown`, `/essentials/code`, `/essentials/images`, and `/essentials/reusable-snippets`, which do not exist. It is not in navigation. Replace the starter content or remove the page when its intended role is decided.

## Validation

- Compiled all 225 tracked MDX pages and parsed their YAML frontmatter successfully.
- Parsed all 10 tracked JSON files successfully.
- Ran Mintlify's internal broken-link checker; the remaining four failures are the unused quickstart links listed above.
- `git diff --check` passes.

This was a language and internal-consistency review. It did not validate live API behavior, externally linked pages, or legal and tax accuracy.
