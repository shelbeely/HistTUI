import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DemoFrame } from '../components/DemoFrame';

export const TimelineNavigation: React.FC = () => {
	const frame = useCurrentFrame();
	
	// Calculate selected index based on frame (j/k navigation simulation)
	const selectedIndex = Math.floor((frame % 150) / 30);
	
	return (
		<AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
			<DemoFrame 
				screen="timeline" 
				theme="default" 
				selectedIndex={selectedIndex}
			/>
		</AbsoluteFill>
	);
};
