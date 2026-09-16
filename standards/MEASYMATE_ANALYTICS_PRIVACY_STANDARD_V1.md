# MEasyMate Analytics & Privacy Standard V1.1

**Document Type:** Analytics / Privacy / Product Telemetry Standard
**Version:** V1.1
**Status:** ACTIVE BASELINE
**Revision Date:** 2026-09-16
**Scope:** MEasyMate Web Products, customer-facing tools, and supporting product runtimes

## 1. Principle

> **Measure behavior, not private content.**

MEasyMate ใช้ Analytics เพื่อช่วยตัดสินใจเรื่อง Product Improvement, UX, Reliability และ Version ถัดไป โดยไม่แลกกับความเป็นส่วนตัวของผู้ใช้

กติกาหลัก:

- เก็บเท่าที่จำเป็น
- เก็บพฤติกรรมการใช้งาน ไม่เก็บเนื้อหาส่วนตัว
- Analytics ต้องไม่เป็น dependency ที่ทำให้ App ใช้งานไม่ได้
- Central transport ปิดเป็นค่าเริ่มต้นจนกว่าจะผ่านการตรวจ
- ทุก Project ต้องประกาศสถานะ Analytics อย่างชัดเจน
- Project ใหม่ต้องพิจารณา Analytics ตั้งแต่ก่อน Customer Release ไม่ใช่เพิ่มย้อนหลังโดยไม่มีแบบแผน

## 2. Reference Implementation — MEasyMate Money

MEasyMate Money เป็น **Reference Implementation** สำหรับรูปแบบ Analytics ของ MEasyMate Web Product หลังจาก Standard V1.1

Reference baseline ณ วันที่ออกมาตรฐานนี้:

```text
Project: MEasyMate Money
Project ID: money
Reference App Version: F2.1.12
Analytics Mode: LOCAL
Shared Core: shared/analytics/measymate-analytics.js
Project Config: projects/money/analytics-config.js
Local Usage Insights: supported
Central Transport: OFF by default
Event Allowlist: required
Private / Financial Content: forbidden
Analytics Failure: non-blocking
```

คำว่า Reference Implementation หมายถึงให้ยึด **โครงสร้างและกติกา** ของ Money เป็นแบบอย่าง

ห้าม copy Event ของ Money ไปใช้ทุก Project แบบตรง ๆ เพราะแต่ละ Product มี Domain และ Privacy Risk ต่างกัน

## 3. Mandatory Analytics Status

ทุก Project ที่อยู่ภายใต้ MEasyMate ต้องระบุ Analytics Status ใน README / Project Design / Release Checklist เป็นหนึ่งในสถานะต่อไปนี้:

```text
ANALYTICS_MODE = LOCAL
ANALYTICS_MODE = CENTRAL
ANALYTICS_MODE = NOT_REQUIRED
```

### LOCAL

เก็บเฉพาะ anonymous/local usage counters ในเครื่องผู้ใช้

```text
localStatsEnabled = true
transportEnabled = false
```

เป็นค่าเริ่มต้นที่แนะนำสำหรับ Web Product ใหม่

### CENTRAL

ส่งเฉพาะ Event ที่ผ่าน Allowlist ไปยัง verified endpoint

อนุญาตเมื่อผ่าน Privacy / Security / Endpoint Review แล้วเท่านั้น

### NOT_REQUIRED

ใช้เฉพาะกรณีที่มีเหตุผลด้านสถาปัตยกรรมหรือ Privacy ที่ชัดเจน และต้องระบุเหตุผลใน README / Project Design

ห้ามปล่อยสถานะเป็น "ไม่แน่ใจว่ามี Analytics หรือไม่"

## 4. Default Rule for New Customer-Facing Products

Product ใหม่ที่ผู้ใช้หรือลูกค้าใช้งานโดยตรงให้เริ่มจาก:

```text
ANALYTICS_MODE = LOCAL
CENTRAL_TRANSPORT = OFF
EVENT_ALLOWLIST = REQUIRED
PRIVATE_CONTENT = FORBIDDEN
FAILURE_MODE = NON_BLOCKING
```

ก่อน Customer Release ต้องตรวจว่า Analytics integration ผ่าน Release Gate ของมาตรฐานนี้

## 5. Transition Rule for Existing / Already-Pushed Products

Product ที่ถูก push หรือ release ไปก่อน Standard V1.1 และยังไม่มี Analytics ไม่ต้องแก้แบบเร่งด่วนจนเสี่ยงกระทบ Core App หรือ User Data

ให้ระบุสถานะ:

```text
ANALYTICS_STATUS = RETROFIT_REQUIRED
```

แล้วแก้ในรอบ Product Update ที่ควบคุมได้ โดยต้อง:

1. Inventory source ล่าสุด
2. ยืนยัน source-of-truth
3. ตรวจ Data Safety
4. เพิ่ม Analytics แบบ non-destructive
5. ทดสอบ compatibility
6. ทำ PRE_GIT_AUDIT ก่อน commit/push
7. ทำ PRE_RELEASE_AUDIT ก่อน customer-facing release

ห้าม rollback หรือ rewrite Product เดิมเพียงเพราะยังไม่มี Analytics หากไม่มีเหตุด้าน Privacy/Security ที่ต้องแก้ทันที

## 6. Shared Analytics Architecture

MEasyMate Web Products ควรใช้ Core กลาง:

```text
MEasyMate-Products/
│
├── shared/
│   └── analytics/
│       ├── measymate-analytics.js
│       └── measymate-usage-insights.js
│
└── projects/
    └── <project-id>/
        ├── index.html
        └── analytics-config.js
```

`measymate-analytics.js` = Shared Core Analytics Logic

`analytics-config.js` = Project-specific configuration

อย่างน้อยควรกำหนด:

```text
projectId
appVersion
dataSchemaVersion (ถ้ามี)
localStatsEnabled
transportEnabled
endpoint
includeInstallId
retentionDays
allowEvents
allowMetaKeys
```

ห้าม copy Core ไปแตกเป็นคนละเวอร์ชันในแต่ละ Project โดยไม่มี Architecture Decision

## 7. One-Time Integration Rule

Project HTML ควรเชื่อม Shared Analytics Core และ Project Config เพียงครั้งเดียว

หลังจากนั้น Event Mapping, Allowlist, Endpoint และ Behavior ควรจัดการผ่าน Shared Core / Project Config เท่าที่เหมาะสม เพื่อลดการแก้ `index.html` ซ้ำและลด regression risk

## 8. Event Allowlist Rule

ทุก Project ต้องมี Event Allowlist

ตัวอย่าง:

```text
app_open
feature_open
item_saved
backup_created
restore_used
share_used
runtime_error
```

Event ที่ไม่อยู่ใน Allowlist ต้องไม่ถูกส่งหรือบันทึกผ่าน Analytics Core

Event name ต้องอธิบาย "สิ่งที่เกิดขึ้น" ไม่ใช่เนื้อหาที่ผู้ใช้กรอก

ตัวอย่างที่ถูกต้อง:

```text
event = "report_saved"
result = "success"
```

ตัวอย่างที่ห้าม:

```text
event = "report_saved"
employee_name = "..."
problem_text = "..."
customer_name = "..."
```

## 9. Event Design Categories

Project ควรออกแบบ Event จาก 3 เป้าหมาย:

### Usage

```text
app_open
nav_open
feature_open
share_used
```

### Reliability

```text
save_success
save_failed
restore_success
restore_failed
runtime_error
```

### Product Learning

```text
mode_selected
image_count_selected
export_used
workflow_completed
```

Event ใดไม่ช่วยตอบคำถามด้าน Product/UX/Reliability ไม่ควรเก็บ

## 10. Allowed Metadata Rule

Metadata ต้องใช้ Allowlist เช่น:

```text
view
action
result
kind
mode
count_bucket
```

ต้องเป็นค่าที่ normalize/sanitize ได้ และห้ามใส่ free text ของผู้ใช้โดย default

ห้ามส่ง:

```text
raw_text
report_content
caption_content
financial_value
customer_data
employee_data
location_detail
image_content
file_content
```

## 11. Prohibited Data

ห้ามส่งเข้า Analytics โดย default:

```text
รายได้
รายจ่าย
ยอดเงินคงเหลือ
จำนวนหนี้
ยอดออม
เป้าหมายการเงิน
ข้อความที่ผู้ใช้พิมพ์
Caption ที่ผู้ใช้สร้าง
เนื้อหารายงาน
รูปภาพ
ไฟล์แนบ
ชื่อจริง
ชื่อพนักงาน
ชื่อลูกค้า
เบอร์โทร
อีเมล
เลขบัตรประชาชน
เลขบัญชี
รหัสผ่าน
API key
token
ข้อมูลลูกค้า
ข้อมูลโรงงานที่เป็นความลับ
ข้อมูลสุขภาพ
ข้อมูลอ่อนไหวอื่น
```

ห้ามส่ง raw database, transaction list, report body หรือ backup file เข้า Analytics

## 12. Anonymous User / Install ID Rule

จำนวนผู้ใช้ใน Analytics ให้ตีความเป็น:

```text
Anonymous Users
Unique Installations
Unique Devices
Estimated Active Users
```

Install ID แบบสุ่มที่ Product สร้างเองสามารถใช้เพื่อวัดการกลับมาใช้งานได้ หากไม่ผูกกับข้อมูลระบุตัวบุคคล

ห้ามใช้ fingerprinting ที่ซับซ้อนเพื่อพยายามระบุตัวผู้ใช้

## 13. Financial Product Rule

สำหรับ MEasyMate Money และ Product ที่เกี่ยวข้องกับการเงิน:

```text
FINANCIAL_CONTENT_ANALYTICS = FORBIDDEN_BY_DEFAULT
```

อนุญาตเฉพาะ feature usage, anonymous session/install signal, app version, error/reliability event, device/browser class, retention signal และ backup/restore action status

ห้ามส่งค่า financial field ทุกชนิด

## 14. Sensitive Work / Factory Product Rule

สำหรับ Report Pro, Factory Daily, Contact Shift และ Product งานองค์กร:

Analytics ต้องวัด workflow/action เท่านั้น

ตัวอย่างที่อนุญาต:

```text
report_saved
pdf_exported
qr_sent
qr_received
form_submitted
backup_created
runtime_error
```

ห้ามส่งชื่อพนักงาน รายละเอียดปัญหา เนื้อหา handover ข้อมูลลูกค้า หมายเลขงาน ข้อมูลภายในโรงงาน ภาพ เอกสาร หรือข้อความ 5W2H

## 15. Caption / Content Product Rule

สำหรับ Caption Studio หรือ Product สร้างคอนเทนต์:

อนุญาต Event เช่น:

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

ห้ามส่ง caption text, prompt text, shop name, address, phone, customer content, uploaded image หรือ generated image

## 16. Central Transport Default-Off Rule

Central transport ต้องปิดเป็นค่าเริ่มต้น:

```text
transportEnabled = false
endpoint = ""
```

ห้ามเปิด Central Analytics จนกว่าจะยืนยัน:

```text
ENDPOINT_VERIFIED = TRUE
PRIVACY_REVIEW = PASS
SECURITY_REVIEW = PASS
EVENT_ALLOWLIST_REVIEW = PASS
NO_SECRET_IN_FRONTEND = PASS
FAIL_SAFE_TEST = PASS
```

เมื่อยังไม่มี verified endpoint ให้ใช้ Local Analytics ต่อไป

## 17. Fail-Safe / Non-Blocking Rule

Analytics เป็น optional dependency

```text
App Start
↓
Core App Ready
↓
Try Analytics
├─ PASS → record/send allowed event
└─ FAIL → ignore safely
```

Analytics server ล่ม, script โหลดไม่ได้, network offline, storage unavailable หรือ provider error ต้องไม่ทำให้ Core App ใช้งานไม่ได้

## 18. Local Usage Insights

Project สามารถมี Local Usage Insights เพื่อดูข้อมูลในเครื่อง เช่น:

```text
total_events
event_counts
active_days
first_seen
last_seen
app_version
```

Local Usage Insights ต้องไม่แสดง private content และต้องไม่อ่าน Domain Data ที่ไม่จำเป็น

## 19. System Test Mode

Product ที่มี Analytics integration ควรมีวิธีตรวจอย่างปลอดภัยว่า:

```text
Analytics Core loaded
Project config loaded
Project ID correct
Event Allowlist active
Local event counter works
Forbidden event is rejected
Central transport state is correct
Analytics failure does not break Core App
Runtime error counter does not contain sensitive content
```

System Test ต้องไม่อ่านหรือแสดง private user content โดยไม่จำเป็น

MEasyMate Money F2.1.12 เป็นตัวอย่างของการมี Test Mode สำหรับตรวจ Information, Notice, Analytics, Usage Insights และ runtime counters โดยไม่อ่านข้อมูลการเงิน

## 20. Consent & Transparency

เมื่อ Product ใช้ Analytics ต้องแจ้งผู้ใช้แบบเข้าใจง่ายตามระดับการเก็บจริง

Local-only example:

```text
MEasyMate เก็บสถิติการใช้งานแบบไม่ระบุตัวตนไว้ในอุปกรณ์
เพื่อช่วยตรวจสอบและปรับปรุงการทำงานของแอป
ไม่ส่งเนื้อหาส่วนตัวของคุณไปยัง Analytics ส่วนกลาง
```

หากกฎหมาย, Project หรือ Provider กำหนด consent / opt-out ต้อง implement requirement นั้นก่อน Release

## 21. Provider Rule

สามารถใช้ External Analytics Provider ได้เมื่อ:

- ไม่มี secret ฝังใน public HTML
- public identifier ต้องไม่ใช่ secret
- provider ไม่ได้รับ private / sensitive content
- Product ยังคงทำงานได้หาก provider unavailable
- privacy terms ของ provider ผ่านการตรวจสำหรับ use case นั้น

## 22. Secretary / Dashboard Metrics

เลขาสามารถสรุป metric เช่น:

```text
Estimated active installations
7-day return signal
30-day return signal
Top used feature
App version distribution
Error rate
Device/browser split
Workflow completion rate
```

ห้าม Dashboard แสดงข้อมูลส่วนตัว เนื้อหา Product หรือข้อมูลอ่อนไหวรายบุคคล

## 23. README / Project Declaration

Project ที่ใช้ Analytics ต้องมีอย่างน้อย:

```text
Analytics Mode: LOCAL | CENTRAL | NOT_REQUIRED
Analytics Core: <path or implementation>
Project Analytics Config: <path or N/A>
Central Transport: ON | OFF
Private Content Analytics: FORBIDDEN
```

และประกาศ:

```text
This project follows MEasyMate Analytics & Privacy Standard V1.1.

Analytics measures allowed usage/reliability signals only.
Private, financial, customer, factory, report, caption, image and other sensitive content
must not be sent to analytics by default.
Analytics failure must never block the core app.
```

## 24. Pre-Release Analytics Gate

ก่อน Customer Release ต้องตรวจ:

```text
[ ] Analytics Mode declared
[ ] Shared Core / implementation identified
[ ] Project config exists when Analytics is used
[ ] Project ID correct
[ ] App version correct
[ ] Event Allowlist defined
[ ] Metadata Allowlist defined
[ ] No private/sensitive content in payload
[ ] No secret in frontend
[ ] Central transport OFF unless endpoint verified
[ ] Analytics failure is non-blocking
[ ] Privacy / transparency message is correct
[ ] Local/central behavior matches declared mode
[ ] System Test / smoke test completed
[ ] Existing user data/storage behavior unchanged
```

ถ้าข้อสำคัญใดไม่ผ่าน:

```text
ANALYTICS_PRIVACY_GATE = FAIL
```

ห้าม Customer Release จนกว่าจะแก้หรือมี documented `ANALYTICS_MODE = NOT_REQUIRED` ที่ผ่าน review

## 25. Git / Migration Rule

การเพิ่ม Analytics เข้า Project ต้องถือเป็น Product Change

ก่อน Git:

```text
PRE_GIT_AUDIT = PASS
```

ก่อน Customer Release:

```text
PRE_RELEASE_AUDIT = PASS
ANALYTICS_PRIVACY_GATE = PASS
```

ห้ามใช้ Analytics migration เป็นเหตุให้ reset/clear/replace User Data

## 26. Standard Declaration

ใส่ใน Project Design / README:

```text
This project follows MEasyMate Analytics & Privacy Standard V1.1.
```

Project ใหม่หลัง Standard V1.1 ต้องใช้มาตรฐานนี้ตั้งแต่เริ่ม integration

Project ที่ push/release ไปก่อนหน้านี้ให้ทยอย retrofit ตาม Transition Rule โดยไม่ทำลายความเข้ากันได้

## Final Rule

> **Money is the reference pattern; privacy is the invariant.**

ใช้โครงสร้าง Money เป็นแบบอย่างสำหรับ Shared Core + Project Config + Allowlist + Local-first + Testability แต่ Event และ Privacy Boundary ต้องออกแบบตาม Domain ของแต่ละ Project เสมอ
