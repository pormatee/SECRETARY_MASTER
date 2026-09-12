# MEasyMate CBI

**Type:** Shared Conversation Intelligence Infrastructure  
**Status:** NEXT — PHASE 0 ARCHITECTURE / CONTRACT  
**Source Repository:** NOT CREATED YET  
**Date Approved:** 2026-09-12

## Purpose

MEasyMate CBI (Conversation Brain Intelligence) เป็นสมองกลางสำหรับเข้าใจความต้องการและบทสนทนาของผู้ใช้ในทุก MEasyMate Project โดยเริ่มจาก Local / No-API Intelligence ก่อน

CBI ไม่จำเป็นต้องมีความรู้ทั่วไปเท่า ChatGPT แต่ต้องเข้าใจภาษาที่เกี่ยวข้องกับ MEasyMate Projects ได้ดีและต่อเนื่อง

## Core Direction

- No external AI API dependency in baseline
- Centralized Development, Distributed Runtime
- One shared CBI Core
- Project-specific Domain Packs
- Project-specific CBI Adapters
- Conversation State owned by Project/Session
- Multi-project / multi-user isolation
- Stable reference IDs
- Confidence + clarification + fail-closed
- Future fallback/escalation through MEasyMate AI Hub

## Boundary

CBI MAY:
- Interpret intent / conversation act
- Extract entities / slots
- Resolve references
- Maintain/transform structured conversation state
- Detect topic/context changes
- Return confidence and clarification

CBI MUST NOT:
- Replace Project Brain
- Make business decisions
- Invent project facts
- Directly bind business logic to an external AI provider

## Future Flow

```text
Project
 ↓
Local CBI
 ├─ understood → Project Brain
 └─ insufficient confidence
        ↓
   MEasyMate AI Hub
        ↓
   Approved AI Provider
        ↓
   Semantic Contract
        ↓
   CBI Validate
        ↓
   Project Brain
```

## Pilot

**LocalLife / PrachinLife** is the recommended first pilot because it already has real multi-turn conversation cases and clear Brain boundaries.

## Phase 0 Next Work

1. Freeze CBI Responsibility Contract
2. Freeze Semantic Contract V1
3. Freeze Conversation State Contract V1
4. Freeze Domain Pack Contract V1
5. Define Confidence / Clarification Policy
6. Define Provider Port for future AI Hub
7. Build LocalLife pilot acceptance corpus
8. Only then implement CBI Core V1
