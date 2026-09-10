#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$(dirname "$0")"
while true; do
  clear
  echo "MEasyMate Secretary"
  echo "==================="
  echo "1) Master"
  echo "2) NOW / NEXT / HOLD"
  echo "3) Daily Brief ล่าสุด"
  echo "4) Decision Log"
  echo "5) รายชื่อ Project"
  echo "6) ค้นหาคำ"
  echo "7) git status"
  echo "0) ออก"
  printf "\nเลือก: "
  read -r n
  case "$n" in
    1) less MEASYMATE_SECRETARY_MASTER.md ;;
    2) less priorities/NOW_NEXT_HOLD.md ;;
    3) less daily/LATEST.md ;;
    4) less decisions/DECISION_LOG.md ;;
    5) find projects -mindepth 2 -maxdepth 2 -name PROJECT.md -print | sort ;;
    6) printf "คำค้น: "; read -r q; grep -Rni --exclude-dir=.git "$q" . | head -n 100; read -r -p "Enter เพื่อกลับ..." ;;
    7) git status; read -r -p "Enter เพื่อกลับ..." ;;
    0) exit 0 ;;
  esac
done
