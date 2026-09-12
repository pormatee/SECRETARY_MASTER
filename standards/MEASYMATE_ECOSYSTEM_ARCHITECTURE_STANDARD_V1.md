# MEasyMate Ecosystem Architecture Standard V1

**Document Type:** Standard Design / Ecosystem Architecture Rule  
**Version:** V1  
**Date:** 2026-09-12  
**Status:** APPROVED BASELINE  
**Owner:** MEasyMate

## 1. Purpose

กำหนดโครงสร้างกลางของ MEasyMate ให้ Project, Shared Infrastructure, Intelligence Engine, Domain Platform และ Product/Page ต่าง ๆ เติบโตได้โดยไม่ผูกกันแน่นเกินไป ไม่สร้างฐานข้อมูลซ้ำ และไม่ทำให้ Project หนึ่งต้องรับผิดชอบทุกอย่าง

> **แต่ละระบบมีหน้าที่ชัดเจน เชื่อมกันด้วย Contract มาตรฐาน แต่ยังคงความเป็นอิสระของแต่ละ Project**

---

## 2. Ecosystem Structure

```text
                         MEasyMate HUB
                  Center Point / Product Center
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
       Aisure              LocalLife         Independent Products
   Personal Advisor     Local Data Platform    HTML / Local Tools
          │                   │                    │
          └────────────── Shared Services ─────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        ▼                     ▼                      ▼
      CBI              MEasyMate AI/API Hub     Bridge / SDK
 Conversation Brain      External AI Gateway    Standard Connector
                              │
                              ▼
                    Account / Entitlement
                    Usage / Quota / Billing

External World
     │
     ▼
MEasyMate Intelligence Engines
Promotion / Vegan / Restaurant / Cafe / Tourism / Future Engines
     │
     ▼
Candidate + Evidence Contract
     │
     ▼
Domain Intake / Verification
     │
     ▼
Domain Platform Database / Published Data
```

---

## 3. MEasyMate Hub

MEasyMate Hub คือ **ศูนย์อำนวยการใหญ่ / Center Point** ของ Ecosystem

หน้าที่:
- เป็นทางเข้า Product / Service / Tool ต่าง ๆ
- ทำให้ผู้ใช้ค้นพบและเข้าถึงบริการได้ง่าย
- แสดงบริการ/สิทธิ์/ทางเชื่อมระดับ Ecosystem

Hub ไม่ควร:
- เป็น Business Brain ของทุก Project
- เก็บ Domain Data ทุกชนิดไว้ที่เดียว
- ทำหน้าที่แทน Aisure, LocalLife หรือ Project Brain

---

## 4. Aisure

Aisure คือ **Personal Advisor Platform** และเป็น Product/Domain อิสระจาก LocalLife

ตัวอย่าง Domain ในอนาคต:
- การเงินส่วนบุคคล
- วางแผนชีวิต
- เกษียณ
- ประกัน
- เป้าหมายชีวิต
- Personal / Family Planning
- Advisor Domain อื่น ๆ ที่อนุมัติภายหลัง

> **Aisure = ช่วยเรื่องชีวิตของฉัน แผนของฉัน และการตัดสินใจส่วนตัวของฉัน**

Aisure:
- มี Brain / Business Logic ของตัวเอง
- อาจใช้ CBI เพื่อเข้าใจบทสนทนา
- อาจใช้ AI Hub เมื่อจำเป็น
- อาจมี Intelligence Engine เฉพาะ Domain ของตัวเองในอนาคต
- ไม่ขึ้นกับ LocalLife โดยโครงสร้างพื้นฐาน

---

## 5. LocalLife

LocalLife คือ **ศูนย์กลางข้อมูลและการวิเคราะห์ด้านการใช้ชีวิตในพื้นที่**

ขอบเขตตัวอย่าง:
- ร้านอาหาร / คาเฟ่
- Vegan / Vegetarian / เจ
- สถานที่
- ท่องเที่ยว
- บริการ
- Local Promotion ที่ผูกกับ Place/Branch
- Local information อื่น ๆ ที่อยู่ใน Domain ของ LocalLife

> **LocalLife ใช้ข้อมูลใน LocalLife Database เป็นหลัก และไม่ควรทำ External Discovery/Search เองใน Runtime หลัก**

หน้าที่ของ LocalLife:
- รับ Candidate / Evidence จาก Intelligence Engines
- Intake / Validation
- Dedup / Entity Resolution
- Verification
- Update Canonical Data
- Publication
- รักษา LocalLife Database
- วิเคราะห์และตัดสินใจด้วย LocalLife Brain ตาม Architecture ที่อนุมัติ

LocalLife ไม่ใช่ฐานข้อมูลกลางของทุก Domain ใน MEasyMate เช่น Money, Report, Handover หรือข้อมูลส่วนตัวของ Aisure ต้องมีเจ้าของข้อมูลของตัวเอง

---

## 6. Intelligence Engines

Intelligence Engine คือ **ผู้เชี่ยวชาญเฉพาะด้านในการค้นหา รวบรวม คัดกรอง Normalize และเตรียม Evidence จากข้อมูลภายนอก**

ตัวอย่าง:
- Promotion Intelligence
- Vegan Discovery / Intelligence Engine
- Restaurant Intelligence Engine
- Cafe Intelligence Engine
- Tourism Intelligence Engine
- Service Intelligence Engine
- Insurance Intelligence Engine
- Future Domain Engines

Engine อาจทำงานครบวงจรภายใน Domain ของตัวเอง:

```text
Discover
 ↓
Fetch
 ↓
Extract
 ↓
Normalize
 ↓
Filter / Quality Check
 ↓
Freshness / Evidence Check
 ↓
Dedup Candidate
 ↓
Export Candidate + Evidence
```

แต่มีข้อห้ามสำคัญ:

> **Intelligence Engine ห้ามเขียน Production Canonical Database ของ Domain Platform โดยตรง**

มาตรฐานการส่งข้อมูล:

```text
Intelligence Engine
 ↓
Candidate / Evidence Contract
 ↓
Domain Intake Boundary
 ↓
Verification / Adoption Policy
 ↓
Canonical Database
```

Engine เป็น **Producer of Candidate/Evidence** ไม่ใช่ Source of Truth

---

## 7. LocalLife Pages / Views

Page หรือ Brand เฉพาะพื้นที่/หัวข้อเป็น **Consumer/View ของ Published LocalLife Data** ไม่ใช่เจ้าของ Place Database ใหม่

### Geographic Views
- PrachinLife
- ChonburiLife
- PhuketLife
- Province Life อื่น ๆ

ตัวอย่าง:

```text
PrachinLife  → province = ปราจีนบุรี
ChonburiLife → province = ชลบุรี
PhuketLife   → province = ภูเก็ต
```

### Vertical Views
- Vegan Page
- Restaurant Page
- Cafe Page
- Tourism Page
- Promotion Page

ตัวอย่าง:

```text
Vegan Page   → LocalLife Published Data + vegan/vegetarian criteria
Cafe Page    → LocalLife Published Data + cafe criteria
Tourism Page → LocalLife Published Data + tourism criteria
```

> **หนึ่ง Place มี Stable `place_id` เดียวใน LocalLife และสามารถแสดงได้หลาย Page/View โดยไม่สร้าง Place Record ซ้ำ**

Page ไม่ควรมี Independent Place Database เว้นแต่มี Architecture Decision ใหม่ที่อนุมัติโดยชัดเจน

---

## 8. CBI — Conversation Brain Intelligence

CBI เป็น Shared Conversation Infrastructure

หน้าที่:
- Intent / Conversation Act
- Entity / Slot
- Context / Topic Change
- Conversation State ที่ Project ส่งให้
- Reference Resolution
- Confidence
- Clarification

CBI ไม่ใช่ Super Brain และไม่แทน Project Brain

```text
User Language
 ↓
CBI
 ↓
Semantic Meaning
 ↓
Owning Project Brain
```

Aisure, LocalLife และ Independent Project สามารถใช้ CBI ได้ แต่แต่ละ Project ยังเป็นเจ้าของ Business Decision ของตัวเอง

รายละเอียดให้ยึด `MEASYMATE_AI_CBI_READINESS_STANDARD_V1.md`

---

## 9. MEasyMate AI / API Hub

MEasyMate AI Hub เป็น **External AI Gateway กลาง** ของ MEasyMate

หน้าที่:
- เชื่อม AI Provider ภายนอก
- Provider-neutral interface
- Authentication
- Product / Client identity
- Rate limit
- Quota
- Usage tracking
- Cost control
- Safe errors
- Server-side secret management

> **Project Business Logic ห้ามผูกตรงกับ External AI Provider**

Public HTML / JS / Local Tool ห้ามมี Shared Provider Secret

External AI ใช้เมื่อ Product Policy อนุญาตและมีสิทธิ์/Quota ที่เหมาะสม

---

## 10. Independent HTML / Local Tools / Apps

MEasyMate Product เช่น HTML Tool, Local Tool, Mobile/Web Tool หรือ Product เฉพาะด้านควร **แยกอิสระโดย Default**

แต่สามารถ Plug-in Shared Capability ได้ เช่น:
- CBI
- External AI ผ่าน AI Hub
- Information Module
- Promotion Module
- License / Entitlement
- Usage / Quota
- Shared identity / project metadata

Project ต้องยังใช้งาน Core Function ของตัวเองได้ตาม Product Architecture และไม่ควรถูกบังคับให้แชร์ Database กับ Project อื่นโดยไม่มีเหตุผลทาง Domain

---

## 11. MEasyMate Bridge / SDK

Bridge / SDK คือ **ทางเชื่อมมาตรฐาน** ระหว่าง Project กับ Shared Services

ช่วงแรกอาจเป็น Lightweight Bridge เช่น:

```text
measymate-bridge.js
```

Responsibility ตัวอย่าง:

```text
Project
 ↓
MEasyMate Bridge / SDK
 ├─ CBI Connector
 ├─ AI Hub Connector
 ├─ Entitlement Check
 ├─ Usage / Quota
 ├─ Information Connector
 ├─ Promotion Connector
 ├─ Contract Version
 └─ Safe Error / Offline Handling
```

Bridge/SDK ช่วยลดการเขียน Integration ซ้ำในทุก Project แต่ **ไม่ใช่ Business Brain**

Project สามารถค่อย ๆ รองรับ Bridge ระหว่าง Feature Cycle ได้ ไม่จำเป็นต้องรื้อ Project เดิมทันที

---

## 12. Account / Entitlement / Paid AI Capability

เมื่อ Product มี AI หรือ Shared Service ที่มีต้นทุน ต้องมีสิทธิ์การใช้งานที่ตรวจสอบได้จากฝั่งที่เชื่อถือได้

อย่างน้อยต้องรองรับแนวคิด:
- Product / Package
- Customer / User entitlement
- Feature access
- AI enabled / disabled
- Usage quota
- Expiry / renewal
- Cost control

AI Hub ไม่ควรเชื่อ Public Client ว่าผู้ใช้จ่ายเงินแล้วโดยไม่มี Server-side validation

---

## 13. Common Contract Envelope

Shared Service ใหม่ควรรองรับ Identity/Trace ที่เทียบเท่า:

```text
project_id
session_id
request_id
capability
contract_version
source
timestamp
```

เพิ่มตามความเหมาะสม:

```text
user_id / entitlement_id
turn / state_version
confidence
source_engine
trace_id
```

เป้าหมายคือให้ระบบเชื่อมกันได้โดยไม่ต้องใช้ Database เดียวกัน

---

## 14. Data Ownership Rule

MEasyMate ใช้หลัก **Domain-owned Source of Truth**

ตัวอย่าง:

```text
LocalLife      → Local Place / Local Life Data
Aisure         → Personal Advisor Domain Data ตาม Architecture ของ Aisure
Money          → Financial Planning Data ของ Product
Report Pro     → Report Data
Contact Shift  → Handover Data
```

ห้ามสร้าง Mega Database เดียวเพื่อครอบทุก Domain เพียงเพราะต้องการเชื่อมระบบ

การเชื่อมข้าม Domain ให้ใช้ Contract/API/Bridge ที่กำหนด ไม่ใช้การเขียน DB ข้าม Project โดยตรง

---

## 15. Ecosystem Boundary Rules

1. Project Brain เป็นเจ้าของ Business Decision ของ Project
2. CBI เข้าใจบทสนทนา แต่ไม่ทำ Business Decision แทน Project
3. Intelligence Engine ค้นหา/คัดกรองข้อมูลภายนอก แต่ไม่เขียน Production DB โดยตรง
4. Domain Platform เป็นเจ้าของ Source of Truth ของ Domain ตัวเอง
5. Page/View อ่าน Published Data; ไม่สร้างฐานข้อมูลซ้ำโดยไม่จำเป็น
6. AI Hub เป็น Gateway ของ External AI ไม่ใช่ Business Brain
7. Hub เป็น Center Point ไม่ใช่ Runtime Owner ของทุก Project
8. Bridge/SDK เป็น Integration Layer ไม่ใช่ Domain Logic
9. Paid AI / Shared Capability ต้องผ่าน Entitlement + Quota Control
10. ระบบต้องเชื่อมกันผ่าน Versioned Contract และ Fail-Closed เมื่อ Contract ไม่ถูกต้อง

---

## 16. Target Architecture Example — LocalLife

```text
External Sources
      │
      ▼
Intelligence Engines
Promo / Vegan / Restaurant / Cafe / Tourism / ...
      │
      ▼
Candidate + Evidence
      │
      ▼
LocalLife Intake Gateway
      │
      ▼
Verification / Dedup / Update
      │
      ▼
LocalLife Canonical DB
      │
      ▼
Published Projection
      │
      ├───────────────┬────────────────┬─────────────────┐
      ▼               ▼                ▼                 ▼
 LocalLife Web   PrachinLife       PhuketLife        Vegan Page
      │
      ▼
LocalLife Brain / Decision Layer
```

LocalLife Runtime ไม่จำเป็นต้อง Crawl/Search โลกภายนอกเอง เพราะ Discovery เป็น Responsibility ของ Intelligence Engines

---

## 17. New Project Architecture Gate

Project/Service ใหม่ควรตอบให้ได้:

```text
[ ] Project นี้เป็น Hub / Advisor / Domain Platform / Engine / Product / Shared Service / View ประเภทใด
[ ] ใครเป็นเจ้าของ Business Decision
[ ] ใครเป็นเจ้าของ Source of Truth
[ ] ต้องใช้ CBI หรือไม่ / จุดเชื่อมอยู่ตรงไหน
[ ] ต้องใช้ External AI หรือไม่ / ผ่าน AI Hub หรือไม่
[ ] มี Intelligence Engine หรือรับ Candidate จากที่ใด
[ ] ห้ามเขียนข้าม Production DB โดยตรง
[ ] มี Contract Version
[ ] ถ้ามี Paid Capability มี Entitlement / Quota Boundary
[ ] ถ้าเป็น HTML/Local Tool มี Bridge/SDK integration path
[ ] ถ้าเป็น Page/View ระบุ Published Data Source โดยไม่สร้างฐานข้อมูลซ้ำ
```

---

## Final Architecture Principle

> **MEasyMate Hub เป็น Center Point, Aisure เป็น Personal Advisor, LocalLife เป็น Local Data/Decision Platform, CBI เข้าใจบทสนทนา, Intelligence Engines ค้นหาและคัดกรองโลกภายนอก, AI/API Hub ควบคุมการใช้ External AI, Bridge/SDK เชื่อม Shared Capability, และแต่ละ Project/Domain ยังคงเป็นเจ้าของ Business Logic และข้อมูลของตัวเอง**

Material architecture changes to this baseline should be recorded as a new version or explicit Architecture Decision rather than silently changing the meaning of V1.
