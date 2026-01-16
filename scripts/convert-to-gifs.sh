#!/bin/bash

# Convert PNG frames to GIFs
FRAME_RATE=10
INPUT_DIR="/home/runner/work/HistTUI/HistTUI/gifs/.temp"
OUTPUT_DIR="/home/runner/work/HistTUI/HistTUI/gifs"

echo "🎬 Converting frames to GIFs..."

# Create 07-help-panel GIF (last 55 frames)
echo "Creating 07-help-panel.gif..."
mkdir -p "$OUTPUT_DIR/temp-07"
ls "$INPUT_DIR"/frame_*.png | tail -55 | xargs -I {} cp {} "$OUTPUT_DIR/temp-07/"
cd "$OUTPUT_DIR/temp-07"
ls frame_*.png | cat -n | while read n f; do mv "$f" "frame_$(printf %05d $n).png"; done
ffmpeg -y -framerate $FRAME_RATE -pattern_type glob -i 'frame_*.png' \
  -vf "fps=$FRAME_RATE,scale=1400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  "$OUTPUT_DIR/07-help-panel.gif" 2>&1 | grep -E "frame=|Output"

cd /home/runner/work/HistTUI/HistTUI
rm -rf "$OUTPUT_DIR/temp-07"

echo "✅ Created all GIFs in $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"/*.gif 2>/dev/null || echo "No GIFs created yet"
