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
# 한 번 점검에서 나온 페이지 리포트(점검_)와 API 리포트(API_)를 '리포트_시각.md' 하나로 합친다
# → 하루 두 번 점검이면 날짜 폴더에 '오전 리포트.md' · '오후 리포트.md' 2개만 생긴다 (.json 은 가져오지 않음)
for d in "$TMP"/reports/[0-9][0-9]-[0-9][0-9]-[0-9][0-9]; do
  [ -d "$d" ] || continue
  day="$(basename "$d")"
  rm -rf "$OUT/$day" && mkdir -p "$OUT/$day"       # 이 스크립트가 만든 사본만 새로 만든다
  apis=$(ls "$d"/API_*.md 2>/dev/null | sort)
  for page in $(ls "$d"/점검_*.md 2>/dev/null | sort); do
    t="$(basename "$page" .md)"; t="${t#점검_}"      # 07-13
    # 같은 실행의 API 리포트 = 페이지 점검 시각 이후 가장 먼저 나온 것
    api=""
    for a in $apis; do
      at="$(basename "$a" .md)"; at="${at#API_}"
      if [[ ! "$at" < "$t" ]]; then api="$a"; break; fi
    done
    # 12시 전에 돈 점검은 '오전 리포트' · 그 뒤는 '오후 리포트'. 같은 때 여러 번 돌았으면 (2) (3)을 붙인다
    if [ "${t%%-*}" -lt 12 ]; then half="오전"; else half="오후"; fi
    name="$half 리포트.md"; n=2
    while [ -e "$OUT/$day/$name" ]; do name="$half 리포트 ($n).md"; n=$((n + 1)); done
    { cat "$page"; [ -n "$api" ] && { printf '\n\n---\n\n'; cat "$api"; }; } > "$OUT/$day/$name"
  done
  # 주 1회 기능 시나리오는 따로 둔다
  for sc in "$d"/시나리오_*.md; do [ -f "$sc" ] && cp "$sc" "$OUT/$day/"; done
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
