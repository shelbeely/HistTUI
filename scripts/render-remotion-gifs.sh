#!/bin/bash

# Script to render all Remotion compositions as GIFs
# Requires: remotion CLI installed (npm install -D remotion @remotion/cli)

set -e

echo "🎬 Rendering Remotion compositions to GIFs..."

# Create output directory
mkdir -p gifs/remotion

# Render each composition
echo "📊 Rendering overview-screens..."
npx remotion render overview-screens gifs/remotion/01-overview-screens.mp4 --codec h264

echo "🔍 Rendering timeline-navigation..."
npx remotion render timeline-navigation gifs/remotion/02-timeline-navigation.mp4 --codec h264

echo "🎨 Rendering themes-showcase..."
npx remotion render themes-showcase gifs/remotion/03-themes-showcase.mp4 --codec h264

echo "📈 Rendering dashboard-stats..."
npx remotion render dashboard-stats gifs/remotion/04-dashboard-stats.mp4 --codec h264

echo "🌳 Rendering file-tree-explorer..."
npx remotion render file-tree-explorer gifs/remotion/05-file-tree.mp4 --codec h264

echo "🎯 Rendering code-planner..."
npx remotion render code-planner gifs/remotion/06-code-planner.mp4 --codec h264

echo "❓ Rendering help-panel..."
npx remotion render help-panel gifs/remotion/07-help-panel.mp4 --codec h264

# Convert MP4s to GIFs using ffmpeg
echo "🔄 Converting to GIFs..."
for mp4 in gifs/remotion/*.mp4; do
    gif="${mp4%.mp4}.gif"
    ffmpeg -i "$mp4" -vf "fps=15,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$gif" -y
    echo "✅ Created $gif"
done

echo "🎉 All Remotion GIFs generated!"
echo "📁 Output: gifs/remotion/"
