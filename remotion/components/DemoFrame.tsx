import React, { useEffect, useRef } from 'react';
import { Iframe } from 'remotion';

interface DemoFrameProps {
	screen: string;
	theme: string;
	selectedIndex?: number;
	showHelp?: boolean;
}

export const DemoFrame: React.FC<DemoFrameProps> = ({ 
	screen, 
	theme, 
	selectedIndex = 0,
	showHelp = false 
}) => {
	return (
		<div style={{
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#1a1a1a',
			padding: '40px'
		}}>
			<Iframe
				src={`file:///home/runner/work/HistTUI/HistTUI/demo-complete.html?screen=${screen}&theme=${theme}&selected=${selectedIndex}&help=${showHelp}`}
				style={{
					width: '1200px',
					height: '640px',
					border: 'none',
					borderRadius: '8px',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
				}}
			/>
		</div>
	);
};
