#!/usr/bin/env bash
# Finishing pass for delivery: broadcast-range colour (yuv420p, BT.709),
# a fresh 320 kbps AAC from the mastered WAV, and faststart for web playback.
# Usage: ./finalize.sh out/hibrands-promo-16x9.mp4 out/HiBrands-Promo-16x9.mp4 [audio.wav]
set -euo pipefail
in="$1"; out="$2"; audio="${3:-public/audio/soundtrack.wav}"
ffmpeg -hide_banner -v error -y -i "$in" -i "$audio" \
  -map 0:v:0 -map 1:a:0 \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -level 4.2 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 320k -ar 48000 \
  -movflags +faststart -shortest "$out"
echo "wrote $out"
