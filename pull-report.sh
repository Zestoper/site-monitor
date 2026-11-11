#!/bin/bash
# Mac에서 실행: 최신 점검 리포트를 받아 바탕화면 '사이트점검' 폴더에 저장하고 연다.
# 사용법: bash pull-report.sh            (받고 최신 리포트 열기)
#         bash pull-report.sh --auto     (예약 실행용: 열지 않고 로그만 남김)
set -e
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"
AUTO=0; [ "$1" = "--auto" ] && AUTO=1
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$HOME/Desktop/사이트점검"

cd "$REPO_DIR"
# 1) 평소처럼 최신으로 맞춘다 (fast-forward)
# 2) 내가 고치던 파일 때문에 안 되면 reports 폴더만 GitHub 최신으로 가져온다
git fetch --quiet origin main
if ! git merge --quiet --ff-only origin/main 2>/dev/null; then
  git checkout origin/main -- reports
  echo "코드는 그대로 두고 리포트만 받았어요 (커밋 안 한 수정이 있음)"
fi
mkdir -p "$OUT"
# 날짜 폴더(26-11-09 형식)를 통째로 복사 → 바탕화면/사이트점검/26-11-09/점검_07-13.md
for d in reports/[0-9][0-9]-[0-9][0-9]-[0-9][0-9]/; do
  [ -d "$d" ] && cp -R "$d" "$OUT/"
done
LATEST_DIR=$(ls -d "$OUT"/[0-9][0-9]-[0-9][0-9]-[0-9][0-9] 2>/dev/null | sort | tail -n 1)
LATEST_FILE=$(ls -t "$LATEST_DIR"/*.md 2>/dev/null | head -n 1)
echo "[$(date '+%Y-%m-%d %H:%M')] 저장 위치: $OUT · 최신 $(basename "$LATEST_DIR")/$(basename "$LATEST_FILE")"
if [ $AUTO -eq 0 ]; then
  head -n 12 reports/latest.md
  [ -n "$LATEST_FILE" ] && open "$LATEST_FILE"
fi
