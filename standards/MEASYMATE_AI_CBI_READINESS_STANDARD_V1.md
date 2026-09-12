# MEasyMate AI + CBI Readiness Standard V1

**Document Type:** Standard Design / Cross-Project Architecture Rule  
**Version:** V1  
**Date:** 2026-09-12  
**Status:** FROZEN BASELINE  
**Owner:** MEasyMate

## 1. Permanent Rule

> ทุก MEasyMate Project ทั้งปัจจุบันและอนาคต ต้องเตรียมช่องทางรองรับ **MEasyMate CBI** และ **MEasyMate AI Hub** ตั้งแต่ระดับ Architecture แม้ Version แรกจะยังไม่เปิดใช้ External AI API ก็ตาม

เป้าหมายคือให้แต่ละ Project สามารถเพิ่มความสามารถด้านบทสนทนาและ AI ในอนาคตได้ โดยไม่ต้องรื้อ Business Logic หลัก และไม่ผูกกับ AI Provider รายใดโดยตรง

---

## 2. Responsibility Model

### MEasyMate CBI
CBI = Conversation Brain Intelligence

หน้าที่:
- เข้าใจ Intent / Conversation Act
- Entity / Slot extraction
- Conversation State
- Reference resolution
- Context / Topic change
- Confidence
- Clarification
- Project Domain Pack

CBI **ห้าม**:
- ตัดสิน Business Logic แทน Project Brain
- แต่งข้อมูล Domain
- ข้าม Validation / Safety / Permission
- ผูก Core กับ External AI Provider
- ทำให้ Baseline ต้องพึ่ง External API

### Project Brain
Project Brain เป็นเจ้าของ:
- Business Logic
- Domain Decision
- Calculation
- Candidate retrieval / ranking เมื่อเป็นหน้าที่ของ Project
- Data validation
- Final project-specific action

### MEasyMate AI Hub
AI Hub เป็นเจ้าของ:
- Provider connectivity
- Provider-neutral interface
- Authentication
- Rate limit / quota
- Secret management
- Safe errors
- Usage tracking

---

## 3. Standard Architecture

```text
User
 ↓
Project UI / Interface
 ↓
Project CBI Adapter
 ↓
Embedded / Local MEasyMate CBI Runtime
 ↓
Semantic Contract
 ↓
Project Brain
 ↓
Project Data / Decision Layer
```

อนาคตเมื่อ Local CBI ไม่มั่นใจและ Project อนุญาต:

```text
Local CBI
 ↓
MEasyMate AI Hub
 ↓
Approved AI Provider
 ↓
Semantic Contract
 ↓
CBI Validation
 ↓
Project Brain
```

---

## 4. Centralized Development, Distributed Runtime

ใช้หลัก:

> **หนึ่ง CBI Core กลางสำหรับพัฒนา + Runtime กระจายไปแต่ละ Project**

- CBI Core มี Source of Truth เดียว
- แต่ละ Project ฝัง CBI Runtime Release ที่อนุมัติแล้วได้
- ห้าม Copy Core แล้ว fork แก้แยกจนกลายเป็นคนละระบบ
- สิ่งที่ Project แยกได้คือ `CBI Adapter` และ `Domain Pack`

ทุก Project ควรระบุ:

```text
CBI_CORE_VERSION
CBI_CONTRACT_VERSION
CBI_DOMAIN_PACK_VERSION
AI_HUB_CONTRACT_VERSION
```

---

## 5. Mandatory Integration Points

ทุก Project ต้องเตรียม Responsibility ที่เทียบเท่ากับ:

```text
project_id
session_id
request_id
conversation_state
cbi_adapter
domain_pack
semantic_result receiver
project_action_contract
confidence / clarification handler
future ai_hub_adapter
contract version fields
```

ชื่อใน Code เปลี่ยนได้ แต่ Responsibility ต้องคงอยู่

---

## 6. Conversation State Ownership

Conversation State เป็นของ Project / Session ไม่ใช่ mutable global state ของ CBI

อย่างน้อยต้องแยกด้วย:

```text
project_id + session_id + request_id
```

ถ้าเป็น Async ให้มี `turn` หรือ `state_version` เพื่อป้องกัน Response เก่าเขียนทับ State ใหม่

**Cross-project / Cross-session contamination = PROHIBITED**

Project จะเก็บ State ใน Browser, App Storage หรือ Backend ของตัวเองได้ตาม Architecture ของ Project

---

## 7. Stable Reference ID

Object ที่ผู้ใช้อาจอ้างต่อ เช่น:
- "อันแรก"
- "ร้านสอง"
- "รายการเมื่อกี้"
- "เป้าหมายนี้"

ต้องมี Stable ID ที่ Project เป็นเจ้าของ เช่น:

```text
candidate_id
goal_id
report_id
handover_item_id
transaction_id
```

CBI ช่วย Resolve Reference ได้ แต่ไม่เป็นเจ้าของ Object

---

## 8. Domain Pack Rule

CBI Core เก็บความสามารถสนทนาทั่วไป

ภาษาเฉพาะ Project อยู่ใน Domain Pack เช่น:

- LocalLife: place / category / province / district / hours / parking
- Money: income / bill / weekly budget / dream / goal / payment
- Report Pro: report / issue / category / reporter / photo / action
- Contact Shift: shift / handover / item / status / owner / action

ห้ามย้าย Business Logic เข้า CBI Core เพียงเพื่อให้ตีความภาษาได้ง่ายขึ้น

---

## 9. Confidence + Fail-Closed

- High confidence → Project เดินต่อผ่าน Validated Path
- Insufficient confidence → Clarify
- Future AI-enabled mode → อาจส่ง AI Hub ตาม Policy
- Invalid schema / timeout / unavailable provider → Fail closed
- ห้ามเดาความหมายหรือ Domain Fact

---

## 10. External AI Readiness Without Dependency

Baseline ของ Project ควรทำงานได้โดยไม่ต้องพึ่ง External AI เว้นแต่ Product Requirement ที่อนุมัติไว้กำหนดเป็นอย่างอื่น

ห้ามฝัง Shared API Key / Provider Secret ใน Public HTML / JS / Distributed Client

อนาคต External AI ให้เชื่อมผ่าน **MEasyMate AI Hub** ไม่ผูก Business Logic ตรงกับ Provider

---

## 11. New Project Design Gate

ก่อน Architecture ของ Project ใหม่จะถือว่าพร้อม ต้องตอบ PASS:

```text
[ ] CBI integration boundary defined
[ ] Conversation State ownership defined
[ ] Stable Reference IDs defined where needed
[ ] Domain Pack contract/location defined
[ ] Semantic result receiver defined
[ ] Project Action / Business boundary defined
[ ] Confidence / Clarification / Fail-Closed defined
[ ] Future AI Hub port identified
[ ] No provider secret in public client
[ ] CBI/AI contract version fields prepared
[ ] Conversation acceptance tests can be added without changing Business Logic
```

ถ้ายังไม่พร้อม:

```text
AI_CBI_READINESS_GATE = NOT_APPROVED
```

---

## 12. Existing Project Rule

Project เดิม **ไม่ต้องรื้อทันที** เพื่อทำตาม Standard นี้

เมื่อ Project เดิมเข้าสู่รอบ Architecture / Feature Development ครั้งถัดไป:
1. เพิ่ม CBI/AI integration boundary ด้วยการเปลี่ยนแปลงที่เล็กและปลอดภัยที่สุด
2. รักษา Frozen Architecture / Data Safety / Verified Baseline เดิม
3. ไม่แก้ Business Logic เพียงเพื่อรองรับ CBI
4. เพิ่ม Test ก่อนเปิดใช้จริง

---

## Final Rule

> **Every MEasyMate project must be CBI-ready and AI-Hub-ready by design, while remaining independent from any external AI provider at the business-logic layer.**
