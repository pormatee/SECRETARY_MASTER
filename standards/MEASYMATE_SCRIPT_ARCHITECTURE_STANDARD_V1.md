# MEasyMate Script Architecture Standard V1

**Document Type:** Shared Script / Notice Architecture & UX Standard
**Version:** V1.1
**Status:** ACTIVE BASELINE
**Revision Date:** 2026-09-15

## 1. Purpose

กำหนดมาตรฐานกลางสำหรับ Notice / Information / News / Promotion / Warning / Maintenance / Urgent Message ของทุก MEasyMate Web Project โดยมีเป้าหมายว่า:

- ใช้ Core กลางร่วมกัน
- แยก Global Notice ออกจาก Project Notice ชัดเจน
- ไม่ทำให้ข้อมูลหรือ Core App ของผู้ใช้เสีย
- ไม่รบกวนผู้ใช้เกินจำเป็น
- รองรับการเพิ่ม Project ใหม่ในอนาคตโดยไม่ต้องสร้างระบบ Notice ใหม่ทุกครั้ง

## 2. Standard Architecture

MEasyMate Notice V1 ใช้ 2 ระดับหลัก:

### A. GLOBAL NOTICE

ใช้สำหรับเรื่องที่เกี่ยวข้องกับทุก Project หรือหลาย Project ในระดับแบรนด์/ระบบกลางเท่านั้น

ตัวอย่าง:
- maintenance กลาง
- การเปลี่ยนแปลงบริการที่กระทบทุก App
- ประกาศด้านความปลอดภัยหรือข้อกำหนดสำคัญ
- ข่าวระดับ MEasyMate ที่จำเป็นจริง

**Global Notice ต้องใช้ให้น้อย** และห้ามใช้เป็นช่องทางโปรโมตทั่วไปจนรบกวนผู้ใช้ทุก Project

มาตรฐาน scope:

`scope: "all"`

### B. PROJECT NOTICE

ใช้เป็นช่องทางหลักสำหรับข้อความเฉพาะ Product

ตัวอย่าง:
- feature ใหม่ของ Money
- maintenance ของ Contact Shift
- โปรโมชั่นของ Report Pro
- ข้อความเฉพาะ Factory Daily

มาตรฐาน scope ใช้ Project ID เช่น:

```text
money
contact-shift
report-pro
factory-daily
```

**Project Notice ต้องแสดงเฉพาะ Project ที่ scope ตรงกันเท่านั้น**

## 3. Future Group Scope

V1 ยังไม่บังคับใช้ Group Scope

อนาคตสามารถเพิ่มกลุ่ม เช่น:

```text
factory-tools
personal-tools
local-life
```

ได้เมื่อมี use case จริง แต่ห้ามรวม Project ต่างกลุ่มเข้าด้วยกันโดยไม่มี Product/Governance decision ที่ชัดเจน

## 4. Shared Runtime Design

ทุก Project ที่เข้าร่วม Notice System ต้องใช้ Core กลางตัวเดียวกัน

มาตรฐาน path:

```text
shared/notify/
├── all-project-notice.js
└── measymate-notify-core.js
```

แต่ละ Project มีไฟล์เฉพาะของตนเอง:

```text
projects/<project-id>/
├── index.html
└── project-notice.js
```

ตัวอย่าง:

```text
projects/money/project-notice.js
projects/contact-shift/project-notice.js
```

**ห้าม copy `measymate-notify-core.js` ไปแยกแก้คนละเวอร์ชันในแต่ละ Project** เว้นแต่มีเหตุผลทางสถาปัตยกรรมที่ได้รับอนุมัติและระบุ version แยกอย่างชัดเจน

## 5. Project Identity Contract

ทุก Project ที่ใช้ Notice System ต้องประกาศ Project ID ที่ชัดเจนใน HTML เช่น:

```html
<meta name="measymate-project-id" content="money">
```

Project ID ต้อง:
- stable
- ไม่ใช้ชื่อไฟล์ชั่วคราว
- ไม่ใช้ `index`, `final`, `test`, `v2` เป็น identity หลัก
- ตรงกับ scope ของ Project Notice

## 6. Standard Loading Order

สำหรับ Project ที่ deploy จาก shared structure ให้โหลดตามลำดับ:

```html
<script src="/shared/notify/all-project-notice.js"></script>
<script src="./project-notice.js"></script>
<script src="/shared/notify/measymate-notify-core.js"></script>
```

ลำดับการทำงาน:

```text
Open App
↓
Read Project ID
↓
Load Global Notice Data
↓
Load Project Notice Data
↓
Notify Core filter / rank / render
↓
App continues normally
```

Notice System ต้องเป็น optional/non-blocking layer และ Core App ต้องใช้งานได้แม้ Notice Script โหลดไม่สำเร็จ

## 7. Notice Contract

Notice แต่ละรายการต้องรองรับอย่างน้อย:

```text
id
scope
type
title
message
start_at
end_at
priority
dismissible
enabled
```

ค่ามาตรฐานของ `type`:

```text
urgent
maintenance
warning
promotion
news
info
```

Notice ใหม่ที่ต้องการให้ผู้ใช้เห็นอีกครั้งต้องใช้ **ID ใหม่** ห้าม reset dismiss history ของผู้ใช้โดยไม่จำเป็น

## 8. Priority Rule

ลำดับความสำคัญมาตรฐาน:

```text
urgent
maintenance
warning
promotion
news
info
```

หากมีหลาย Notice พร้อมกัน ให้ระบบเลือกตาม priority ก่อน และใช้ type rank เป็นตัวช่วยเมื่อ priority เท่ากัน

## 9. Display UX Standard

เพื่อไม่ให้รบกวนผู้ใช้:

- แสดงพร้อมกันสูงสุด **3 Notice**
- Global Notice ใช้ให้น้อย
- Project Notice เป็นช่องทางหลัก
- warning / urgent ต้องเด่นกว่าข่าวหรือ promotion
- Notice ต้องอ่านง่ายบนมือถือ
- dismissible notice ต้องมีปุ่มปิดที่ชัดเจน
- การปิด Notice ต้องไม่ block การใช้ App

จำนวน 3 กล่องเป็น **maximum visible items** ไม่ใช่จำนวนกล่องตายตัวของหน้าจอ

## 10. Dismiss Persistence

เมื่อผู้ใช้ปิด Notice ที่ dismissible:

- ระบบต้องจำว่า Notice ID นั้นถูกปิดแล้ว
- refresh/reopen แล้วไม่ควรแสดง Notice เดิมซ้ำ
- Notice ใหม่ให้ใช้ ID ใหม่
- การ reset dismiss ใช้สำหรับ testing/admin tooling เป็นหลัก ไม่ใช่ UX ปกติของลูกค้า

ตัวอย่าง key:

```text
measymate_notice_dismissed_<notice-id>
```

หาก local storage ใช้งานไม่ได้ ระบบต้อง fail-safe และห้ามทำให้ App หลักพัง

## 11. Idempotent Render Rule

`render()` ต้องเป็น **idempotent**

การเรียก render ซ้ำโดยไม่มีข้อมูลเปลี่ยน ต้องไม่สร้าง Notice ซ้ำ

ผลที่ถูกต้อง:

```text
render ครั้งแรก = 3 notices
render อีกครั้ง = ยังเป็น 3 notices
```

ห้ามเกิด:

```text
3 → 6 → 9 ...
```

Core ควร clear/replace existing rendered notice ก่อนสร้างชุดล่าสุด หรือใช้กลไกเทียบเท่าที่ให้ผลเดียวกัน

## 12. Scope Isolation Rule

Core ต้อง fail-closed ด้าน scope:

- `all` → Project ที่เข้าร่วม Notice System สามารถเห็นได้
- `money` → Money เท่านั้น
- `contact-shift` → Contact Shift เท่านั้น
- scope ที่ไม่ตรง Project ID → ห้ามแสดง

ห้ามใช้ชื่อ Project แบบเดา/partial match เพื่อเลือก Notice

## 13. Safety Rule

Notice Script และ Notify Core:

- ห้ามลบ/แก้ User Data
- ห้ามเปลี่ยน Data Schema
- ห้าม reset database
- ห้ามมี API Secret / token / password
- ห้ามเป็น authority ด้าน business decision ของ Product
- ห้าม block App หาก Notice layer ล้มเหลว
- ห้ามใช้ Notice เพื่อแอบส่ง personal/financial content ออกนอกเครื่อง

## 14. Offline & Failure Rule

เมื่อ Offline หรือโหลด Notice Script ไม่สำเร็จ:

- App หลักต้องทำงานต่อได้
- Notice ใหม่อาจไม่แสดงได้
- cached notice ใช้ได้ถ้ายัง valid และ implementation รองรับ
- failure ของ Notice ต้องไม่ทำให้ Core Feature ล้ม

## 15. Deployment Rule

การฝัง Notice ใน source อย่างเดียวไม่ถือว่า deploy ครบ

Deployment workflow ต้อง publish assets ที่ Project อ้างถึงจริงอย่างน้อย:

```text
/shared/notify/all-project-notice.js
/shared/notify/measymate-notify-core.js
/<project-path>/project-notice.js
```

ก่อน Release ต้องตรวจว่า path ที่ HTML เรียกสามารถเปิดได้จริงบน production URL และไม่มี 404

## 16. Rollout Rule

การเริ่มใช้กับ Project เดิมให้ทำแบบ staged rollout:

```text
1 Project pilot
→ real-browser smoke test
→ scope / priority / dismiss / re-render test
→ PRE_GIT_AUDIT / PRE_RELEASE_AUDIT
→ expand to next Project
```

ห้ามเปิดทุก Project พร้อมกันก่อนมี pilot ที่ผ่านจริง

## 17. Minimum Acceptance Tests

ก่อนประกาศว่า Notice Integration ของ Project = PASS ต้องตรวจอย่างน้อย:

```text
LOAD = PASS
GLOBAL_NOTICE = PASS
PROJECT_NOTICE = PASS
SCOPE_FILTER = PASS
PRIORITY = PASS
MOBILE_DISPLAY = PASS
DISMISS_PERSISTENCE = PASS
RESET_TEST = PASS (test environment)
DUPLICATE_RENDER = PASS
DEPLOY_ASSET_PATHS = PASS
APP_CORE_NON_BLOCKING = PASS
```

ข้อที่ยังไม่ได้ทดสอบจริงต้องเป็น `UNVERIFIED` ห้ามสรุปเป็น PASS จากการคาดเดา

## 18. Standard Declaration

Project ที่ทำครบตามมาตรฐานนี้สามารถระบุ:

`This project follows MEasyMate Script Architecture Standard V1.1.`

## Final Rule

> **Global ใช้เฉพาะเรื่องกลางที่จำเป็น, Project Notice ใช้เป็นหลัก, ทุก Project ใช้ Notify Core กลางตัวเดียวกัน, scope ต้องแยกชัด, render ต้องไม่ซ้ำ, dismiss ต้องจำได้, และ Notice System ต้องไม่มีสิทธิ์ทำให้ App หรือ User Data เสีย**
