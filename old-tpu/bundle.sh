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

# Update the theme name to include the new version number
current_name=$(python3 -c "import json; print(json.load(open('$CONFIG'))['name'])")
base_name=$(echo "$current_name" | sed 's/ [0-9]*\.[0-9]*\.[0-9]*$//')
sed -i '' "s/\"name\": \"$current_name\"/\"name\": \"$base_name $new_version\"/" "$CONFIG"

echo "Version bumped: $current → $new_version"
echo "Theme name: $base_name $new_version"

stencil bundle
