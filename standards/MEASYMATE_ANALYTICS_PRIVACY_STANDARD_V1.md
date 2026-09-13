# MEasyMate Analytics & Privacy Standard V1

**Document Type:** Analytics / Privacy Standard  
**Version:** V1  
**Status:** ACTIVE BASELINE  
**Scope:** MEasyMate Web Products

## 1. Principle

> **วัดการใช้งานได้ แต่ห้ามเก็บข้อมูลส่วนตัวหรือข้อมูลการเงินของผู้ใช้โดย default**

Analytics มีไว้เพื่อช่วยตัดสินใจเรื่อง Product Improvement, UX, Reliability และการพัฒนา Version ถัดไป ไม่ใช่เพื่อเก็บเนื้อหาส่วนตัวของผู้ใช้

## 2. Allowed Analytics

อนุญาตให้เก็บข้อมูลเชิงการใช้งานแบบไม่ระบุตัวตน เช่น:

```text
app_open
session_start
weekly_budget_open
goal_created
monthly_review_open
backup_created
restore_used
feature_open
error_event
app_version
device_type
browser_type
anonymous_device_id
```

ใช้เพื่อดูจำนวนผู้ใช้โดยประมาณ, จำนวนครั้งที่เปิดใช้งาน, 7-day / 30-day return, ฟังก์ชันที่ใช้บ่อย, Version ที่ใช้งาน, Error rate และ Device / Browser compatibility

## 3. Prohibited Data

ห้ามส่งเข้า Analytics โดย default:

```text
รายได้
รายจ่าย
ยอดเงินคงเหลือ
จำนวนหนี้
ยอดออม
เป้าหมายการเงิน
ข้อความที่ผู้ใช้พิมพ์
ชื่อจริง
เบอร์โทร
อีเมล
เลขบัตรประชาชน
เลขบัญชี
รหัสผ่าน
API key
token
ข้อมูลลูกค้า
ข้อมูลสุขภาพหรือข้อมูลอ่อนไหวอื่น
```

ห้ามส่ง raw database, transaction list หรือ backup file เข้า Analytics

## 4. Anonymous User Rule

จำนวนผู้ใช้ใน Analytics ให้ตีความเป็น:

```text
Anonymous Users
Unique Devices
Estimated Active Users
```

ห้ามอ้างว่าเป็นจำนวน "คนจริง" แบบแม่นยำ และห้ามใช้ fingerprinting ที่ซับซ้อนเพื่อพยายามระบุตัวผู้ใช้

## 5. Product Event Rule

แต่ละ Project ต้องมี Event Name ที่ชัดเจน และไม่ใส่ข้อมูลส่วนตัวใน event payload

ตัวอย่างที่ถูกต้อง:

```text
event = "weekly_budget_open"
app_version = "1.4.0"
```

ตัวอย่างที่ห้าม:

```text
event = "weekly_budget_open"
income = 25000
debt = 180000
remaining_cash = 3240
```

## 6. Shared Analytics Architecture

ใช้โครงกลาง:

```text
MEasyMate-Products/
│
├── shared/
│   └── analytics/
│       └── measymate-analytics.js
│
└── projects/
    └── <project-id>/
        ├── index.html
        └── analytics-config.js
```

`measymate-analytics.js` เป็น Core Analytics Logic

`analytics-config.js` กำหนด:
- PROJECT_ID
- allowed events
- analytics enabled/disabled
- provider / endpoint
- app version

## 7. One-Time Integration Rule

Project HTML ควรเชื่อม Analytics Core เพียงครั้งแรก หลังจากนั้นการแก้ event mapping, provider, endpoint และ analytics behavior ควรทำผ่าน shared analytics/config เท่าที่เหมาะสม เพื่อลดการแก้ `index.html` ซ้ำ

## 8. Fail-Safe Rule

Analytics ต้องเป็น optional dependency

ถ้า analytics server ล่ม, script โหลดไม่ได้, network offline หรือ provider error:

```text
App Start
↓
Core App Ready
↓
Try Analytics
├─ PASS → send allowed event
└─ FAIL → ignore safely
```

ห้าม block การใช้งาน App เพราะ Analytics

## 9. Privacy Rule for Financial Products

สำหรับ MEasyMate Money และ Product ที่เกี่ยวข้องกับการเงิน:

```text
FINANCIAL_CONTENT_ANALYTICS = FORBIDDEN_BY_DEFAULT
```

อนุญาตเฉพาะ feature usage, anonymous session, app version, error, device/browser และ retention signal

ห้ามส่งค่า financial field ทุกชนิด

## 10. Consent & Transparency

เมื่อ Product เริ่มใช้ Analytics จริง ต้องแจ้งผู้ใช้แบบเข้าใจง่ายว่า:

```text
MEasyMate เก็บเฉพาะข้อมูลการใช้งานแบบไม่ระบุตัวตน
เพื่อปรับปรุงแอป
ไม่ส่งข้อมูลการเงินส่วนตัวของคุณเข้า Analytics
```

หาก Project/กฎหมาย/ผู้ให้บริการที่ใช้กำหนดให้ต้องมี consent หรือ opt-out ให้ implement ตาม requirement นั้นก่อน Release

## 11. Data Minimization

เก็บเฉพาะข้อมูลที่จำเป็นต่อคำถามเชิง Product เช่น:
- คนกลับมาใช้ไหม
- ใช้ feature ไหน
- Version ไหนมี error
- Android/iPhone มีปัญหาหรือไม่

ถ้าข้อมูลใดไม่ช่วยตอบคำถามที่จำเป็น ไม่ควรเก็บ

## 12. Provider Rule

สามารถใช้ External Analytics Provider ได้เมื่อ:
- ไม่มี secret ฝังใน public HTML
- config ที่เป็น public identifier ไม่ใช่ secret
- provider ไม่ได้รับ financial content
- Product ยังคงทำงานได้หาก provider unavailable
- privacy terms ของ provider ผ่านการตรวจสำหรับ use case นั้น

อนาคตสามารถเปลี่ยนเป็น:

```text
MEasyMate Product
↓
Anonymous Usage Events
↓
MEasyMate Analytics Service
↓
Secretary / Product Dashboard
```

โดยยังต้องรักษากติกา Privacy เดิม

## 13. Secretary / Dashboard Metrics

เลขาสามารถสรุป metric ได้ เช่น:

```text
Active anonymous users
7-day return rate
30-day return rate
Top used feature
Current app version distribution
Error rate
Device/browser split
```

ห้าม Dashboard แสดงข้อมูลการเงินรายบุคคลหรือข้อมูลระบุตัวบุคคล

## 14. Release Gate

ก่อนเปิด Analytics ใน Production ต้องตรวจ:

```text
[ ] Events ระบุชัดเจน
[ ] ไม่มี financial content ใน payload
[ ] ไม่มี personal data
[ ] ไม่มี secret ใน frontend
[ ] App ทำงานได้เมื่อ Analytics fail
[ ] Privacy message พร้อม
[ ] Event names ผ่าน review
[ ] Error events ไม่มี sensitive content
[ ] Anonymous user count ถูกอธิบายว่าเป็น estimate/device-based
```

ถ้าข้อสำคัญใดไม่ผ่าน:

```text
ANALYTICS_PRIVACY_GATE = FAIL
```

ห้ามเปิด Analytics ใน Production

## 15. Standard Declaration

ใส่ใน Project Design / README:

```text
This project follows MEasyMate Analytics & Privacy Standard V1.

Analytics collects anonymous usage signals only.
Personal and financial content must not be sent to analytics by default.
Analytics failure must never block the core app.
```

## Final Rule

> **Measure behavior, not private content.**

MEasyMate ใช้ Analytics เพื่อทำ Product ให้ดีขึ้น โดยไม่แลกกับความเป็นส่วนตัวของผู้ใช้
