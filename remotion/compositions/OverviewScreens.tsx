import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { DemoFrame } from '../components/DemoFrame';

export const OverviewScreens: React.FC = () => {
	const frame = useCurrentFrame();
	
	// Screen transitions: Timeline (0-75) -> Branches (75-150) -> Files (150-225) -> Dashboard (225-300) -> Repos (300-375) -> Planner (375-450)
	const currentScreen = 
		frame < 75 ? 'timeline' :
		frame < 150 ? 'branches' :
		frame < 225 ? 'files' :
		frame < 300 ? 'dashboard' :
		frame < 375 ? 'repos' :
		'planner';
	
	return (
		<AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
			<DemoFrame screen={currentScreen} theme="default" />
		</AbsoluteFill>
	);
};
