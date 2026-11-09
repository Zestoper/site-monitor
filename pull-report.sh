#!/bin/bash
# Mac에서 실행: 최신 점검 리포트를 받아 바탕화면 '사이트점검' 폴더에 저장하고 연다.
# 사용법: bash pull-report.sh
set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$HOME/Desktop/사이트점검"

cd "$REPO_DIR"
git pull --quiet
mkdir -p "$OUT"
cp reports/*.md "$OUT/"
echo "저장 위치: $OUT"
head -n 12 reports/latest.md
open "$OUT/latest.md"
