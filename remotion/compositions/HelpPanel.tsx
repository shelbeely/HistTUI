import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DemoFrame } from '../components/DemoFrame';

export const HelpPanel: React.FC = () => {
	const frame = useCurrentFrame();
	const showHelp = frame > 30 && frame < 150;
	
	return (
		<AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
			<DemoFrame screen="timeline" theme="default" showHelp={showHelp} />
		</AbsoluteFill>
	);
};
