#!/bin/bash
# Mac에서 실행: 최신 점검 리포트를 받아 바탕화면 '사이트점검' 폴더에 저장하고 연다.
# 사용법: bash pull-report.sh
set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$HOME/Desktop/사이트점검"

cd "$REPO_DIR"
git pull --quiet
mkdir -p "$OUT"
# 날짜 폴더(26-11-09 형식)를 통째로 복사 → 바탕화면/사이트점검/26-11-09/점검_07-13.md
for d in reports/[0-9][0-9]-[0-9][0-9]-[0-9][0-9]/; do
  [ -d "$d" ] && cp -R "$d" "$OUT/"
done
LATEST_DIR=$(ls -d "$OUT"/[0-9][0-9]-[0-9][0-9]-[0-9][0-9] 2>/dev/null | sort | tail -n 1)
LATEST_FILE=$(ls "$LATEST_DIR"/점검_*.md 2>/dev/null | sort | tail -n 1)
echo "저장 위치: $OUT"
head -n 12 reports/latest.md
[ -n "$LATEST_FILE" ] && open "$LATEST_FILE"
