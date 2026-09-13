# MEasyMate Web Entry & Install Standard V1

**Document Type:** Web Entry / Install UX Standard  
**Version:** V1  
**Status:** ACTIVE BASELINE

## 1. Principle

MEasyMate ใช้แนวทาง:

> **Web-first. Install when useful. Download only when the Product truly needs it.**

ผู้ใช้เปิด URL เดียวแล้วควรเข้าใจทันทีว่าจะใช้งานแบบไหน

## 2. Default Entry

เมื่อผู้ใช้เปิด Product URL ให้มีทางเลือกหลัก:

```text
[ ใช้งานผ่านเว็บ ]
[ เพิ่มไว้ที่หน้าจอ / ติดตั้ง ]
```

ทางเลือกที่สาม:

```text
[ ดาวน์โหลดสำหรับ Offline ]
```

ให้แสดงเฉพาะ Product ที่จำเป็นต้องมี Offline Download จริง

## 3. Recommended Default

ปุ่มหลักที่สุดคือ:

`ใช้งานผ่านเว็บ`

เพราะ:
- ได้ Version ล่าสุด
- Update ง่าย
- ผู้ใช้ไม่ต้องจัดการไฟล์
- Support ง่าย
- เปิดจาก LINE ได้ง่าย

## 4. Install to Device

### Tier 1 — Home Screen Shortcut
เหมาะกับหลัก 1 Project = 1 HTML

ผู้ใช้สามารถเพิ่ม URL ไว้ที่ Home Screen โดย Browser รองรับตามอุปกรณ์

### Tier 2 — Full PWA
ใช้เมื่อ Product ต้องการ:
- app-like install
- offline cache ที่จริงจัง
- full-screen behavior
- install prompt ที่ดีกว่า

**Full PWA โดยมาตรฐานอาจต้องมีไฟล์เพิ่ม** เช่น:
- manifest
- service worker
- icons

ดังนั้น Full PWA เป็นข้อยกเว้นที่ยอมรับได้จากกติกา 1 HTML เมื่อประโยชน์ชัดเจน

## 5. Download HTML / Offline Package

ไม่ใช่ค่าเริ่มต้น

ใช้เฉพาะ:
- Offline Product
- Licensed file
- Customer-specific build
- Owner/Watermark build
- สภาพแวดล้อมที่อินเทอร์เน็ตไม่แน่นอนและ Product จำเป็นต้องทำงานอิสระ

ข้อควรระวัง:
- ไฟล์เก่าไม่ Update เอง
- ผู้ใช้อาจมีหลาย Version
- Support ยากกว่า Web
- ต้องมี Version แสดงชัด

## 6. Entry UX Rule

ห้ามทำหน้าเลือกให้ซับซ้อน

ตัวอย่างมาตรฐาน:

```text
MEasyMate <Project Name>

[ เริ่มใช้งานผ่านเว็บ ]

ใช้บ่อย?
[ เพิ่มไว้ที่หน้าจอ ]

ต้องใช้แบบ Offline?
[ ดาวน์โหลดเวอร์ชัน Offline ]   ← เฉพาะ Project ที่รองรับ
```

## 7. Do Not Ask Every Time

ถ้าผู้ใช้เลือกแล้ว:
- สามารถจำ preference ในเครื่อง
- ครั้งต่อไปเข้า App ได้โดยตรง
- ต้องมี Settings ให้เปลี่ยนภายหลัง

ไม่ควรบังคับให้เลือกซ้ำทุกครั้งที่เปิด URL

## 8. Data Safety

ไม่ว่าผู้ใช้เลือก Web หรือ Install:
- ต้องทำตาม `MEasyMate Web Data Safety Standard V1`
- Update ห้ามทำ User Data หาย
- Schema change ต้องมี migration/backup
- เปลี่ยน entry mode ห้าม reset storage

## 9. Update Behavior

### Web Mode
เปิด URL เดิม → ได้ App ล่าสุด → ใช้ข้อมูลเดิม

### Home Screen / PWA
เปิดจาก icon → ตรวจ App update ตาม architecture → ใช้ข้อมูลเดิม

### Download HTML
ใช้ไฟล์ Version ที่ดาวน์โหลดไว้ → ไม่ Update เองโดยอัตโนมัติ เว้นแต่ Product มี update mechanism เฉพาะ

## 10. Product Decision Rule

ใช้ **Web only / Web-first** เมื่อ:
- update บ่อย
- Trial
- ต้องส่งลิงก์ง่าย
- ต้องควบคุม Version กลาง

เพิ่ม **Install** เมื่อ:
- ใช้งานบ่อย
- ต้องการ icon บนมือถือ
- ต้องการ app-like UX

เพิ่ม **Download** เมื่อ:
- ต้อง Offline จริง
- เป็นไฟล์ขาย/License
- มีข้อจำกัด network หรือ environment

## 11. Example Direction

```text
Factory Daily      → Web-first + shortcut
Contact Shift Pro  → Web-first + install + optional offline
Report Pro         → Web-first หรือ Download ตาม Package
MEasyMate Money    → Web-first + install
MEasyMate.com      → Web only
AI Hub             → Server/API only
```

ตัวอย่างนี้เป็น direction ไม่ใช่ข้อบังคับถาวรของแต่ละ Product; Project owner สามารถกำหนดตาม requirement จริง

## 12. Standard Declaration

`This project follows MEasyMate Web Entry & Install Standard V1.`

## Final Rule

> **ผู้ใช้ควรเปิด URL เดียวแล้วเริ่มใช้งานได้ง่ายที่สุด; การติดตั้งเป็นตัวเลือก และการดาวน์โหลดเป็นข้อยกเว้นเมื่อมีเหตุผลจริง**
