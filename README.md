# SECRETARY_MASTER

ศูนย์กลางข้อมูลสรุปของ **MEasyMate Secretary** และ Web Dashboard แบบ Read Only

## เปิดเว็บ
เมื่อเปิด GitHub Pages จาก branch `main` / root แล้ว:
`https://pormatee.github.io/SECRETARY_MASTER/`

## Source of truth
1. Project source repo / verified checkpoint = หลักฐานต้นทาง
2. `MEASYMATE_SECRETARY_MASTER.md` = ภาพรวมกลาง
3. `data/secretary-data.json` = Published Read Model สำหรับหน้าเว็บ (ไม่ใช่ฐานข้อมูลหลัก)

## กติกา
- เลขาอัปเดต Master/checkpoint เชิงรุกได้เมื่อมีหลักฐานยืนยัน
- Project source repos เป็น Read Only โดยปริยาย
- ห้ามเดา Version / Test / Deployment / งานเสร็จ
- ห้ามเก็บ Secret / API key / Password
- หาก Read Model ขัดกับหลักฐานล่าสุด: อัปเดต Master ก่อน แล้วค่อยอัปเดต Read Model

## ไฟล์สำคัญ
- `index.html` — Mobile Dashboard
- `MEASYMATE_SECRETARY_MASTER.md` — Master
- `data/secretary-data.json` — Dashboard data
- `priorities/NOW_NEXT_HOLD.md` — Portfolio priority
- `daily/LATEST.md` — Daily Brief ล่าสุด
- `decisions/DECISION_LOG.md` — Decision log
- `projects/*/PROJECT.md` — หน้าสรุปรายโปรเจกต์
- `projects/*/checkpoints/` — ประวัติ checkpoint

## อัปเดตจาก Termux
```bash
cd ~/SECRETARY_MASTER
git pull
git add .
git commit -m "Update secretary master"
git push
```
