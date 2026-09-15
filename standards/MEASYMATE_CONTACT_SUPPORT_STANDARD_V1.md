# MEasyMate Contact & Support Standard V1

**Status:** ACTIVE BASELINE

## Principle

ทุก Customer-facing Product ต้องมีช่องทางกลับมาหา MEasyMate ได้ชัดเจน

ก่อน Release ต้องกำหนด:

```text
CONTACT_LINE_URL
CONTACT_WEB_URL
CONTACT_LABEL
```

กติกา:
- อย่างน้อยมี LINE Official และ Website/Product Hub
- วาง Help/Contact ในตำแหน่งหาเจอง่าย เช่น Settings, Help, About หรือ Footer
- ถ้า URL ใดยังไม่ยืนยัน ให้ระบุ `UNVERIFIED` ห้ามเดา
- ห้ามฝัง password, API key, token หรือ admin secret URL
- ถ้า App Offline อยู่ Contact UI ยังแสดงได้ แต่ Core App ต้องไม่พังเพราะเปิด LINE/Web ไม่ได้

## Release Gate

```text
[ ] LINE contact defined
[ ] Web contact defined หรือ UNVERIFIED ชัดเจน
[ ] Contact links tested
[ ] ไม่มี secret ใน URL
[ ] Contact UI หาเจอง่าย
[ ] Brand identity ถูกต้อง
```

ถ้าช่องทาง production เปิดไม่ได้:

```text
CONTACT_SUPPORT_GATE = FAIL
```

> ลูกค้าใช้ Product แล้วต้องรู้ว่าจะติดต่อ MEasyMate ได้ที่ไหน
