#!/usr/bin/env bash
# Runs the WordPress demo locally in Playground (PHP as WebAssembly) on :9400, with the theme, content,
# fixtures and PHP tests mounted. MSYS_NO_PATHCONV stops Git Bash on Windows rewriting /wordpress paths.
cd "$(dirname "$0")/.."
HERE="$(pwd -W 2>/dev/null || pwd)"
MSYS_NO_PATHCONV=1 npx -y @wp-playground/cli@3.1.55 server --port=9400 --login --blueprint=tests/wp/blueprint.local.json \
  --mount-dir "$HERE/wp-theme/pfc-programme" /wordpress/wp-content/themes/pfc-programme \
  --mount-dir "$HERE/wordpress" /wordpress/pfc-import \
  --mount-dir "$HERE/fixtures" /wordpress/pfc-fixtures \
  --mount-dir "$HERE/tests/wp" /wordpress/pfc-tests
