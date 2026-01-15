import React from 'react';
import { AbsoluteFill } from 'remotion';
import { DemoFrame } from '../components/DemoFrame';

export const FileTreeExplorer: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
			<DemoFrame screen="files" theme="default" />
		</AbsoluteFill>
	);
};
