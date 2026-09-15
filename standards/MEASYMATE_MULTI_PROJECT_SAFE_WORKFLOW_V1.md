# MEasyMate Multi-Project Safe Workflow V1

**Status:** ACTIVE / FROZEN BASELINE  
**Date:** 2026-09-16  
**Scope:** ทุก MEasyMate repository ที่มีหลาย project หรือใช้ shared deployment/infrastructure

## 1. เหตุการณ์ต้นทาง

ระหว่าง Release Report Pro ใน `pormatee/MEasyMate-Products` พบไฟล์ Contact Shift ที่ยังแก้ค้างอยู่ใน working tree รวมถึงไฟล์ `.bak` ทำให้ `APPLY_AND_PUSH_REPORTPRO.sh` หยุดแบบ fail-safe เพื่อป้องกันการ commit งานข้าม project ปนกัน

หลังแยกงาน Contact Shift ออกชั่วคราว Report Pro ถูก commit/push สำเร็จที่ commit `666720d` แต่ URL ยัง 404 เพราะ GitHub Pages workflow เดิม deploy เฉพาะ Money และ Contact Shift และยังไม่ได้นำ `projects/report-pro/` เข้า `_site`

แก้ deployment wiring ที่ commit `4704707` แล้วตรวจยืนยัน:

- `https://app.measymate.com/report-pro/` = 200
- Global Notice = 200
- Report Pro Project Notice = 200
- Notify Core = 200
- `DEPLOY_URLS=PASS`

## 2. Root Cause

Report Pro ไม่ได้พึ่ง Contact Shift ทาง business logic แต่ทั้งสอง project อยู่ใน repository และ deployment pipeline เดียวกัน จึงแชร์:

- Git working tree
- commit history
- GitHub Actions workflow
- GitHub Pages artifact/deployment
- shared runtime บางส่วน

ดังนั้น source แยก folder กันไม่ได้แปลว่า release isolation เกิดขึ้นอัตโนมัติ

## 3. Core Principle

### Project Isolation First

ทุกการแก้ไข ทดสอบ commit และ release ต้องปฏิบัติเหมือนแต่ละ project เป็นระบบอิสระ แม้อยู่ repo เดียวกัน

### Shared Infrastructure = Fail-Closed

ถ้ายังไม่ชัดว่าไฟล์หรือ workflow หนึ่งกระทบ project ใดบ้าง ให้ HOLD ก่อน ห้าม commit/deploy แบบเดา

## 4. Mandatory Workflow

1. **หนึ่งช่วงงาน = หนึ่ง Active Project**
   - ระบุ project ที่กำลังทำให้ชัด
   - หลีกเลี่ยงแก้หลาย project พร้อมกันใน working tree เดียว

2. **ตรวจ Git ก่อนเริ่มและก่อนจบ**
   ```bash
   git status -sb
   ```
   ถ้ามีไฟล์ project อื่นค้าง ให้ HOLD และจัดการก่อน

3. **ห้ามใช้ `git add .` หรือ `git add -A` เป็นค่าเริ่มต้น**
   - Stage เฉพาะ path ที่ตั้งใจ
   ```bash
   git add projects/<active-project>/...
   ```

4. **ตรวจ staged scope ก่อน commit ทุกครั้ง**
   ```bash
   git diff --cached --name-only
   ```
   ถ้ามี project อื่นหรือไฟล์ shared ที่ไม่ได้ตั้งใจปนอยู่ ห้าม commit

5. **Temporary / backup files ห้ามเข้า production commit โดยไม่ตั้งใจ**
   - เช่น `*.bak`, `*.tmp`, test output
   - พิจารณา `.gitignore` เมื่อเหมาะสม

6. **ห้ามล้าง working tree แบบเสี่ยงเมื่อมีงานค้าง**
   - ห้ามใช้ `git reset --hard` หรือ `git clean -fd` เพื่อแก้เร็ว
   - ใช้ named stash หรือ checkpoint commit ที่ชัดเจนแทน

7. **APPLY/PUSH script ต้องมี Scope Guard**
   - script ของ project ใดอนุญาตเฉพาะ path ของ project นั้นและ shared files ที่ประกาศไว้
   - ถ้าพบ dirty files นอก scope ให้ `HOLD` โดยอัตโนมัติ

8. **Shared files ต้องถูกจัดประเภทแยกจาก project files**
   ตัวอย่าง:
   - `.github/workflows/...`
   - `shared/...`
   - root config
   ถือเป็น Shared Infrastructure และต้องประเมินผลกระทบหลาย project

9. **Source Push และ Deploy Verify เป็นคนละ checkpoint**
   ต้องแยกสถานะอย่างน้อย:
   - `SOURCE_PUSH=PASS`
   - `DEPLOY_VERIFY=PASS`

10. **เมื่อแก้ deployment workflow ให้ smoke test project ที่ใช้ pipeline ร่วมกัน**
    - ทดสอบ Active Project
    - ทดสอบ project สำคัญเดิมอย่างน้อย 1 รายการ
    - ตรวจ shared runtime ที่เกี่ยวข้อง

11. **HTTP 200 ไม่เท่ากับ Browser Acceptance**
    Verification แบ่งเป็น:
    - Source
    - Build/Deploy
    - URL Smoke Test
    - Browser Acceptance
    - Core Function Test

12. **ก่อนเปลี่ยนไป project อื่น ต้องมี checkpoint**
    อย่างน้อยบันทึก:
    - Project
    - Commit SHA
    - Push status
    - Deploy status
    - Dirty files ที่ยังเหลือ
    - Next Work

## 5. Safe Commit Example

```bash
git status -sb
git add projects/contact-shift/index.html
git diff --cached --name-only
git commit -m "Update Contact Shift"
git push origin main
```

ห้าม commit หาก staged list มี Report Pro, Money, workflow หรือ shared files ที่ไม่ได้ตั้งใจ

## 6. Release Gate

ก่อน Push ต้องผ่าน:

- `ACTIVE_PROJECT` ชัดเจน
- Dirty files นอก scope = ไม่มี หรือถูก stash/checkpoint อย่างปลอดภัย
- Staged files = เฉพาะ scope ที่อนุมัติ
- Shared infrastructure changes = ตรวจ impact แล้ว
- Commit message ระบุ project/เหตุผลชัดเจน

หลัง Push ต้องผ่าน:

- Remote branch ตรงกับ local
- GitHub Actions/Deploy สำเร็จเมื่อมี deployment
- URL smoke test ผ่าน
- Browser/core function test ตามระดับความเสี่ยง

## 7. Secretary Rule

MEasyMate Secretary ต้องเตือนกฎนี้เมื่อ:

- พบหลาย project อยู่ repo เดียวกัน
- มี dirty files ข้าม project
- ผู้ใช้กำลังจะ push/deploy
- มีการแก้ `.github/workflows`, `shared/`, root config
- กำลังสลับจาก project หนึ่งไปอีก project โดยยังไม่มี checkpoint

ห้ามสรุปว่า project ปลอดภัยเพียงเพราะ commit สำเร็จ ต้องดู deploy และ dirty working tree แยกกัน
