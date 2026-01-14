# 📚 Multi-Repository Management

**Manage Multiple Git Repositories with HistTUI**

HistTUI supports working with multiple repositories through an intelligent caching system. Clone once, switch instantly between repositories without re-downloading.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Repository Manager Screen](#-repository-manager-screen)
- [Keyboard Shortcuts](#️-keyboard-shortcuts)
- [Cache Structure](#-cache-structure)
- [Switching Repositories](#-switching-repositories)
- [Deleting Repository Cache](#-deleting-repository-cache)
- [Cache Management](#-cache-management)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

### Why Multi-Repo Support?

**Benefits:**
- ✅ **Clone Once** - Repository stays cached locally
- ✅ **Instant Switching** - No re-cloning needed
- ✅ **Work Offline** - Access cached repos without network
- ✅ **Save Time** - Fast context switching between projects
- ✅ **Save Bandwidth** - Download repositories only once

### How It Works

```
1. First time: histtui https://github.com/user/repo1
   ↓
   Clone to ~/.histtui/cache/<hash1>/
   Index commits to SQLite database
   
2. Switch repos: Press '5' → Select repo2
   ↓
   Clone to ~/.histtui/cache/<hash2>/
   Index commits to SQLite database
   
3. Next time: histtui https://github.com/user/repo1
   ↓
   Use existing cache (instant!)
   No network required
```

---

## 📊 Repository Manager Screen

### Access the Manager

**Press `5` from any screen** to open the Repository Manager.

```
┌─────────────────────────────────────────────────────────┐
│  📚 Repository Manager (3 repos)                        │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │  ▶ awesome-tui              [CURRENT]            │  │
│  │    https://github.com/user/awesome-tui            │  │
│  │    1,234 commits  •  Updated: 2h ago              │  │
│  │    Path: ~/.histtui/cache/a1b2c3d4                │  │
│  ├───────────────────────────────────────────────────┤  │
│  │    another-project                                │  │
│  │    https://github.com/user/another-project        │  │
│  │    567 commits  •  Updated: 1d ago                │  │
│  │    Path: ~/.histtui/cache/e5f6g7h8                │  │
│  ├───────────────────────────────────────────────────┤  │
│  │    old-repo                                       │  │
│  │    https://github.com/user/old-repo               │  │
│  │    89 commits  •  Updated: 7d ago                 │  │
│  │    Path: ~/.histtui/cache/i9j0k1l2                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Actions ────────────────────────────────────────┐   │
│  │  Enter - Switch to selected repository           │   │
│  │  d     - Delete selected repository cache        │   │
│  │  ↑/↓   - Navigate (or k/j)                       │   │
│  │  Esc/q - Go back                                 │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Screen Components

**1. Repository List**
- Shows all cached repositories
- Sorted by last updated (most recent first)
- Current repository highlighted with `[CURRENT]` badge

**2. Repository Details** (per entry)
- Repository name
- Full URL
- Commit count
- Last updated time (relative: "2h ago", "1d ago")
- Local cache path

**3. Selection Indicator**
- `▶` arrow shows selected repository
- Cyan border around selected item
- Current repo has green `[CURRENT]` badge

**4. Actions Panel**
- Quick reference for keyboard shortcuts
- Color-coded by function

---

## ⌨️ Keyboard Shortcuts

### Navigation

| Key | Action | Description |
|-----|--------|-------------|
| `↓` | Move Down | Select next repository |
| `↑` | Move Up | Select previous repository |
| `j` | Move Down | Vim-style down navigation |
| `k` | Move Up | Vim-style up navigation |

### Actions

| Key | Action | Description |
|-----|--------|-------------|
| `Enter` | Switch Repository | Load selected repository and return to previous screen |
| `d` | Delete Cache | Remove selected repository from cache (requires confirmation) |
| `Esc` | Go Back | Return to previous screen without changes |
| `q` | Go Back | Alternative exit (same as Esc) |

### Tips

💡 **Use Vim keys** (`j`/`k`) for faster navigation  
💡 **Current repo indicator** - Cannot delete the currently active repository  
💡 **Instant switching** - No loading time for cached repos

---

## 💾 Cache Structure

### Cache Directory

**Location:** `~/.histtui/cache/`

Each repository is stored in a **hashed subdirectory** based on its URL:

```
~/.histtui/
├── cache/
│   ├── a1b2c3d4e5f6/          ← Repository 1
│   │   ├── .git/              (Git repository)
│   │   ├── histtui.db         (SQLite commit index)
│   │   └── cache-info.json    (Metadata)
│   │
│   ├── f7g8h9i0j1k2/          ← Repository 2
│   │   ├── .git/
│   │   ├── histtui.db
│   │   └── cache-info.json
│   │
│   └── l3m4n5o6p7q8/          ← Repository 3
│       ├── .git/
│       ├── histtui.db
│       └── cache-info.json
│
└── config.json                 (HistTUI configuration)
```

### cache-info.json Structure

Each repository cache includes metadata:

```json
{
  "repoUrl": "https://github.com/user/awesome-tui",
  "repoName": "awesome-tui",
  "lastUpdated": "2026-01-14T10:23:00.000Z",
  "commitCount": 1234
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `repoUrl` | string | Full Git repository URL (normalized) |
| `repoName` | string | Repository name extracted from URL |
| `lastUpdated` | ISO 8601 | Timestamp of last cache update |
| `commitCount` | number | Total commits indexed in database |

### Hash Algorithm

Repository URLs are hashed to create consistent, unique directory names:

```typescript
// Example hashing
normalizeRepoUrl("https://github.com/user/repo")
  → "github.com/user/repo"
  
getRepoHash("github.com/user/repo")
  → "a1b2c3d4e5f6" (first 12 chars of SHA-256 hash)
```

**Why hashing?**
- ✅ Consistent naming across machines
- ✅ No special characters or spaces
- ✅ Fixed-length directory names
- ✅ URL-independent of protocol (http/https/ssh)

### Storage Size

**Typical cache size per repository:**

| Repository Size | Cache Size | Notes |
|-----------------|------------|-------|
| Small (< 100 commits) | 5-20 MB | Mainly Git objects |
| Medium (100-1K commits) | 20-100 MB | Git + SQLite index |
| Large (1K-10K commits) | 100-500 MB | Full history + index |
| Very Large (10K+ commits) | 500MB - 2GB+ | Consider shallow clone |

**SQLite Database (`histtui.db`):**
- Typically 1-10 MB
- Indexed commits, files, authors
- Fast queries for large repos

---

## 🔄 Switching Repositories

### Method 1: Repository Manager (Recommended)

```
1. Press '5' to open Repository Manager
2. Use ↑/↓ or k/j to select repository
3. Press Enter to switch
4. HistTUI reloads with new repository
```

**Advantages:**
- ✅ Visual selection
- ✅ See commit counts and last updated
- ✅ Browse all cached repos

---

### Method 2: Command Line

```bash
# Launch with specific repository URL
histtui https://github.com/user/repo

# If cached: Instant load from cache
# If not cached: Clone and index first
```

**Advantages:**
- ✅ Quick command-line access
- ✅ Can be scripted
- ✅ Works from anywhere

---

### Method 3: Recent Repositories

HistTUI automatically sorts repositories by **last updated**, so your most recent repos appear first in the manager.

```
Recent:
  ▶ project-current    (2h ago)   ← Most recent
    project-yesterday  (1d ago)
    project-old        (7d ago)   ← Least recent
```

---

## 🗑️ Deleting Repository Cache

### Why Delete Cache?

- Free up disk space
- Remove repositories you no longer need
- Clear out outdated or corrupted caches
- Start fresh with a repository

### How to Delete

**Step 1:** Open Repository Manager (`5`)

**Step 2:** Navigate to repository you want to delete

**Step 3:** Press `d`

**Step 4:** Confirmation prompt appears:

```
┌─────────────────────────────────────────────┐
│  ⚠️  Delete Repository Cache?               │
├─────────────────────────────────────────────┤
│  Repository: awesome-tui                    │
│  Path: ~/.histtui/cache/a1b2c3d4            │
│  Size: 125 MB                               │
│                                              │
│  This will delete:                          │
│  • Git repository clone                     │
│  • SQLite commit index                      │
│  • Cache metadata                           │
│                                              │
│  Are you sure? (y/N)                        │
└─────────────────────────────────────────────┘
```

**Step 5:** Press `y` to confirm, `n` to cancel

### What Gets Deleted

When you delete a repository cache:

✅ **Git repository** (`.git/` and all files)  
✅ **SQLite database** (`histtui.db`)  
✅ **Cache metadata** (`cache-info.json`)  
✅ **Entire cache directory** for that repository

❌ **Does NOT affect:**
- HistTUI configuration (`~/.histtui/config.json`)
- Other cached repositories
- Remote repository (GitHub/GitLab/etc.)

### Restrictions

**Cannot delete currently active repository:**

```
┌─────────────────────────────────────────────┐
│  ❌ Cannot Delete Active Repository         │
├─────────────────────────────────────────────┤
│  Repository: awesome-tui [CURRENT]          │
│                                              │
│  This repository is currently in use.       │
│  Please switch to another repository first. │
│                                              │
│  Press any key to continue                  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Cache Management

### View Cache Size

```bash
# Show total cache size
du -sh ~/.histtui/cache/

# Show size per repository
du -sh ~/.histtui/cache/*/

# Show detailed breakdown
du -h ~/.histtui/cache/* | sort -hr
```

**Example output:**
```
450M    ~/.histtui/cache/a1b2c3d4
125M    ~/.histtui/cache/f7g8h9i0
50M     ~/.histtui/cache/l3m4n5o6
```

---

### Manual Cache Cleanup

```bash
# List all cached repositories
ls -la ~/.histtui/cache/

# Remove specific repository cache
rm -rf ~/.histtui/cache/a1b2c3d4/

# Clear ALL caches (nuclear option)
rm -rf ~/.histtui/cache/*

# Clear only old caches (not accessed in 30 days)
find ~/.histtui/cache/ -maxdepth 1 -type d -mtime +30 -exec rm -rf {} \;
```

⚠️ **Warning:** Manual deletion bypasses confirmation prompts!

---

### Update Repository Cache

To refresh a repository with latest changes:

```bash
# Method 1: Delete and re-clone (via Repository Manager)
1. Press '5'
2. Select repository
3. Press 'd' to delete
4. Re-run: histtui <repo-url>

# Method 2: Manual git pull (advanced)
cd ~/.histtui/cache/<hash>/
git pull origin main
# Then restart HistTUI to re-index
```

---

### Cache Directory Configuration

Change the cache location in config:

```bash
# Edit config
nano ~/.histtui/config.json

# Update cacheDir field
{
  "cacheDir": "/path/to/custom/cache",
  ...
}
```

**Alternative locations:**
- `/tmp/histtui-cache` - Temporary (cleared on reboot)
- `~/Documents/histtui-cache` - User documents
- `/data/histtui-cache` - Custom data partition

⚠️ **Note:** Existing caches won't move automatically!

---

## 🔍 Troubleshooting

### Issue: Repository Manager Shows "No Cached Repositories"

**Symptoms:**
- Empty repository list
- Message: "No repositories have been cached yet"

**Causes:**
- Fresh HistTUI installation
- Cache directory cleared
- Wrong cache directory path

**Solutions:**

```bash
# Check if cache directory exists
ls -la ~/.histtui/cache/

# Verify cache directory in config
jq '.cacheDir' ~/.histtui/config.json

# Launch with a repository to create first cache
histtui https://github.com/user/repo
```

---

### Issue: Repository Shows Wrong Commit Count

**Symptoms:**
- Commit count doesn't match GitHub
- Outdated commit count

**Causes:**
- Repository updated since last cache
- Incomplete indexing

**Solutions:**

```bash
# Option 1: Delete and re-clone
# (Use Repository Manager: Press '5' → Select repo → Press 'd')

# Option 2: Manual update
cd ~/.histtui/cache/<hash>/
git pull
# Restart HistTUI to trigger re-indexing
```

---

### Issue: Cannot Switch to Repository

**Symptoms:**
- Enter key doesn't work
- No response when selecting repository

**Causes:**
- Corrupted cache
- Missing database file
- Permission issues

**Solutions:**

```bash
# Check cache integrity
ls -la ~/.histtui/cache/<hash>/

# Verify database exists
ls -la ~/.histtui/cache/<hash>/histtui.db

# Check permissions
ls -ld ~/.histtui/cache/<hash>/

# Fix permissions if needed
chmod -R u+rwX ~/.histtui/cache/<hash>/

# If still broken, delete and re-clone
rm -rf ~/.histtui/cache/<hash>/
histtui <repo-url>
```

---

### Issue: Cache Directory Too Large

**Symptoms:**
- Disk space running low
- Cache directory > 5 GB

**Solutions:**

```bash
# Identify largest caches
du -sh ~/.histtui/cache/*/ | sort -hr | head -10

# Delete old/unused repositories via UI
# Press '5' → Select → Press 'd'

# Or delete manually (specific repo)
rm -rf ~/.histtui/cache/<hash>/

# Nuclear option: Clear all caches
rm -rf ~/.histtui/cache/*
```

---

### Issue: Repository URL Changed

**Symptoms:**
- Same repository appears twice (old and new URL)
- Cannot access repository after URL change

**Causes:**
- Repository renamed on GitHub
- Organization changed
- URL protocol changed (http → https)

**Solutions:**

```bash
# Option 1: Delete old cache, use new URL
# Press '5' → Select old → Press 'd'
# Then: histtui <new-url>

# Option 2: Manually update cache-info.json
cd ~/.histtui/cache/<hash>/
nano cache-info.json
# Update "repoUrl" field
# Restart HistTUI
```

---

### Issue: Permission Denied on Cache Directory

**Symptoms:**
- Cannot access cache
- "Permission denied" errors

**Solutions:**

```bash
# Check ownership
ls -ld ~/.histtui/cache/

# Fix ownership (replace USER with your username)
sudo chown -R USER:USER ~/.histtui/cache/

# Fix permissions
chmod -R u+rwX ~/.histtui/cache/
```

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Automated Cache Management

**Step 0:** Check cache directory

```bash
# Verify cache exists
if [ -d ~/.histtui/cache ]; then
  echo "Cache directory exists"
  ls -la ~/.histtui/cache/
else
  echo "No cache directory"
  mkdir -p ~/.histtui/cache
fi
```

**Step 1:** List cached repositories

```bash
# List all cache directories
ls -1 ~/.histtui/cache/

# Get repository info from each cache
for cache_dir in ~/.histtui/cache/*/; do
  if [ -f "${cache_dir}cache-info.json" ]; then
    echo "Repository: $(jq -r '.repoName' ${cache_dir}cache-info.json)"
    echo "URL: $(jq -r '.repoUrl' ${cache_dir}cache-info.json)"
    echo "Commits: $(jq -r '.commitCount' ${cache_dir}cache-info.json)"
    echo "Updated: $(jq -r '.lastUpdated' ${cache_dir}cache-info.json)"
    echo "---"
  fi
done
```

**Step 2:** Calculate cache sizes

```bash
# Total cache size
total_size=$(du -sh ~/.histtui/cache/ | cut -f1)
echo "Total cache: $total_size"

# Size per repository
for cache_dir in ~/.histtui/cache/*/; do
  size=$(du -sh "$cache_dir" | cut -f1)
  name=$(basename "$cache_dir")
  echo "$name: $size"
done | sort -hr
```

**Step 3:** Clean old caches

```bash
# Delete caches older than 30 days
find ~/.histtui/cache/ -maxdepth 1 -type d -mtime +30 | while read dir; do
  echo "Deleting old cache: $dir"
  rm -rf "$dir"
done

# Or delete caches with fewer than N commits
for cache_dir in ~/.histtui/cache/*/; do
  if [ -f "${cache_dir}cache-info.json" ]; then
    commit_count=$(jq -r '.commitCount' ${cache_dir}cache-info.json)
    if [ "$commit_count" -lt 10 ]; then
      echo "Deleting small cache: $cache_dir ($commit_count commits)"
      rm -rf "$cache_dir"
    fi
  fi
done
```

**Step 4:** Update repository cache

```bash
# Pull latest changes for specific repository
cache_hash="a1b2c3d4"  # Replace with actual hash
cd ~/.histtui/cache/$cache_hash/

# Update Git repository
git pull origin main || git pull origin master

# Update cache-info.json timestamp
jq ".lastUpdated = \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\"" cache-info.json > /tmp/cache-info.json
mv /tmp/cache-info.json cache-info.json

# Trigger re-indexing by restarting HistTUI
```

**Step 5:** Migrate cache to new location

```bash
# Move cache to new location
NEW_CACHE="/path/to/new/cache"
mkdir -p "$NEW_CACHE"
mv ~/.histtui/cache/* "$NEW_CACHE"/

# Update config
jq ".cacheDir = \"$NEW_CACHE\"" ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json

# Verify
ls -la "$NEW_CACHE"
```

## Cache Information Queries

```bash
# Get repository count
cache_count=$(ls -1 ~/.histtui/cache/ | wc -l)
echo "Cached repositories: $cache_count"

# Get most recently used repository
most_recent=$(find ~/.histtui/cache/ -name "cache-info.json" -exec jq -r '. | "\(.lastUpdated) \(.repoName)"' {} \; | sort -r | head -1)
echo "Most recent: $most_recent"

# Get total commit count across all caches
total_commits=0
for cache_dir in ~/.histtui/cache/*/; do
  if [ -f "${cache_dir}cache-info.json" ]; then
    commits=$(jq -r '.commitCount' ${cache_dir}cache-info.json)
    total_commits=$((total_commits + commits))
  fi
done
echo "Total commits indexed: $total_commits"

# List repositories by size
du -sh ~/.histtui/cache/*/ | sort -hr
```

</details>

---

**Last Updated:** 2026-01-14  
**HistTUI Version:** 1.1.0  
**Component:** RepoManagerScreen.tsx
