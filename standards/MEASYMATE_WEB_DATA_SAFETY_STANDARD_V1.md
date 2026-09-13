# MEasyMate Web Data Safety Standard V1

**Document Type:** Standard Design / Project Rule  
**Version:** V1  
**Status:** FROZEN BASELINE  
**Owner:** MEasyMate  
**Purpose:** ป้องกันข้อมูลผู้ใช้สูญหายเมื่อ Web App ถูกอัปเดต

## 1. หลักการสูงสุด

> **Update Code ได้ แต่ห้ามทำลาย User Data**

ทุก MEasyMate Web Project ที่มีการเก็บข้อมูลผู้ใช้ ต้องแยก **App Code** ออกจาก **User Data** อย่างชัดเจน การอัปเดต HTML / CSS / JavaScript ต้องไม่ทำให้ข้อมูลเดิมหายโดยอัตโนมัติ

## 2. Default Architecture

```text
Web App
│
├── App Code
│   ├── index.html
│   ├── CSS
│   └── JavaScript
│
└── User Data
    ├── IndexedDB       ← ข้อมูลหลัก
    ├── localStorage    ← settings / version / small metadata
    └── Export Backup   ← backup ที่ผู้ใช้ดาวน์โหลดได้
```

กติกา:
- User Data หลักใช้ **IndexedDB**
- `localStorage` ใช้เฉพาะ settings, app version, schema version และ metadata ขนาดเล็ก
- ห้ามใช้ `localStorage` เป็นฐานข้อมูลหลักสำหรับข้อมูลจำนวนมาก หากไม่มีเหตุผลชัดเจน

## 3. Storage Isolation

แต่ละ Product ต้องมี Database Name และ Storage Key ของตัวเอง เช่น:

```text
measymate_money_db
measymate_contact_shift_db
measymate_report_pro_db
measymate_factory_daily_db
```

ห้ามใช้ชื่อ generic เช่น `data`, `records`, `app_data`, `user_data` เพราะอาจชนกับ Product อื่นบน origin เดียวกัน

## 4. Versioning Rule

ทุก Project ต้องมีอย่างน้อย:

```text
APP_VERSION
DATA_SCHEMA_VERSION
```

ตัวอย่าง:

```text
APP_VERSION = "1.4.0"
DATA_SCHEMA_VERSION = 2
```

`APP_VERSION` คือเวอร์ชันตัวโปรแกรม ส่วน `DATA_SCHEMA_VERSION` คือเวอร์ชันโครงสร้างข้อมูล การเปลี่ยน UI หรือ feature ที่ไม่กระทบ schema ไม่ควรเปลี่ยน Data Schema

## 5. Update Rule

กรณี Data Schema ไม่เปลี่ยน:

```text
โหลด App Version ใหม่
↓
อ่านข้อมูลเดิม
↓
ใช้งานต่อทันที
```

**ห้ามแก้ / ลบ / reset ข้อมูลผู้ใช้โดยไม่จำเป็น**

กรณี Data Schema เปลี่ยน:

```text
Detect Old Schema
↓
Create Backup
↓
Run Migration
↓
Validate
↓
PASS → Commit New Schema
FAIL → Rollback / Recovery
```

## 6. Migration Safety

ทุก Migration ต้อง:
- มี source schema version และ target schema version ชัดเจน
- Backup ก่อน migration
- ทำงานแบบ deterministic
- ตรวจจำนวน record ก่อน/หลัง
- ตรวจ field สำคัญ, data type, required field และ consistency ที่เกี่ยวข้อง
- Migration fail ต้องไม่ลบข้อมูลต้นฉบับ
- รองรับ retry เมื่อเหมาะสม

## 7. Backup Standard

ก่อน Migration ต้องสร้าง Backup อัตโนมัติ แนะนำเก็บอย่างน้อย:

```text
current
backup_previous_1
backup_previous_2
```

สำหรับข้อมูลสำคัญ ต้องมีปุ่ม:

```text
Backup / Export
Restore / Import
```

รูปแบบ Backup แนะนำเป็น JSON หรือ extension เฉพาะ เช่น `.measymate`

## 8. Fail-Safe Rule

หากพบ schema ไม่รู้จัก, migration ไม่รองรับ, validation ไม่ผ่าน, database เปิดไม่ได้, data corrupted หรือ version ใหม่อ่านข้อมูลเก่าไม่ได้ ระบบต้อง:

```text
STOP WRITE
↓
KEEP ORIGINAL DATA
↓
ENTER RECOVERY / READ-ONLY MODE
↓
SHOW CLEAR MESSAGE
```

ห้ามสร้างฐานข้อมูลใหม่ทับของเดิมโดยอัตโนมัติ

## 9. Prohibited Operations

ห้ามใช้โดยอัตโนมัติใน production update:

```text
localStorage.clear()
indexedDB.deleteDatabase()
database reset
delete all records
overwrite current database before backup
silent schema replacement
```

ถ้าจำเป็นต้อง Reset จริง ต้องแจ้งผู้ใช้, Backup ก่อน, ให้ผู้ใช้ยืนยัน และมีทาง Restore

## 10. Release Compatibility Test

ก่อนปล่อย Version ใหม่ ต้องทดสอบอย่างน้อย:

```text
New Install
Old Version → New Version
Old Data → New App
Migration Success
Migration Failure
Backup
Restore
Refresh
Browser Close / Reopen
Offline / Reconnect (ถ้า Product รองรับ)
```

ต้องใช้ข้อมูลจาก Version เก่าจริงในการทดสอบ compatibility

## 11. Project Design Gate

ก่อนเริ่มเขียน HTML / Code ของ Project ใหม่ ต้องสรุป 4 เรื่องก่อน:

### A. Data Storage Design
- ข้อมูลอะไรเก็บใน IndexedDB
- ข้อมูลอะไรเก็บใน localStorage
- Database Name
- Store/Table structure

### B. Version Design
- APP_VERSION
- DATA_SCHEMA_VERSION

### C. Migration Strategy
- migration path
- validation
- rollback
- unsupported schema behavior

### D. Backup / Restore Strategy
- automatic backup
- manual export
- manual restore
- retention policy

หาก 4 เรื่องนี้ยังไม่ชัด ให้ถือว่า:

```text
DATA_DESIGN_GATE = NOT_APPROVED
```

และยังไม่ควรเริ่ม implementation หลัก

## 12. Web-First Update Model

```text
User Opens Same URL
↓
Latest App Code Loads
↓
Existing Browser Data Remains
↓
Schema Check
↓
Use / Migrate Safely
```

ผู้ใช้ไม่ควรต้องดาวน์โหลด HTML ใหม่ทุกครั้ง เว้นแต่ Product นั้นออกแบบมาเป็น Offline Download Product โดยเฉพาะ

## 13. Product-Specific Naming

```text
Contact Shift Pro → measymate_contact_shift_db
Report Pro        → measymate_report_pro_db
Factory Daily     → measymate_factory_daily_db
MEasyMate Money   → measymate_money_db
```

## 14. Standard Declaration for Every Project

ใส่ข้อความนี้ใน Project Design / README:

```text
This project follows MEasyMate Web Data Safety Standard V1.

Rules:
- Update code must not destroy user data.
- IndexedDB is the default primary user-data store.
- APP_VERSION and DATA_SCHEMA_VERSION are separated.
- Schema changes require Backup → Migration → Validation → Commit.
- Failed migration must preserve original data.
- Manual Backup / Restore must be available for important user data.
```

## 15. Release Gate

ก่อน Release ต้องตอบ PASS ทุกข้อ:

```text
[ ] App version defined
[ ] Data schema version defined
[ ] Database/storage key unique
[ ] Old data preserved
[ ] Migration tested
[ ] Backup tested
[ ] Restore tested
[ ] Migration failure tested
[ ] No destructive auto-reset
[ ] Refresh persistence tested
[ ] Browser reopen persistence tested
```

ถ้ามีข้อใด FAIL:

```text
RELEASE_DATA_SAFETY_GATE = FAIL
```

ห้าม Release จนกว่าจะแก้ไข

## 16. Final Rule

**MEasyMate Web Product ทุกตัวต้องออกแบบ Data Safety ก่อน UI และ Feature Implementation**

ลำดับที่ถูกต้อง:

```text
Data Safety Design
→ Storage Design
→ Schema Design
→ Migration Design
→ Backup / Restore
→ UI / Feature
→ Compatibility Test
→ Release
```

## Frozen Principle

> **No MEasyMate update should silently destroy user data.**

การเปลี่ยนแปลง Standard นี้ในอนาคตต้องออกเป็น Version ใหม่ เช่น `MEasyMate Web Data Safety Standard V2` และต้องไม่แก้ V1 แบบเงียบ ๆ
