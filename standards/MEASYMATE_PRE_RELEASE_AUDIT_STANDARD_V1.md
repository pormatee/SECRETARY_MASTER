# MEasyMate Pre-Release Audit Standard V1

**Status:** ACTIVE BASELINE

## Principle

> Push GitHub ทำได้ตามปกติ แต่ Customer Release ต้องผ่าน Audit

ก่อนเปิด URL ให้ลูกค้า / Trial / GitHub Pages / Release ให้ตรวจ:

```text
Source
→ Data Safety
→ Logo
→ Shortcut Identity
→ Global + Project Notice
→ LINE + Web Contact
→ Analytics / Privacy
→ Version / Compatibility
→ Security
→ Smoke Test
```

## Audit Checklist

```text
[ ] ตรวจ source/current index.html แล้ว
[ ] APP_VERSION / DATA_SCHEMA_VERSION ชัดเจน
[ ] Update ไม่ทำ user data หาย
[ ] ใช้ Logo / Icon MEasyMate ที่อนุมัติ
[ ] Shortcut = Logo MEasyMate + ชื่อ Project มาตรฐาน
[ ] รองรับ Global notice
[ ] รองรับ Project-specific notice
[ ] Notice fail แล้ว Core App ยังใช้ได้
[ ] มี LINE contact
[ ] มี Web/Product Hub contact หรือระบุ UNVERIFIED
[ ] Analytics ไม่ส่ง personal/financial content
[ ] ไม่มี secret/password/API key/token ใน public code
[ ] Refresh / Close-Reopen ผ่าน
[ ] Main flow / Save ผ่าน
[ ] Shortcut/Icon/Name ผ่าน
[ ] Contact links ผ่าน
```

ถ้ายังไม่เปิด Analytics ให้ใช้:

```text
ANALYTICS = DISABLED
```

ไม่ถือเป็น FAIL

ผล Audit ใช้:

```text
PASS
FAIL
UNVERIFIED
```

ก่อน Customer Release ต้องไม่มี critical `FAIL` หรือ `UNVERIFIED`

สรุปท้าย Audit:

```text
PRE_RELEASE_AUDIT = PASS
PROJECT = <project-id>
RELEASE_COMMIT = <sha>
APP_VERSION = <version>
DATA_SCHEMA_VERSION = <version>
```

คำสั่งมาตรฐาน:

```text
เลขา ตรวจ Standard ก่อน Release
```

หรือ:

```text
เลขา ตรวจ Standard ก่อนเปิดให้ลูกค้า
```
