import React from 'react';
import { AbsoluteFill } from 'remotion';
import { DemoFrame } from '../components/DemoFrame';

export const CodePlanner: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
			<DemoFrame screen="planner" theme="default" />
		</AbsoluteFill>
	);
};
