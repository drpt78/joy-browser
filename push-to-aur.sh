#!/usr/bin/env bash
# ── AUR push script for joy-browser 0.1.0 ──
# Prerequisites:
#   1. You have an AUR account (https://aur.archlinux.org)
#   2. Your SSH public key is registered at https://aur.archlinux.org/account/<you>/edit
#   3. You are already listed as Maintainer of the joy-browser package on AUR
#
# Run this script on your local Arch Linux machine.
set -euo pipefail

AUR_REPO="ssh://aur@aur.archlinux.org/joy-browser.git"
WORKDIR="$(mktemp -d)"

echo "==> Cloning AUR repo..."
git clone "$AUR_REPO" "$WORKDIR"

echo "==> Copying updated files..."
cp PKGBUILD .SRCINFO "$WORKDIR/"

cd "$WORKDIR"

echo "==> Verifying .SRCINFO matches PKGBUILD..."
# Optional: regenerate .SRCINFO if you have makepkg available
# makepkg --printsrcinfo > .SRCINFO

git add PKGBUILD .SRCINFO
git diff --cached   # review what's changing

echo "==> Committing..."
git commit -m "upgpkg: joy-browser 0.1.0"

echo "==> Pushing to AUR..."
git push origin master

echo "==> Done! Check https://aur.archlinux.org/packages/joy-browser"
rm -rf "$WORKDIR"
