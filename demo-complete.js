// HistTUI Complete Demo - Full Interactive JavaScript
// Remotion-compatible with proper state management

document.addEventListener('DOMContentLoaded', function() {
    // State Management
    const state = {
        currentScreen: 'timeline',
        currentTheme: 'default',
        helpVisible: false,
        selectedItems: {
            timeline: 0,
            branches: 0,
            files: 0,
            repos: 0,
            planner: 0
        }
    };

    // DOM Elements
    const terminal = document.getElementById('terminal');
    const screens = document.querySelectorAll('.screen');
    const tabs = document.querySelectorAll('.tab');
    const statusScreen = document.getElementById('status-screen');
    const helpPanel = document.getElementById('help-panel');
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Initialize
    initializeScreens();
    initializeKeyboardShortcuts();
    initializeThemeSelector();
    initializeClickHandlers();
    updateTime();
    setInterval(updateTime, 60000);

    // Screen Management
    function switchScreen(screenName) {
        // Hide all screens
        screens.forEach(screen => screen.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active'));

        // Show selected screen
        const screen = document.getElementById(`screen-${screenName}`);
        const tab = document.querySelector(`.tab[data-screen="${screenName}"]`);
        
        if (screen && tab) {
            screen.classList.add('active');
            tab.classList.add('active');
            state.currentScreen = screenName;
            
            // Update status bar
            const screenNames = {
                'timeline': 'Timeline',
                'branches': 'Branches & Tags',
                'files': 'File Tree',
                'dashboard': 'Activity Dashboard',
                'repos': 'Repository Manager',
                'planner': 'Code Planner',
                'commit-detail': 'Commit Details'
            };
            statusScreen.textContent = screenNames[screenName] || screenName;
        }
    }

    function initializeScreens() {
        // Tab click handlers
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const screenName = this.dataset.screen;
                switchScreen(screenName);
            });
        });
    }

    // Keyboard Shortcuts
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Prevent default for all our shortcuts
            const handled = handleKeyPress(e);
            if (handled) {
                e.preventDefault();
            }
        });
    }

    function handleKeyPress(e) {
        const key = e.key;
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;

        // Toggle help with ?
        if (key === '?' && !shift) {
            toggleHelp();
            return true;
        }

        // Screen switching with numbers 1-6
        if (key >= '1' && key <= '6' && !ctrl) {
            const screenMap = {
                '1': 'timeline',
                '2': 'branches',
                '3': 'files',
                '4': 'dashboard',
                '5': 'repos',
                '6': 'planner'
            };
            switchScreen(screenMap[key]);
            return true;
        }

        // Navigation keys
        if (key === 'j' || key === 'ArrowDown') {
            moveSelection('down');
            return true;
        }
        if (key === 'k' || key === 'ArrowUp') {
            moveSelection('up');
            return true;
        }
        if (key === 'g' && !shift) {
            moveSelection('first');
            return true;
        }
        if (key === 'G' && shift) {
            moveSelection('last');
            return true;
        }

        // Enter to select
        if (key === 'Enter') {
            handleEnterKey();
            return true;
        }

        // Search
        if (key === '/') {
            showAlert('Search', 'Try: author:name, after:2024-01-01, path:src/', 'Type to search commits and files');
            return true;
        }

        // Quit
        if (key === 'q') {
            showAlert('Quit', 'This is a demo!', 'Press OK to continue exploring.');
            return true;
        }

        // Back navigation
        if (key === 'Escape' || key === 'h' || key === 'ArrowLeft') {
            if (state.currentScreen === 'commit-detail') {
                switchScreen('timeline');
                return true;
            }
        }

        // Diff toggle on commit detail screen
        if (key === 'd' && state.currentScreen === 'commit-detail') {
            showAlert('Toggle Diff', 'Diff view toggled!', 'In the real app, this switches between unified and split diff views.');
            return true;
        }

        // Repo manager actions
        if (state.currentScreen === 'repos') {
            if (key === 'a') {
                showAlert('Add Repository', 'Add new repository', 'Enter path or URL:\n~/projects/my-repo');
                return true;
            }
            if (key === 'd') {
                showAlert('Delete Repository', 'Delete selected repository?', 'This will remove it from cache.');
                return true;
            }
            if (key === 'u') {
                showAlert('Update Repository', 'Updating from remote...', 'Fetching latest changes...');
                return true;
            }
        }

        // Code planner actions
        if (state.currentScreen === 'planner') {
            if (key === 'n') {
                showAlert('New Specification', 'Create new spec', 'Choose template:\n✨ Feature\n🐛 Bug Fix\n♻️ Refactor');
                return true;
            }
            if (key === 'c') {
                showAlert('Context Manager', 'Manage context', 'Add files and documentation for AI context.');
                return true;
            }
            if (key === 't') {
                showAlert('Templates', 'Browse templates', 'Select from available specification templates.');
                return true;
            }
        }

        return false;
    }

    function toggleHelp() {
        state.helpVisible = !state.helpVisible;
        if (helpPanel) {
            helpPanel.style.display = state.helpVisible ? 'block' : 'none';
        }
    }

    function moveSelection(direction) {
        const screen = state.currentScreen;
        const items = document.querySelectorAll(`#screen-${screen} .commit-item, #screen-${screen} .branch-item, #screen-${screen} .tree-item, #screen-${screen} .repo-item, #screen-${screen} .spec-item`);
        
        if (items.length === 0) return;

        const currentIndex = state.selectedItems[screen] || 0;
        let newIndex = currentIndex;

        switch(direction) {
            case 'down':
                newIndex = Math.min(currentIndex + 1, items.length - 1);
                break;
            case 'up':
                newIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'first':
                newIndex = 0;
                break;
            case 'last':
                newIndex = items.length - 1;
                break;
        }

        if (newIndex !== currentIndex) {
            items[currentIndex].classList.remove('selected');
            items[newIndex].classList.add('selected');
            items[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            state.selectedItems[screen] = newIndex;
        }
    }

    function handleEnterKey() {
        const screen = state.currentScreen;

        if (screen === 'timeline') {
            // Show commit detail
            const selectedCommit = document.querySelector('#screen-timeline .commit-item.selected');
            if (selectedCommit) {
                const hash = selectedCommit.dataset.hash;
                const message = selectedCommit.querySelector('.commit-message').textContent;
                updateCommitDetail(hash, message);
                switchScreen('commit-detail');
            }
        } else if (screen === 'branches') {
            const selectedBranch = document.querySelector('#screen-branches .branch-item.selected');
            if (selectedBranch) {
                const branchName = selectedBranch.querySelector('.branch-name').textContent;
                showAlert('Switch Branch', `Viewing history for: ${branchName}`, 'Press 1 to see commit timeline.');
            }
        } else if (screen === 'files') {
            const selectedFile = document.querySelector('#screen-files .tree-item.selected');
            if (selectedFile) {
                const fileName = selectedFile.querySelector('.tree-name').textContent;
                const isFolder = selectedFile.classList.contains('folder');
                if (isFolder) {
                    showAlert('Open Folder', `Expanding: ${fileName}`, 'Navigate nested directories');
                } else {
                    showAlert('View File', `Opening: ${fileName}`, 'File content viewer with syntax highlighting');
                }
            }
        } else if (screen === 'repos') {
            const selectedRepo = document.querySelector('#screen-repos .repo-item.selected');
            if (selectedRepo) {
                const repoName = selectedRepo.querySelector('.repo-name').textContent;
                showAlert('Switch Repository', `Switching to: ${repoName}`, 'Loading cached repository...');
            }
        } else if (screen === 'planner') {
            const selectedSpec = document.querySelector('#screen-planner .spec-item.selected');
            if (selectedSpec) {
                const specTitle = selectedSpec.querySelector('.spec-title').textContent;
                showAlert('Edit Specification', `Editing: ${specTitle}`, 'Open specification editor');
            }
        }
    }

    function updateCommitDetail(hash, message) {
        const hashElements = document.querySelectorAll('#screen-commit-detail .commit-hash');
        hashElements.forEach(el => el.textContent = hash);
        
        const messageElement = document.querySelector('#screen-commit-detail .meta-value:last-child');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }

    // Theme Management
    function initializeThemeSelector() {
        themeToggle.addEventListener('click', function() {
            themeMenu.style.display = themeMenu.style.display === 'none' ? 'block' : 'none';
        });

        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.dataset.theme;
                applyTheme(theme);
                themeMenu.style.display = 'none';
            });
        });

        // Close theme menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
                themeMenu.style.display = 'none';
            }
        });
    }

    function applyTheme(themeName) {
        state.currentTheme = themeName;
        terminal.dataset.theme = themeName;
        
        // Announce theme change
        const themeNames = {
            'default': 'Default (Material Design 3)',
            'calm': 'Calm (Autism-Friendly)',
            'high-contrast': 'High Contrast',
            'colorblind': 'Colorblind Safe',
            'monochrome': 'Monochrome Focus'
        };
        
        console.log(`Theme changed to: ${themeNames[themeName]}`);
    }

    // Click Handlers
    function initializeClickHandlers() {
        // Commit items
        document.querySelectorAll('.commit-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                const screen = 'timeline';
                const items = document.querySelectorAll('#screen-timeline .commit-item');
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                state.selectedItems[screen] = index;
            });
        });

        // Branch items
        document.querySelectorAll('.branch-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                const screen = 'branches';
                const items = document.querySelectorAll('#screen-branches .branch-item');
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                state.selectedItems[screen] = index;
            });
        });

        // Tree items
        document.querySelectorAll('.tree-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                const screen = 'files';
                const items = document.querySelectorAll('#screen-files .tree-item');
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                state.selectedItems[screen] = index;
            });
        });

        // Repo items
        document.querySelectorAll('.repo-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                const screen = 'repos';
                const items = document.querySelectorAll('#screen-repos .repo-item');
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                state.selectedItems[screen] = index;
            });
        });

        // Spec items
        document.querySelectorAll('.spec-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                const screen = 'planner';
                const items = document.querySelectorAll('#screen-planner .spec-item');
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                state.selectedItems[screen] = index;
            });
        });

        // Tab buttons in branches screen
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                tabButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                showAlert('Switch Tab', `Switched to: ${this.textContent}`, 'View branches or tags');
            });
        });
    }

    // Utility Functions
    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const timeElement = document.getElementById('status-time');
        if (timeElement) {
            timeElement.textContent = timeStr;
        }
    }

    function showAlert(title, message, detail) {
        const alertMessage = detail ? `${message}\n\n${detail}` : message;
        alert(`${title}\n\n${alertMessage}`);
    }

    // Visual feedback for key presses
    let keyPressTimeout;
    document.addEventListener('keydown', function(e) {
        clearTimeout(keyPressTimeout);
        
        const statusBar = document.querySelector('.status-bar');
        let keyDisplay = document.getElementById('key-display');
        
        if (!keyDisplay) {
            keyDisplay = document.createElement('span');
            keyDisplay.id = 'key-display';
            keyDisplay.style.cssText = 'position: absolute; right: 150px; background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 4px; font-size: 12px;';
            statusBar.style.position = 'relative';
            statusBar.appendChild(keyDisplay);
        }
        
        const keyText = e.ctrlKey ? `Ctrl+${e.key}` : (e.shiftKey ? `Shift+${e.key}` : e.key);
        keyDisplay.textContent = keyText;
        keyDisplay.style.display = 'inline-block';
        
        keyPressTimeout = setTimeout(() => {
            keyDisplay.style.display = 'none';
        }, 500);
    });

    // Console welcome message
    console.log('%c🚀 HistTUI Complete Demo', 'font-size: 20px; font-weight: bold; color: #6750A4;');
    console.log('%c\n📋 All 6 Screens Implemented:', 'font-size: 14px; font-weight: bold; color: #61afef;');
    console.log('1️⃣  Timeline - Browse commits');
    console.log('2️⃣  Branches - Manage branches & tags');
    console.log('3️⃣  Files - Explore file tree');
    console.log('4️⃣  Dashboard - View statistics');
    console.log('5️⃣  Repos - Multi-repo manager');
    console.log('6️⃣  Code Planner - AI-powered planning');
    console.log('\n%c⌨️  Keyboard Shortcuts:', 'font-size: 14px; font-weight: bold; color: #98c379;');
    console.log('• j/k or ↑/↓ - Navigate items');
    console.log('• g/G - Jump to first/last');
    console.log('• 1-6 - Switch screens');
    console.log('• ? - Toggle help');
    console.log('• Enter - Select item');
    console.log('• / - Search');
    console.log('• q - Quit (shows alert in demo)');
    console.log('\n%c🎨 Themes (click Theme button):', 'font-size: 14px; font-weight: bold; color: #c678dd;');
    console.log('• Default (Material Design 3)');
    console.log('• Calm (Autism-Friendly)');
    console.log('• High Contrast');
    console.log('• Colorblind Safe');
    console.log('• Monochrome Focus');
    console.log('\n%c✅ Remotion-compatible structure', 'color: #f9f1a5;');
    console.log('%cAll screens are fully functional with visual accuracy!', 'color: #6B7280;');

    // Remotion compatibility marker
    window.histtuiDemo = {
        version: '1.0.0',
        screens: ['timeline', 'branches', 'files', 'dashboard', 'repos', 'planner', 'commit-detail'],
        state: state,
        api: {
            switchScreen: switchScreen,
            applyTheme: applyTheme,
            moveSelection: moveSelection,
            getCurrentScreen: () => state.currentScreen,
            getCurrentTheme: () => state.currentTheme
        }
    };
});
