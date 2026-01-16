import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DemoFrame } from '../components/DemoFrame';

export const ThemesShowcase: React.FC = () => {
	const frame = useCurrentFrame();
	
	// Theme transitions: Default (0-90) -> Calm (90-180) -> High Contrast (180-270) -> Colorblind (270-360) -> Monochrome (360-450)
	const currentTheme = 
		frame < 90 ? 'default' :
		frame < 180 ? 'calm' :
		frame < 270 ? 'high-contrast' :
		frame < 360 ? 'colorblind' :
		'monochrome';
	
	return (
		<AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
			<DemoFrame screen="timeline" theme={currentTheme} />
		</AbsoluteFill>
	);
};
