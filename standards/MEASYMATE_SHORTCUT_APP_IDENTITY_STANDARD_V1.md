# MEasyMate Shortcut & App Identity Standard V1

**Document Type:** Shortcut / App Identity Standard  
**Version:** V1  
**Status:** ACTIVE BASELINE  
**Scope:** MEasyMate Web Products

## 1. Principle

เมื่อลูกค้าเพิ่ม MEasyMate Product เป็น Shortcut / Add to Home Screen / Installed Web App:

> **Icon ต้องสื่อว่าเป็น MEasyMate และชื่อที่แสดงต้องเป็นชื่อ Project มาตรฐาน**

ห้ามปล่อยให้ Browser ใช้ชื่อไฟล์, URL, ชื่อ repo หรือชื่อชั่วคราวเป็นชื่อ Shortcut

---

## 2. Shortcut Icon Rule

ค่าเริ่มต้น:

- ใช้ **MEasyMate Compact Logo / App Icon**
- ต้องมองออกว่าเป็น MEasyMate เมื่อแสดงในขนาดเล็ก
- ใช้ icon square สำหรับ Home Screen
- ห้ามใช้ภาพ banner หรือ logo แนวนอนเป็น shortcut icon

Project ที่มี Project Logo เฉพาะ สามารถใช้ Project Icon ได้เมื่อ:
- ยังมี MEasyMate identity ชัดเจน
- ผ่าน MEasyMate Logo Standard V1
- Project identity ถูกอนุมัติแล้ว

---

## 3. Shortcut Name Rule

ชื่อที่แสดงบน Home Screen ต้องใช้ **Project Display Name มาตรฐาน**

ตัวอย่าง:

```text
MEasyMate Money
Report Pro
Contact Shift
Factory Daily
```

ชื่อจริงของแต่ละ Project ต้องถูกกำหนดใน Project Standard/Secretary ก่อน Release

ห้ามใช้ชื่อเช่น:

```text
index
index.html
final
final2
test
demo123
MEasyMate-Products
ชื่อ GitHub repo
```

---

## 4. Web Metadata

ทุก Web Product ต้องกำหนดอย่างน้อย:

```html
<title>PROJECT_DISPLAY_NAME</title>
<meta name="application-name" content="PROJECT_DISPLAY_NAME">
<meta name="apple-mobile-web-app-title" content="PROJECT_SHORT_NAME">
```

และกำหนด favicon / app icon ที่อ้างถึง MEasyMate identity

หากใช้ PWA ต้องกำหนดใน manifest อย่างน้อย:

```text
name
short_name
icons
start_url
display
```

---

## 5. Naming Source of Truth

ก่อนเผยแพร่ Project ขึ้น GitHub / GitHub Pages ต้องมีค่าที่อนุมัติแล้ว:

```text
PROJECT_ID
PROJECT_DISPLAY_NAME
PROJECT_SHORT_NAME
PROJECT_ICON
```

ตัวอย่าง:

```text
PROJECT_ID = "money"
PROJECT_DISPLAY_NAME = "MEasyMate Money"
PROJECT_SHORT_NAME = "Money"
PROJECT_ICON = "MEasyMate Compact Logo"
```

---

## 6. Secretary Checkpoint Rule

ก่อนนำ Project ใหม่ขึ้น GitHub หรือก่อน Release Version ที่เปลี่ยนชื่อ/Logo/Shortcut Identity:

> **ให้ถามเลขา MEasyMate เพื่อตรวจ Project Identity ก่อน**

เลขาต้องตรวจอย่างน้อย:
- ชื่อ Project มาตรฐาน
- Short Name
- Logo/Icon ที่ใช้
- ความสอดคล้องกับ MEasyMate Logo Standard
- ไม่ชนกับ Project อื่น
- ชื่อใน `<title>`, shortcut และ release ตรงกัน

สถานะก่อนผ่าน:

```text
SHORTCUT_IDENTITY_GATE = UNVERIFIED
```

เมื่อเลขาตรวจและผู้ใช้ยืนยัน:

```text
SHORTCUT_IDENTITY_GATE = APPROVED
```

จึงค่อยนำขึ้น GitHub / Release

---

## 7. Compatibility Rule

Shortcut Identity ต้องรองรับอย่างน้อย:
- Android browser / Add to Home Screen
- iPhone Safari / Add to Home Screen
- PWA install เมื่อ Project รองรับ

Browser บางตัวอาจแสดงชื่อหรือ icon แตกต่างกันได้เล็กน้อย แต่ Project ต้องส่ง metadata ที่ถูกต้องที่สุดตามมาตรฐาน

---

## 8. One-HTML Compatibility

ถ้า Project ใช้หลัก:

```text
1 Project = 1 HTML
```

ยังสามารถกำหนด:
- `<title>`
- favicon
- application-name
- apple-mobile-web-app-title

ได้ใน HTML เดียว

หากต้องการ Full PWA icon/manifest/install behavior อาจต้องมีไฟล์เพิ่มเติมตาม MEasyMate Web Entry & Install Standard V1

---

## 9. Standard Declaration

ใส่ใน Project Design / README:

```text
This project follows MEasyMate Shortcut & App Identity Standard V1.
Shortcut icon uses approved MEasyMate identity.
Shortcut name uses approved Project Display Name.
Project identity must pass Secretary Checkpoint before GitHub release.
```

---

## 10. Release Gate

ก่อน Publish / Release:

```text
[ ] Project Display Name approved
[ ] Project Short Name approved
[ ] Shortcut icon approved
[ ] Browser title correct
[ ] Android shortcut checked
[ ] iPhone shortcut metadata checked
[ ] No repo/file/test name shown to customer
[ ] Secretary checkpoint completed
```

ถ้ามีข้อใดไม่ผ่าน:

```text
SHORTCUT_IDENTITY_GATE = FAIL
```

---

## Final Rule

> **ลูกค้ากดเพิ่ม Shortcut แล้วต้องเห็นแบรนด์ MEasyMate และชื่อ Product ที่ถูกต้องทันที**

ก่อนขึ้น GitHub หรือเปลี่ยน Project Identity ให้ถามเลขา MEasyMate ก่อนเสมอ
