# MEasyMate Caption Studio

**Project ID:** `caption-studio`
**Project Display Name:** `MEasyMate Caption Studio`
**Type:** Content / Social Media Tool
**State:** VERIFY
**Latest Known Version:** `V1.0A Android`
**Source Repository:** UNVERIFIED
**Source of Truth:** UNVERIFIED until the latest working source is inventoried

## Verified Delivery Evidence

Known delivery checkpoint dated 2026-09-13:

- `MEasyMate_Caption_Studio_SINGLE_V1.0A_ANDROID.html`
- `MEasyMate_Caption_Studio_V1.0A_ANDROID.zip`
- Android-oriented build
- storage fallback
- Offline Core

This confirms a working/delivered V1.0A artifact existed, but does not by itself establish the current source repository or latest editable source.

## Product Direction

Caption Studio is a MEasyMate content/social-media tool intended to help prepare post visuals and captions with simple modes.

Current UX direction includes:

- Beginner mode
- Standard mode
- Advanced mode
- support for 1, 2, or 3 images with layout adapted to image count
- caption/content assistance separated from shop/address/special-information display where appropriate

## Analytics Status

```text
ANALYTICS_STATUS = RETROFIT_REQUIRED
ANALYTICS_MODE_TARGET = LOCAL
CENTRAL_TRANSPORT = OFF
```

Caption Studio predates MEasyMate Analytics & Privacy Standard V1.1 and no verified Analytics integration is currently recorded.

Use **MEasyMate Money F2.1.12** as the reference architecture pattern:

```text
Shared Analytics Core
+ Project analytics-config.js
+ Event Allowlist
+ Local-first Usage Insights
+ Central Transport OFF by default
+ Non-blocking failure
```

Do not copy Money's domain events directly.

Suggested Caption Studio events:

```text
app_open
mode_beginner
mode_standard
mode_advanced
image_count_1
image_count_2
image_count_3
generate_used
save_used
share_used
runtime_error
```

Forbidden Analytics content includes:

```text
caption_text
prompt_text
shop_name
address
phone
customer_content
uploaded_image
generated_image
```

## Next Work

1. Inventory the latest Caption Studio files.
2. Identify and verify the current editable source-of-truth.
3. Confirm whether a dedicated repo exists or whether it should move into `pormatee/MEasyMate-Products`.
4. Apply MEasyMate standards without changing user content/storage behavior.
5. Retrofit Analytics using Money as the architecture reference and Caption-specific Event Allowlist.
6. Keep Central Analytics transport OFF until a verified endpoint/privacy/security review passes.
7. Verify Logo / Shortcut Identity / Information / Contact & Support / Notice integration as applicable.
8. Run PRE_GIT_AUDIT before commit/push.
9. Run PRE_RELEASE_AUDIT before customer-facing release.

## Standards

```text
This project follows MEasyMate Analytics & Privacy Standard V1.1.
```

Additional applicable MEasyMate standards must be checked during source inventory and release preparation.

## Safety

- Unknown source/repo/version state = `UNVERIFIED`.
- Do not overwrite or discard the delivered V1.0A artifacts.
- Do not add Analytics by rewriting private content/storage logic.
- Do not send generated captions, uploaded images, customer/shop content, or other private content to Analytics.
