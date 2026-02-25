#!/usr/bin/env bash
set -euo pipefail

CONFIG="config.json"

current=$(grep -m1 '"version"' "$CONFIG" | sed 's/.*"\([0-9]*\.[0-9]*\.[0-9]*\)".*/\1/')
major=$(echo "$current" | cut -d. -f1)
minor=$(echo "$current" | cut -d. -f2)
patch=$(echo "$current" | cut -d. -f3)
new_patch=$((patch + 1))
new_version="$major.$minor.$new_patch"

sed -i '' "s/\"version\": \"$current\"/\"version\": \"$new_version\"/" "$CONFIG"
echo "Version bumped: $current → $new_version"

stencil bundle
