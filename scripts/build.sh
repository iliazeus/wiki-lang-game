#!/usr/bin/env bash

set -e

esbuild \
  --bundle --sourcemap=inline --minify --charset=utf8 \
  --format=iife --global-name=WikiLangGame \
  --outfile=./wiki-lang-game.bundle.js \
  ./src/index.ts
