// HistTUI Demo - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const tabs = document.querySelectorAll('.tab');
    const helpPanel = document.getElementById('help-panel');
    let helpVisible = false;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            
            // Update screen name in status bar
            const screenName = this.textContent.split(':')[1].trim();
            document.querySelector('.status-screen').textContent = screenName;
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Toggle help with ?
        if (e.key === '?' && !e.shiftKey) {
            helpVisible = !helpVisible;
            helpPanel.style.display = helpVisible ? 'block' : 'none';
            e.preventDefault();
        }
        
        // Navigate screens with numbers 1-6
        if (e.key >= '1' && e.key <= '6') {
            const index = parseInt(e.key) - 1;
            if (tabs[index]) {
                tabs[index].click();
            }
            e.preventDefault();
        }
        
        // Navigate commit list with j/k
        const selectedItem = document.querySelector('.commit-item.selected');
        if (selectedItem) {
            if (e.key === 'j' || e.key === 'ArrowDown') {
                const next = selectedItem.nextElementSibling;
                if (next && next.classList.contains('commit-item')) {
                    selectedItem.classList.remove('selected');
                    next.classList.add('selected');
                    next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                e.preventDefault();
            } else if (e.key === 'k' || e.key === 'ArrowUp') {
                const prev = selectedItem.previousElementSibling;
                if (prev && prev.classList.contains('commit-item')) {
                    selectedItem.classList.remove('selected');
                    prev.classList.add('selected');
                    prev.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                e.preventDefault();
            } else if (e.key === 'g') {
                // Jump to top
                const firstItem = document.querySelector('.commit-item');
                if (firstItem) {
                    selectedItem.classList.remove('selected');
                    firstItem.classList.add('selected');
                    firstItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                e.preventDefault();
            } else if (e.key === 'G' && e.shiftKey) {
                // Jump to bottom
                const items = document.querySelectorAll('.commit-item');
                const lastItem = items[items.length - 1];
                if (lastItem) {
                    selectedItem.classList.remove('selected');
                    lastItem.classList.add('selected');
                    lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
                e.preventDefault();
            }
        }
        
        // Show alert for q (quit)
        if (e.key === 'q') {
            alert('This is a demo! Press OK to continue exploring.\n\nIn the real app, this would quit.');
            e.preventDefault();
        }
        
        // Show alert for / (search)
        if (e.key === '/') {
            alert('This is a demo! Search functionality would open here.\n\nTry: author:name, after:2024-01-01, path:src/');
            e.preventDefault();
        }
        
        // Show alert for Enter
        if (e.key === 'Enter') {
            const selected = document.querySelector('.commit-item.selected');
            if (selected) {
                const hash = selected.querySelector('.commit-hash').textContent;
                const message = selected.querySelector('.commit-message').textContent;
                alert(`This is a demo! Commit details would open here.\n\n${hash}: ${message}\n\nThe real app shows:\n• Full commit info\n• File changes\n• Syntax-highlighted diffs`);
            }
            e.preventDefault();
        }
    });

    // Click on commit items to select
    const commitItems = document.querySelectorAll('.commit-item');
    commitItems.forEach(item => {
        item.addEventListener('click', function() {
            commitItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Add visual feedback for keyboard use
    const statusBar = document.querySelector('.status-bar');
    let keyPressTimeout;
    
    document.addEventListener('keydown', function(e) {
        // Show which key was pressed
        clearTimeout(keyPressTimeout);
        
        const keyDisplay = document.createElement('span');
        keyDisplay.className = 'key-display';
        keyDisplay.textContent = e.key.length === 1 ? e.key : e.key;
        keyDisplay.style.cssText = 'position: absolute; right: 150px; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 12px;';
        
        statusBar.style.position = 'relative';
        statusBar.appendChild(keyDisplay);
        
        keyPressTimeout = setTimeout(() => {
            if (keyDisplay.parentNode) {
                keyDisplay.remove();
            }
        }, 500);
    });

    // Update time every minute
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.querySelectorAll('.status-time').forEach(el => {
            el.textContent = timeStr;
        });
    }, 60000);

    // Add welcome message
    console.log('%c🚀 HistTUI Demo', 'font-size: 20px; font-weight: bold; color: #6750A4;');
    console.log('%cTry these keyboard shortcuts:', 'font-size: 14px; color: #61afef;');
    console.log('• j/k or ↑/↓ - Navigate commits');
    console.log('• g/G - Jump to first/last');
    console.log('• 1-6 - Switch screens');
    console.log('• ? - Toggle help');
    console.log('• Enter - View commit details');
    console.log('• / - Search');
    console.log('• q - Quit (shows alert in demo)');
    console.log('\n%cThis is a static HTML/CSS replica of the terminal UI.', 'color: #f9f1a5;');
    console.log('%cThe real app uses React + Ink for terminal rendering.', 'color: #6B7280;');
});
