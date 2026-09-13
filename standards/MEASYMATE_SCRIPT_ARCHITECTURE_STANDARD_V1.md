# MEasyMate Script Architecture Standard V1

**Document Type:** Shared Script / Message Architecture Standard  
**Version:** V1  
**Status:** ACTIVE BASELINE

## 1. Purpose

กำหนดวิธีใช้ Script กลางและ Script เฉพาะ Project สำหรับ:
- ข่าวสาร
- โปรโมชั่น
- ประกาศ
- แจ้งเตือนที่จำเป็น
- maintenance notice
- product-specific message

โดยไม่ทำให้แต่ละ Project ปนกัน และไม่ทำให้ App หลักพังเมื่อ Script ประกาศโหลดไม่ได้

## 2. Two-Layer Message Architecture

ทุก Web Project รองรับ 2 ช่องทาง:

### A. ALL PROJECT
สำหรับข้อความที่ต้องการแสดงกับหลาย/ทุก Project

ตัวอย่าง:
- ประกาศ MEasyMate
- ข่าวสำคัญ
- แจ้ง maintenance กลาง
- โปรโมชั่นรวม
- แจ้งการเปลี่ยนแปลงบริการ

ชื่อมาตรฐาน:

`measymate-global-message.js`

### B. PROJECT SPECIFIC
สำหรับข้อความเฉพาะ Product

ตัวอย่าง:
- feature ใหม่ของ Report Pro
- Trial notice ของ Contact Shift
- โปรเฉพาะ Money
- maintenance เฉพาะ Factory Daily

ชื่อมาตรฐาน:

`<project-id>-message.js`

เช่น:

`report-pro-message.js`

## 3. Loading Order

Project โหลดตามลำดับ:

```text
Open App
↓
Core App starts
↓
Load Global Message
↓
Load Project Message
↓
Merge / Prioritize
↓
Display only valid message
```

**App หลักต้องเปิดได้แม้ Message Script โหลดไม่สำเร็จ**

## 4. Message Contract

ข้อความแต่ละรายการควรมีอย่างน้อย:

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

ค่าตัวอย่างของ `scope`:

```text
all
report-pro
contact-shift
money
factory-daily
```

ค่าตัวอย่าง `type`:

```text
info
news
promotion
warning
maintenance
urgent
```

## 5. Safety Rule

Message Script:
- ห้ามลบ/แก้ User Data
- ห้ามเปลี่ยน Data Schema
- ห้าม reset database
- ห้ามมี API Secret
- ห้ามเป็น authority ด้าน business decision ของ Product
- ห้าม block App ถ้าโหลดไม่ได้ เว้นแต่เป็น safety-critical case ที่ออกแบบไว้เฉพาะ

## 6. Priority Rule

ลำดับแนะนำ:

```text
urgent
maintenance
warning
promotion
news
info
```

ถ้ามี Global และ Project message พร้อมกัน ให้ Project สามารถ override เฉพาะเมื่อ priority สูงกว่า หรือเมื่อกติกา Project ระบุไว้

## 7. Offline Rule

Project ต้องทำงานต่อได้เมื่อ Offline

หาก Message Script ดึงจาก Web ไม่ได้:
- ไม่แสดงข้อความใหม่
- ใช้ cached message ได้ถ้ายังไม่หมดอายุ
- ห้ามทำให้ Core App ใช้งานไม่ได้

## 8. One-HTML Compatibility

MEasyMate สามารถคงหลัก **1 Project = 1 index.html** ได้

HTML สามารถโหลด Message Script ภายนอกแบบ optional ได้ แต่:
- Core Feature ต้องไม่พึ่ง Message Script
- Offline mode ต้องไม่พัง
- ถ้าต้องการ Full Offline Build สามารถฝัง snapshot ของข้อความล่าสุดไว้ใน HTML ได้

## 9. Recommended Shared Structure

```text
shared/
├── messages/
│   └── measymate-global-message.js
└── projects/
    ├── report-pro-message.js
    ├── contact-shift-message.js
    ├── money-message.js
    └── factory-daily-message.js
```

ตำแหน่งจริงสามารถเปลี่ยนได้ แต่ contract ต้องเหมือนกัน

## 10. Display UX

ข้อความไม่ควรรบกวนผู้ใช้เกินจำเป็น

แนะนำ:
- info/news/promotion → banner หรือ inbox
- warning → banner เด่น
- urgent/maintenance → modal เมื่อจำเป็นจริง
- dismissible message → จำสถานะการปิดของผู้ใช้โดยใช้ key เฉพาะ Project

## 11. Version & Cache

Message Payload ควรมี:
- message id
- updated_at หรือ version
- expiry

เพื่อให้ Browser รู้ว่าเป็นข้อความใหม่หรือเก่า

## 12. Standard Declaration

`This project follows MEasyMate Script Architecture Standard V1.`

## Final Rule

> **Global message ใช้กับทุก Project, Project message ใช้เฉพาะ Product, และ Message System ต้องไม่เป็นจุดที่ทำให้ App หรือ User Data เสีย**
