#!/bin/zsh
set -e

echo "Removing vite build"
rm -r longdist/static

echo "Removing Django collected static"
rm -r static