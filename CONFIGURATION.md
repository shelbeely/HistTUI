# ⚙️ Configuration Reference

**Complete Guide to HistTUI Configuration Options**

HistTUI is highly configurable through the `~/.histtui/config.json` file, environment variables, and command-line arguments. This guide documents every configuration option available.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Configuration File](#-configuration-file)
- [LLM Configuration](#-llm-configuration)
- [AG-UI Configuration](#-ag-ui-configuration)
- [Theme Configuration](#-theme-configuration)
- [Accessibility Configuration](#-accessibility-configuration)
- [Time Tracking Configuration](#-time-tracking-configuration)
- [UI Configuration](#-ui-configuration)
- [Key Bindings](#️-key-bindings)
- [Environment Variables](#-environment-variables)
- [Command-Line Arguments](#-command-line-arguments)
- [Default Values](#-default-values)

---

## 🌟 Overview

### Configuration Hierarchy

HistTUI loads configuration in this order (later sources override earlier):

```
1. Built-in defaults (src/config/index.ts)
2. Configuration file (~/.histtui/config.json)
3. Environment variables (HISTTUI_*)
4. Command-line arguments (--flag)
```

### Configuration File Location

```
~/.histtui/config.json
```

**Permissions:** 600 (owner read/write only)  
**Format:** JSON  
**Encoding:** UTF-8

---

## 📄 Configuration File

### Complete Structure

```json
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000,
  "defaultBranch": "main",
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo",
    "baseUrl": null
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  },
  "keyBindings": {
    "quit": ["q", "ctrl+c"],
    "help": ["?", "h"],
    "search": ["/", "ctrl+f"],
    "navigate": {
      "up": ["k", "up"],
      "down": ["j", "down"],
      "left": ["h", "left"],
      "right": ["l", "right"],
      "pageUp": ["ctrl+u", "pageup"],
      "pageDown": ["ctrl+d", "pagedown"],
      "home": ["g", "home"],
      "end": ["G", "end"]
    },
    "tabs": {
      "next": ["tab", "ctrl+n"],
      "prev": ["shift+tab", "ctrl+p"],
      "timeline": ["1"],
      "branches": ["2"],
      "files": ["3"],
      "dashboards": ["4"],
      "repoManager": ["5"]
    }
  },
  "theme": {
    "name": "Default",
    "colors": {
      "primary": "#61afef",
      "secondary": "#56b6c2",
      "success": "#98c379",
      "warning": "#e5c07b",
      "error": "#e06c75",
      "info": "#c678dd",
      "background": "#282c34",
      "foreground": "#abb2bf",
      "muted": "#5c6370",
      "border": "#3e4451",
      "focusBorder": "#61afef"
    },
    "accessibility": {
      "highContrast": false,
      "reducedMotion": false,
      "colorblindSafe": false
    }
  },
  "accessibility": {
    "reducedMotion": false,
    "highContrast": false,
    "focusIndicatorStyle": "default",
    "screenReaderMode": false,
    "largeText": false
  },
  "timeTracking": {
    "enabled": true,
    "idleTimeout": 300,
    "sessionGap": 900,
    "trackFiles": true,
    "trackLanguages": true
  },
  "ui": {
    "theme": "default",
    "showBreadcrumbs": true,
    "showHelpHints": true,
    "progressiveDisclosure": false,
    "animations": "full"
  }
}
```

### Root Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cacheDir` | string | `~/.histtui/cache` | Directory for repository caches |
| `maxCommits` | number | `10000` | Maximum commits to index |
| `defaultBranch` | string | `main` | Default branch name |

---

## 🤖 LLM Configuration

### Configuration Object

```json
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo",
    "baseUrl": null
  }
}
```

### LLM Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `provider` | string | Yes | - | LLM provider name |
| `apiKey` | string | Conditional | - | API authentication key |
| `model` | string | No | Provider default | Model identifier |
| `baseUrl` | string | No | `null` | Custom API base URL |

### Providers

#### OpenAI

```json
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo"
  }
}
```

**Models:**
- `gpt-4-turbo` (default)
- `gpt-4`
- `gpt-3.5-turbo`

**API Key:** Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

#### Anthropic

```json
{
  "llm": {
    "provider": "anthropic",
    "apiKey": "sk-ant-...",
    "model": "claude-3-5-sonnet-20241022"
  }
}
```

**Models:**
- `claude-3-5-sonnet-20241022` (default)
- `claude-3-opus-20240229`
- `claude-3-haiku-20240307`

**API Key:** Get from [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

---

#### OpenRouter

```json
{
  "llm": {
    "provider": "openrouter",
    "apiKey": "sk-or-...",
    "model": "anthropic/claude-3.5-sonnet",
    "baseUrl": "https://openrouter.ai/api/v1"
  }
}
```

**Popular Models:**
- `openai/gpt-4-turbo`
- `anthropic/claude-3.5-sonnet`
- `google/gemini-pro-1.5`
- `meta-llama/llama-3.1-405b-instruct`

**API Key:** Get from [openrouter.ai/keys](https://openrouter.ai/keys)

---

#### Ollama

```json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3.1",
    "baseUrl": "http://localhost:11434"
  }
}
```

**Popular Models:**
- `llama3.1` (default)
- `codellama`
- `mistral`
- `deepseek-coder`

**Note:** No API key required for Ollama

---

## 🎨 AG-UI Configuration

### Configuration Object

```json
{
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
```

### AG-UI Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable AG-UI features |
| `endpoint` | string | `http://localhost:3001/api/agent` | Agent server endpoint |

### Examples

**Enable AG-UI (default endpoint):**
```json
{
  "agui": {
    "enabled": true
  }
}
```

**Custom endpoint:**
```json
{
  "agui": {
    "enabled": true,
    "endpoint": "http://192.168.1.100:3001/api/agent"
  }
}
```

**Disable AG-UI:**
```json
{
  "agui": {
    "enabled": false
  }
}
```

---

## 🎨 Theme Configuration

### Theme Object

```json
{
  "theme": {
    "name": "Default",
    "colors": { /* ... */ },
    "accessibility": { /* ... */ }
  }
}
```

### Color Options

| Color | Type | Default | Usage |
|-------|------|---------|-------|
| `primary` | string | `#61afef` | Primary actions, highlights |
| `secondary` | string | `#56b6c2` | Secondary actions |
| `success` | string | `#98c379` | Success states |
| `warning` | string | `#e5c07b` | Warnings |
| `error` | string | `#e06c75` | Errors |
| `info` | string | `#c678dd` | Information |
| `background` | string | `#282c34` | Background color |
| `foreground` | string | `#abb2bf` | Text color |
| `muted` | string | `#5c6370` | Dimmed text |
| `border` | string | `#3e4451` | Borders |
| `focusBorder` | string | `#61afef` | Focused element borders |

### Theme Accessibility Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `highContrast` | boolean | `false` | High contrast mode |
| `reducedMotion` | boolean | `false` | Reduce animations |
| `colorblindSafe` | boolean | `false` | Colorblind-safe palette |

See [MATERIAL_DESIGN_3.md](./MATERIAL_DESIGN_3.md) for Material Design 3 color tokens.

---

## ♿ Accessibility Configuration

### Configuration Object

```json
{
  "accessibility": {
    "reducedMotion": false,
    "highContrast": false,
    "focusIndicatorStyle": "default",
    "screenReaderMode": false,
    "largeText": false
  }
}
```

### Accessibility Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reducedMotion` | boolean | `false` | Disable animations |
| `highContrast` | boolean | `false` | Increase contrast |
| `focusIndicatorStyle` | string | `default` | Focus style (see below) |
| `screenReaderMode` | boolean | `false` | Optimize for screen readers |
| `largeText` | boolean | `false` | Use larger text |

### Focus Indicator Styles

- `default` - Subtle border
- `bold-border` - Thick border
- `highlight` - Background highlight

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for details.

---

## ⏱️ Time Tracking Configuration

### Configuration Object

```json
{
  "timeTracking": {
    "enabled": true,
    "idleTimeout": 300,
    "sessionGap": 900,
    "trackFiles": true,
    "trackLanguages": true
  }
}
```

### Time Tracking Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable time tracking |
| `idleTimeout` | number | `300` | Idle timeout (seconds) |
| `sessionGap` | number | `900` | Session gap (seconds) |
| `trackFiles` | boolean | `true` | Track file-level activity |
| `trackLanguages` | boolean | `true` | Track language statistics |

---

## 🖥️ UI Configuration

### Configuration Object

```json
{
  "ui": {
    "theme": "default",
    "showBreadcrumbs": true,
    "showHelpHints": true,
    "progressiveDisclosure": false,
    "animations": "full"
  }
}
```

### UI Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `default` | Theme name |
| `showBreadcrumbs` | boolean | `true` | Show navigation breadcrumbs |
| `showHelpHints` | boolean | `true` | Show keyboard hints |
| `progressiveDisclosure` | boolean | `false` | Progressive UI disclosure |
| `animations` | string | `full` | Animation level (see below) |

### Animation Levels

- `full` - All animations (default)
- `reduced` - Essential animations only
- `none` - No animations

---

## ⌨️ Key Bindings

### Global Keys

```json
{
  "keyBindings": {
    "quit": ["q", "ctrl+c"],
    "help": ["?", "h"],
    "search": ["/", "ctrl+f"]
  }
}
```

| Action | Default Keys | Description |
|--------|--------------|-------------|
| `quit` | `q`, `Ctrl+C` | Quit application |
| `help` | `?`, `h` | Show help |
| `search` | `/`, `Ctrl+F` | Open search |

### Navigation Keys

```json
{
  "navigate": {
    "up": ["k", "up"],
    "down": ["j", "down"],
    "left": ["h", "left"],
    "right": ["l", "right"],
    "pageUp": ["ctrl+u", "pageup"],
    "pageDown": ["ctrl+d", "pagedown"],
    "home": ["g", "home"],
    "end": ["G", "end"]
  }
}
```

| Action | Default Keys | Description |
|--------|--------------|-------------|
| `up` | `k`, `↑` | Move up |
| `down` | `j`, `↓` | Move down |
| `left` | `h`, `←` | Move left |
| `right` | `l`, `→` | Move right |
| `pageUp` | `Ctrl+U`, `Page Up` | Page up |
| `pageDown` | `Ctrl+D`, `Page Down` | Page down |
| `home` | `g`, `Home` | Go to top |
| `end` | `G`, `End` | Go to bottom |

### Tab Navigation Keys

```json
{
  "tabs": {
    "next": ["tab", "ctrl+n"],
    "prev": ["shift+tab", "ctrl+p"],
    "timeline": ["1"],
    "branches": ["2"],
    "files": ["3"],
    "dashboards": ["4"],
    "repoManager": ["5"]
  }
}
```

| Action | Default Keys | Description |
|--------|--------------|-------------|
| `next` | `Tab`, `Ctrl+N` | Next tab |
| `prev` | `Shift+Tab`, `Ctrl+P` | Previous tab |
| `timeline` | `1` | Timeline screen |
| `branches` | `2` | Branches screen |
| `files` | `3` | Files screen |
| `dashboards` | `4` | Dashboards screen |
| `repoManager` | `5` | Repository Manager |

---

## 🌍 Environment Variables

### Supported Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `HISTTUI_CACHE_DIR` | string | `~/.histtui/cache` | Cache directory |
| `HISTTUI_CONFIG_PATH` | string | `~/.histtui/config.json` | Config file path |
| `PORT` | number | `3001` | Agent server port |
| `NODE_ENV` | string | `development` | Environment mode |

### Usage

```bash
# Custom cache directory
HISTTUI_CACHE_DIR=/tmp/histtui-cache histtui

# Custom config path
HISTTUI_CONFIG_PATH=~/my-config.json histtui

# Custom agent port
PORT=3002 bun run agent
```

---

## 🚩 Command-Line Arguments

### Usage

```bash
histtui [repository-url] [options]
```

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `repository-url` | string | Git repository URL or path |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--max-commits` | number | `10000` | Maximum commits to index |
| `--branch` | string | `main` | Branch to checkout |
| `--cache-dir` | string | `~/.histtui/cache` | Cache directory |
| `--no-cache` | boolean | `false` | Skip cache, clone fresh |
| `--verbose` | boolean | `false` | Verbose logging |
| `--help` | boolean | - | Show help |
| `--version` | boolean | - | Show version |

### Examples

```bash
# Basic usage
histtui https://github.com/user/repo

# With options
histtui https://github.com/user/repo --max-commits 5000

# No cache
histtui https://github.com/user/repo --no-cache

# Custom branch
histtui https://github.com/user/repo --branch develop
```

---

## 📊 Default Values

### Complete Default Configuration

```json
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000,
  "keyBindings": {
    "quit": ["q", "ctrl+c"],
    "help": ["?", "h"],
    "search": ["/", "ctrl+f"],
    "navigate": {
      "up": ["k", "up"],
      "down": ["j", "down"],
      "left": ["h", "left"],
      "right": ["l", "right"],
      "pageUp": ["ctrl+u", "pageup"],
      "pageDown": ["ctrl+d", "pagedown"],
      "home": ["g", "home"],
      "end": ["G", "end"]
    },
    "tabs": {
      "next": ["tab", "ctrl+n"],
      "prev": ["shift+tab", "ctrl+p"],
      "timeline": ["1"],
      "branches": ["2"],
      "files": ["3"],
      "dashboards": ["4"]
    }
  },
  "theme": {
    "name": "Default",
    "colors": {
      "primary": "#61afef",
      "secondary": "#56b6c2",
      "success": "#98c379",
      "warning": "#e5c07b",
      "error": "#e06c75",
      "info": "#c678dd",
      "background": "#282c34",
      "foreground": "#abb2bf",
      "muted": "#5c6370",
      "border": "#3e4451",
      "focusBorder": "#61afef"
    },
    "accessibility": {
      "highContrast": false,
      "reducedMotion": false,
      "colorblindSafe": false
    }
  },
  "accessibility": {
    "reducedMotion": false,
    "highContrast": false,
    "focusIndicatorStyle": "default",
    "screenReaderMode": false,
    "largeText": false
  },
  "timeTracking": {
    "enabled": true,
    "idleTimeout": 300,
    "sessionGap": 900,
    "trackFiles": true,
    "trackLanguages": true
  },
  "ui": {
    "theme": "default",
    "showBreadcrumbs": true,
    "showHelpHints": true,
    "progressiveDisclosure": false,
    "animations": "full"
  }
}
```

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Configuration Management

**Step 0:** View current configuration

```bash
# Display configuration
cat ~/.histtui/config.json | jq '.'

# Validate JSON
jq empty ~/.histtui/config.json && echo "Valid" || echo "Invalid"
```

**Step 1:** Update configuration

```bash
# Update specific field
jq '.maxCommits = 20000' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json

# Update nested field
jq '.llm.model = "gpt-4"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json

# Add new field
jq '.customField = "value"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

**Step 2:** Validate configuration

```bash
# Check required fields
jq -r '.llm.provider, .llm.apiKey' ~/.histtui/config.json

# Verify paths exist
cache_dir=$(jq -r '.cacheDir' ~/.histtui/config.json | sed "s|~|$HOME|")
ls -la "$cache_dir"

# Test API key
provider=$(jq -r '.llm.provider' ~/.histtui/config.json)
case $provider in
  openai)
    curl https://api.openai.com/v1/models \
      -H "Authorization: Bearer $(jq -r '.llm.apiKey' ~/.histtui/config.json)"
    ;;
esac
```

**Step 3:** Reset to defaults

```bash
# Backup current config
cp ~/.histtui/config.json ~/.histtui/config.json.backup

# Create default config
cat > ~/.histtui/config.json << 'EOF'
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000
}
EOF

# Restore from backup
cp ~/.histtui/config.json.backup ~/.histtui/config.json
```

</details>

---

**Last Updated:** 2026-01-14  
**HistTUI Version:** 1.1.0  
**Configuration File:** `~/.histtui/config.json`  
**Total Options:** 50+ documented
