# 🔧 Troubleshooting Guide

**Complete Troubleshooting Guide for HistTUI**

This guide covers common issues, error messages, diagnostic commands, and recovery procedures for every HistTUI feature.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Setup & Installation](#-setup--installation)
- [Configuration Issues](#-configuration-issues)
- [Repository Management](#-repository-management)
- [Agent Backend Issues](#-agent-backend-issues)
- [Performance Issues](#-performance-issues)
- [Network & API Issues](#-network--api-issues)
- [Build & Runtime Issues](#-build--runtime-issues)
- [Component Rendering](#-component-rendering)
- [Cache Issues](#-cache-issues)
- [Diagnostic Commands](#-diagnostic-commands)
- [Error Reference](#-error-reference)

---

## 🌟 Overview

### How to Use This Guide

1. **Find your issue** in the table of contents
2. **Read symptoms** to confirm the problem
3. **Follow solutions** step-by-step
4. **Run verification** commands
5. **Check error reference** if needed

### Getting Help

If this guide doesn't solve your issue:

- **GitHub Issues:** [github.com/histtui/histtui/issues](https://github.com/histtui/histtui/issues)
- **Logs:** Check `~/.histtui/logs/` for detailed error logs
- **Verbose Mode:** Run with `--verbose` flag for detailed output

---

## 🚀 Setup & Installation

### Issue: Bun Not Installed

**Symptoms:**
- `bun: command not found`
- Cannot run any Bun commands

**Solution:**

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add to PATH (if not auto-added)
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
bun --version
```

**Verification:**
```bash
bun --version
# Expected: 1.3.5 or higher
```

---

### Issue: Setup Wizard Won't Start

**Symptoms:**
- HistTUI launches but no setup wizard appears
- Skips directly to repository input

**Causes:**
- Config file already exists
- Previous incomplete setup

**Solution:**

```bash
# Check if config exists
ls -la ~/.histtui/config.json

# Remove config to trigger wizard
rm ~/.histtui/config.json

# Restart HistTUI
histtui
```

**Verification:**
```bash
# Config should not exist
test ! -f ~/.histtui/config.json && echo "Config removed, wizard will run"
```

---

### Issue: API Key Validation Fails

**Symptoms:**
- "Invalid API key format" error
- Key rejected during setup

**Causes:**
- Incorrect key format
- Extra spaces or characters
- Wrong provider selected

**Solution:**

```bash
# Verify key format
echo "sk-..." | wc -c

# Check for hidden characters
cat -A ~/.histtui/config.json | grep apiKey

# Correct common formats:
# OpenAI: sk-...
# Anthropic: sk-ant-...
# OpenRouter: sk-or-...

# Test API key
provider="openai"  # Change as needed
apiKey="sk-..."    # Your key

case $provider in
  openai)
    curl https://api.openai.com/v1/models \
      -H "Authorization: Bearer $apiKey"
    ;;
  anthropic)
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $apiKey" \
      -H "anthropic-version: 2023-06-01" \
      -X POST -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'
    ;;
esac
```

**Verification:**
```bash
# Should return HTTP 200 or list of models
# Not 401 Unauthorized
```

---

## ⚙️ Configuration Issues

### Issue: Configuration File Corrupted

**Symptoms:**
- "Failed to parse config" error
- HistTUI won't start

**Causes:**
- Invalid JSON syntax
- Missing commas or quotes
- Encoding issues

**Solution:**

```bash
# Validate JSON
jq empty ~/.histtui/config.json 2>&1

# If invalid, check for errors
cat ~/.histtui/config.json | json_pp

# Backup and fix
cp ~/.histtui/config.json ~/.histtui/config.json.broken

# Create minimal valid config
cat > ~/.histtui/config.json << 'EOF'
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000
}
EOF

# Restore LLM config manually
jq '.llm = {"provider":"openai","apiKey":"sk-..."}' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

**Verification:**
```bash
jq empty ~/.histtui/config.json && echo "Valid JSON" || echo "Still invalid"
```

---

### Issue: Config Changes Not Applied

**Symptoms:**
- Modified config but changes don't take effect
- Still using old values

**Causes:**
- HistTUI caches config in memory
- File permissions prevent writing
- Wrong config file location

**Solution:**

```bash
# Ensure config is in correct location
ls -la ~/.histtui/config.json

# Check permissions
ls -l ~/.histtui/config.json
# Should show: -rw-------  (600)

# Fix permissions
chmod 600 ~/.histtui/config.json

# Restart HistTUI to reload config
# (Config is loaded on startup)

# Verify config is being read
strace -e open histtui 2>&1 | grep config.json
```

**Verification:**
```bash
# Display loaded config value
jq '.maxCommits' ~/.histtui/config.json
# Should match your change
```

---

## 📚 Repository Management

### Issue: Repository Clone Fails

**Symptoms:**
- "Failed to clone repository" error
- Network timeout
- Authentication required

**Causes:**
- Invalid repository URL
- Network connectivity issues
- Private repository (no credentials)
- Disk space full

**Solution:**

```bash
# Test repository URL
git clone https://github.com/user/repo /tmp/test-clone
cd /tmp/test-clone && git log -1

# Check network connectivity
ping github.com

# Test HTTPS vs SSH
git clone git@github.com:user/repo /tmp/test-ssh

# Check disk space
df -h ~/.histtui/cache

# For private repos, use SSH or credentials
git config --global credential.helper store

# Retry with verbose logging
GIT_CURL_VERBOSE=1 histtui https://github.com/user/repo --verbose
```

**Verification:**
```bash
# Successful clone creates cache
ls -la ~/.histtui/cache/
```

---

### Issue: Repository Shows 0 Commits

**Symptoms:**
- Repository clones successfully
- But shows 0 commits in timeline

**Causes:**
- Empty repository
- Wrong branch checked out
- Indexing failed silently

**Solution:**

```bash
# Check repository has commits
cd ~/.histtui/cache/<hash>/
git log --oneline | head -10

# Check branch
git branch -a

# Check SQLite database
sqlite3 ~/.histtui/cache/<hash>/histtui.db "SELECT COUNT(*) FROM commits;"

# Re-index manually
rm ~/.histtui/cache/<hash>/histtui.db
histtui <repo-url>  # Will re-index
```

**Verification:**
```bash
# Should show commit count
sqlite3 ~/.histtui/cache/<hash>/histtui.db "SELECT COUNT(*) FROM commits;"
```

---

### Issue: Cache Directory Too Large

**Symptoms:**
- Disk space running low
- Cache directory > 5 GB

**Causes:**
- Many cached repositories
- Large repositories
- Old caches not cleaned

**Solution:**

```bash
# Check cache size
du -sh ~/.histtui/cache/*/ | sort -hr

# Identify largest caches
du -sh ~/.histtui/cache/*/ | sort -hr | head -10

# Delete specific cache
rm -rf ~/.histtui/cache/<hash>/

# Delete caches older than 30 days
find ~/.histtui/cache/ -maxdepth 1 -type d -mtime +30 -exec rm -rf {} \;

# Delete caches with < 100 commits
for dir in ~/.histtui/cache/*/; do
  commits=$(sqlite3 "$dir/histtui.db" "SELECT COUNT(*) FROM commits;" 2>/dev/null || echo "0")
  if [ "$commits" -lt 100 ]; then
    echo "Deleting $dir (only $commits commits)"
    rm -rf "$dir"
  fi
done
```

**Verification:**
```bash
du -sh ~/.histtui/cache/
# Should be reduced
```

---

## 🤖 Agent Backend Issues

### Issue: Agent Server Won't Start

**Symptoms:**
- "Failed to start agent server" error
- Port already in use
- Server exits immediately

**Causes:**
- Port 3001 already in use
- Missing configuration
- Invalid API key

**Solution:**

```bash
# Check if port is in use
lsof -i :3001

# Kill process using port 3001
kill -9 $(lsof -t -i:3001)

# Verify config exists
cat ~/.histtui/config.json | jq '.llm'

# Start agent manually to see errors
bun agent-server/server.ts

# Use different port
PORT=3002 bun agent-server/server.ts

# Update config with new port
jq '.agui.endpoint = "http://localhost:3002/api/agent"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

**Verification:**
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","provider":"...","model":"..."}
```

---

### Issue: Agent Connection Timeout

**Symptoms:**
- "Cannot connect to agent" error
- Requests timeout
- No response from agent

**Causes:**
- Agent server not running
- Wrong endpoint URL
- Firewall blocking connection

**Solution:**

```bash
# Check if agent is running
curl http://localhost:3001/health

# Check endpoint in config
jq '.agui.endpoint' ~/.histtui/config.json

# Test network connectivity
telnet localhost 3001

# Check firewall
sudo ufw status  # Ubuntu
# OR
sudo iptables -L  # Other Linux

# Allow port 3001
sudo ufw allow 3001

# Restart agent server
pkill -f "agent-server"
bun run agent
```

**Verification:**
```bash
curl -X POST http://localhost:3001/api/agent \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","context":{},"action":"analyze"}'
# Should stream SSE events
```

---

### Issue: API Rate Limit Exceeded

**Symptoms:**
- "Rate limit exceeded" error
- 429 HTTP status
- Requests rejected

**Causes:**
- Too many requests to LLM API
- Exceeded quota
- Burst limit reached

**Solution:**

```bash
# Check API usage (OpenAI)
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Wait for rate limit reset (usually 60s)
sleep 60

# Reduce request frequency
# (Edit agent code to add delays)

# Use different model (may have different limits)
jq '.llm.model = "gpt-3.5-turbo"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json

# Switch to Ollama (no rate limits)
jq '.llm.provider = "ollama"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

**Verification:**
```bash
# Test API is working
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## ⚡ Performance Issues

### Issue: Slow Repository Indexing

**Symptoms:**
- Indexing takes > 5 minutes
- HistTUI appears frozen

**Causes:**
- Very large repository (>10K commits)
- Slow disk I/O
- Insufficient RAM

**Solution:**

```bash
# Limit commits to index
histtui <repo-url> --max-commits 5000

# Update config permanently
jq '.maxCommits = 5000' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json

# Use faster cache directory (SSD)
jq '.cacheDir = "/mnt/ssd/histtui-cache"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json

# Check system resources
top  # Monitor CPU/RAM usage during indexing

# Increase swap if low RAM
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**Verification:**
```bash
# Monitor indexing progress
tail -f ~/.histtui/logs/histtui.log  # If logs enabled
```

---

### Issue: High Memory Usage

**Symptoms:**
- HistTUI using > 1 GB RAM
- System becomes slow

**Causes:**
- Large commit diffs in memory
- Many concurrent operations
- Memory leak

**Solution:**

```bash
# Check memory usage
ps aux | grep histtui

# Reduce max commits
jq '.maxCommits = 1000' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json

# Restart HistTUI
pkill histtui
histtui <repo-url>

# Monitor memory over time
while true; do
  ps aux | grep histtui | grep -v grep
  sleep 5
done
```

**Verification:**
```bash
# Memory should be < 500 MB for normal repos
ps aux | grep histtui | awk '{print $6}'
```

---

## 🌐 Network & API Issues

### Issue: Cannot Reach GitHub

**Symptoms:**
- "Could not resolve host" error
- Network timeout

**Causes:**
- No internet connection
- DNS issues
- GitHub down
- Firewall blocking

**Solution:**

```bash
# Test internet connectivity
ping google.com

# Test GitHub specifically
ping github.com

# Check DNS resolution
nslookup github.com

# Try alternative DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# Check GitHub status
curl https://www.githubstatus.com/api/v2/status.json

# Use proxy if needed
export https_proxy=http://proxy:port
export http_proxy=http://proxy:port
histtui <repo-url>
```

**Verification:**
```bash
curl -I https://github.com
# Should return HTTP/2 200
```

---

## 🔨 Build & Runtime Issues

### Issue: Build Fails

**Symptoms:**
- `bun run build` fails
- TypeScript errors
- Missing dependencies

**Causes:**
- Node modules not installed
- TypeScript version mismatch
- Corrupt lock file

**Solution:**

```bash
# Install dependencies
bun install

# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# Check TypeScript version
bun run typecheck

# Fix specific errors
# (Read error messages and fix source)

# Verify Bun version
bun --version
# Should be >= 1.3.5
```

**Verification:**
```bash
bun run build
# Should complete without errors
ls -la dist/cli.js  # Should exist
```

---

### Issue: Runtime Error on Launch

**Symptoms:**
- HistTUI crashes on startup
- Uncaught exception
- Missing module

**Causes:**
- Corrupt build
- Missing native dependencies
- Environment issues

**Solution:**

```bash
# Rebuild
bun run build

# Check for native dependencies
ldd dist/cli.js  # If applicable

# Run with error details
bun --inspect dist/cli.js

# Check environment
echo $NODE_ENV
echo $PATH

# Reset to clean state
rm -rf dist/
rm -rf node_modules/
bun install
bun run build
```

**Verification:**
```bash
bun run start
# Should launch without errors
```

---

## 🎨 Component Rendering

### Issue: UI Not Rendering Correctly

**Symptoms:**
- Garbled text
- Missing components
- Layout broken

**Causes:**
- Terminal doesn't support required features
- Small terminal size
- Color mode issues

**Solution:**

```bash
# Check terminal size
tput cols
tput lines
# Minimum: 80x24

# Resize terminal
# (Manually resize window)

# Check color support
echo $COLORTERM
# Should show 'truecolor' or '24bit'

# Test 24-bit color
printf "\x1b[38;2;255;100;0mTRUECOLOR\x1b[0m\n"

# Try different terminal
# - iTerm2 (macOS)
# - Windows Terminal (Windows)
# - GNOME Terminal (Linux)

# Disable animations if glitchy
jq '.ui.animations = "none"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

**Verification:**
```bash
# Should see colors and proper layout
histtui <repo-url>
```

---

## 💾 Cache Issues

### Issue: Cache Corruption

**Symptoms:**
- "Database corrupted" error
- Cannot open repository
- SQLite errors

**Causes:**
- Disk write error
- HistTUI crash during index
- Power loss during write

**Solution:**

```bash
# Locate corrupted cache
cache_hash="<hash>"  # From error message

# Try SQLite recovery
sqlite3 ~/.histtui/cache/$cache_hash/histtui.db ".recover" > /tmp/recovered.sql
sqlite3 ~/.histtui/cache/$cache_hash/histtui-recovered.db < /tmp/recovered.sql

# If recovery fails, delete and re-index
rm ~/.histtui/cache/$cache_hash/histtui.db
histtui <repo-url>

# Or delete entire cache
rm -rf ~/.histtui/cache/$cache_hash/
histtui <repo-url>
```

**Verification:**
```bash
sqlite3 ~/.histtui/cache/$cache_hash/histtui.db "SELECT COUNT(*) FROM commits;"
# Should return number
```

---

## 🔍 Diagnostic Commands

### System Information

```bash
# Bun version
bun --version

# Node.js version (if applicable)
node --version

# OS information
uname -a

# Terminal information
echo $TERM
echo $COLORTERM
```

### HistTUI Information

```bash
# HistTUI version
histtui --version

# Configuration
cat ~/.histtui/config.json | jq '.'

# Cache status
du -sh ~/.histtui/cache/
ls -la ~/.histtui/cache/
```

### Repository Diagnostics

```bash
# Verify repository
cd ~/.histtui/cache/<hash>/
git status
git log --oneline | head -10

# Check database
sqlite3 histtui.db ".tables"
sqlite3 histtui.db "SELECT COUNT(*) FROM commits;"
sqlite3 histtui.db "PRAGMA integrity_check;"
```

### Agent Server Diagnostics

```bash
# Agent server status
curl http://localhost:3001/health

# Agent server logs
# (If logging enabled, check logs directory)

# Test agent request
curl -X POST http://localhost:3001/api/agent \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","context":{},"action":"analyze"}' \
  --no-buffer
```

### Network Diagnostics

```bash
# DNS resolution
nslookup github.com

# Connection test
telnet github.com 443

# HTTPS test
curl -I https://github.com

# Proxy settings
echo $http_proxy
echo $https_proxy
```

---

## 📖 Error Reference

### Configuration Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Config not found` | No config file | Run setup wizard |
| `Invalid JSON` | Syntax error | Validate with `jq` |
| `Missing API key` | No apiKey field | Run setup or add manually |

### Git Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Repository not found` | Invalid URL | Check URL is correct |
| `Authentication failed` | Private repo | Use SSH or credentials |
| `Clone failed` | Network issue | Check connectivity |

### Database Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Database corrupted` | Write error | Recover or delete cache |
| `Table not found` | Incomplete index | Re-index repository |
| `Disk I/O error` | Full disk | Free up space |

### Agent Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot connect to agent` | Agent not running | Start agent server |
| `API key invalid` | Wrong key | Update config |
| `Rate limit exceeded` | Too many requests | Wait or use different model |

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Automated Diagnostics

**Step 0:** Run full diagnostic

```bash
#!/bin/bash
echo "=== HistTUI Diagnostics ==="

echo "1. System Info"
echo "Bun: $(bun --version)"
echo "OS: $(uname -a)"

echo "2. Config Status"
if [ -f ~/.histtui/config.json ]; then
  echo "Config exists"
  jq empty ~/.histtui/config.json && echo "Valid JSON" || echo "Invalid JSON"
else
  echo "No config found"
fi

echo "3. Cache Status"
cache_size=$(du -sh ~/.histtui/cache/ 2>/dev/null | cut -f1)
echo "Cache size: ${cache_size:-0}"

echo "4. Agent Status"
agent_status=$(curl -s http://localhost:3001/health 2>/dev/null)
if [ -n "$agent_status" ]; then
  echo "Agent: Running"
  echo "$agent_status" | jq '.'
else
  echo "Agent: Not running"
fi

echo "5. Network Status"
ping -c 1 github.com > /dev/null 2>&1 && echo "Network: OK" || echo "Network: Failed"
```

**Step 1:** Fix common issues automatically

```bash
#!/bin/bash
# Auto-fix script

# Fix 1: Permissions
chmod 600 ~/.histtui/config.json 2>/dev/null
chmod 700 ~/.histtui 2>/dev/null

# Fix 2: Validate config
if [ -f ~/.histtui/config.json ]; then
  jq empty ~/.histtui/config.json 2>/dev/null || {
    echo "Invalid JSON, backing up..."
    cp ~/.histtui/config.json ~/.histtui/config.json.broken
    echo '{"cacheDir":"~/.histtui/cache","maxCommits":10000}' > ~/.histtui/config.json
  }
fi

# Fix 3: Clear old caches
find ~/.histtui/cache/ -maxdepth 1 -type d -mtime +60 -exec rm -rf {} \;

# Fix 4: Kill stale processes
pkill -f "agent-server" 2>/dev/null

echo "Auto-fix complete"
```

**Step 2:** Generate diagnostic report

```bash
#!/bin/bash
# Generate diagnostic report

report_file="/tmp/histtui-diagnostic-$(date +%Y%m%d-%H%M%S).txt"

{
  echo "HistTUI Diagnostic Report"
  echo "Generated: $(date)"
  echo "=========================="
  echo ""
  
  echo "System:"
  bun --version
  uname -a
  echo ""
  
  echo "Config:"
  cat ~/.histtui/config.json | jq '.' 2>&1
  echo ""
  
  echo "Caches:"
  du -sh ~/.histtui/cache/*/ 2>&1
  echo ""
  
  echo "Agent:"
  curl -s http://localhost:3001/health 2>&1
  echo ""
  
} > "$report_file"

echo "Report saved to: $report_file"
cat "$report_file"
```

</details>

---

**Last Updated:** 2026-01-14  
**HistTUI Version:** 1.1.0  
**Issues Documented:** 30+  
**Diagnostic Commands:** 50+
