#!/usr/bin/env bash

set -e

esbuild \
  --bundle --sourcemap=inline --minify --charset=utf8 \
  --format=iife --global-name=WikiLangGame \
  --outfile=./www/index.bundle.js \
  ./src/index.ts
