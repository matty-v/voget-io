#!/usr/bin/env bash
set -euo pipefail
[[ "$AFTER_SHA" =~ ^[0-9a-f]{40}$ ]]
git cat-file -e "${AFTER_SHA}^{commit}"
[[ "$(git rev-parse --verify HEAD)" == "$AFTER_SHA" ]]
if [[ "$EVENT_NAME" == workflow_dispatch ]]; then
  echo 'changed=true' >> "$GITHUB_OUTPUT"
  exit 0
fi
[[ "$EVENT_NAME" == push ]]
[[ "$BEFORE_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ "$BEFORE_SHA" != 0000000000000000000000000000000000000000 ]]
git cat-file -e "${BEFORE_SHA}^{commit}"
set +e
git diff --no-ext-diff --no-textconv --quiet "$BEFORE_SHA" "$AFTER_SHA" -- gateway/
result=$?
set -e
case "$result" in
  0) echo 'changed=false' >> "$GITHUB_OUTPUT" ;;
  1) echo 'changed=true' >> "$GITHUB_OUTPUT" ;;
  *) exit "$result" ;;
esac
