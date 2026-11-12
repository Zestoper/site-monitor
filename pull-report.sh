#!/bin/bash
# Mac에서 실행: GitHub에 쌓인 점검 리포트를 받아 저장소 옆 '사이트점검' 폴더에 날짜별로 저장한다.
# 사용법: bash pull-report.sh            (받고 최신 리포트 열기)
#         bash pull-report.sh --auto     (예약 실행용: 열지 않고 로그만 남김)
set -e
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"
AUTO=0; [ "$1" = "--auto" ] && AUTO=1
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
# 저장소 폴더 옆에 사이트점검 폴더를 만든다 (Developer에 있으면 ~/Developer/사이트점검)
OUT="$(dirname "$REPO_DIR")/사이트점검"

cd "$REPO_DIR"
# 맥북이 잠자기에서 깨어난 직후에는 와이파이가 아직 안 붙어 있을 수 있다 → 최대 10분 동안 30초마다 다시 시도
for i in $(seq 1 20); do
  git fetch --quiet origin main 2>/dev/null && break
  [ "$i" -eq 20 ] && { echo "[$(date '+%Y-%m-%d %H:%M')] 인터넷 연결이 안 돼서 못 받음 (10분 기다림)"; exit 1; }
  sleep 30
done

# 사이트점검 폴더에는 저장소 작업 상태와 상관없이 GitHub 최신 리포트를 그대로 풀어 넣는다
# (git archive 는 작업 중인 파일을 건드리지 않는다)
TMP="$(mktemp -d)"
git archive origin/main reports | tar -x -C "$TMP"
mkdir -p "$OUT"
for d in "$TMP"/reports/[0-9][0-9]-[0-9][0-9]-[0-9][0-9]; do
  [ -d "$d" ] && cp -R "$d" "$OUT/"     # 끝에 / 를 붙이면 macOS cp 가 폴더째가 아니라 안의 파일만 복사한다
done
rm -rf "$TMP"

# 저장소도 최신으로 맞춘다. 커밋 안 한 수정이 있어 안 되면 건드리지 않는다
if ! git merge --quiet --ff-only origin/main 2>/dev/null; then
  echo "저장소는 그대로 둠 (커밋 안 한 수정 또는 아직 안 올린 커밋이 있음)"
fi

LATEST_DIR=$(ls -d "$OUT"/[0-9][0-9]-[0-9][0-9]-[0-9][0-9] 2>/dev/null | sort | tail -n 1)
LATEST_FILE=$(ls -t "$LATEST_DIR"/*.md 2>/dev/null | head -n 1)
echo "[$(date '+%Y-%m-%d %H:%M')] 저장 위치: $OUT · 최신 $(basename "$LATEST_DIR")/$(basename "$LATEST_FILE")"
if [ $AUTO -eq 0 ]; then
  [ -n "$LATEST_FILE" ] && head -n 12 "$LATEST_FILE"
  [ -n "$LATEST_FILE" ] && open "$LATEST_FILE"
fi
