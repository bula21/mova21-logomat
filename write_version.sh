#!/bin/bash

VERSION_FILE="dist/version.txt"
git rev-parse HEAD > "$VERSION_FILE"
git rev-parse --abbrev-ref HEAD >> "$VERSION_FILE"
git status --porcelain >> "$VERSION_FILE"
