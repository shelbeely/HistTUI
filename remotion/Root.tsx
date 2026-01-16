import { Composition } from 'remotion';
import { OverviewScreens } from './compositions/OverviewScreens';
import { TimelineNavigation } from './compositions/TimelineNavigation';
import { ThemesShowcase } from './compositions/ThemesShowcase';
import { DashboardStats } from './compositions/DashboardStats';
import { FileTreeExplorer } from './compositions/FileTreeExplorer';
import { CodePlanner } from './compositions/CodePlanner';
import { HelpPanel } from './compositions/HelpPanel';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="overview-screens"
				component={OverviewScreens}
				durationInFrames={450}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="timeline-navigation"
				component={TimelineNavigation}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="themes-showcase"
				component={ThemesShowcase}
				durationInFrames={450}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="dashboard-stats"
				component={DashboardStats}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="file-tree-explorer"
				component={FileTreeExplorer}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="code-planner"
				component={CodePlanner}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="help-panel"
				component={HelpPanel}
				durationInFrames={180}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
};
