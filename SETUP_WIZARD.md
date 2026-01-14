# 🧙 Setup Wizard Guide

**First-Launch Configuration for HistTUI**

The Setup Wizard automatically runs on first launch to configure HistTUI with AI-powered features. This guide documents every step of the wizard flow, configuration options, and troubleshooting.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Wizard Flow](#-wizard-flow)
- [LLM Provider Options](#-llm-provider-options)
- [Model Selection](#-model-selection)
- [API Key Configuration](#-api-key-configuration)
- [AG-UI Configuration](#-ag-ui-configuration)
- [Configuration File](#-configuration-file)
- [Skipping Setup](#-skipping-setup)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

The Setup Wizard configures:

✅ **LLM Provider** - Choose your AI service (OpenAI, Anthropic, OpenRouter, Ollama)  
✅ **API Keys** - Securely store authentication credentials  
✅ **Model Selection** - Pick the best AI model for your needs  
✅ **AG-UI Integration** - Enable generative UI features  
✅ **Configuration Storage** - Save settings to `~/.histtui/config.json`

### When Does It Run?

The wizard automatically launches when:
- HistTUI is run for the first time
- No configuration file exists at `~/.histtui/config.json`
- Configuration file exists but has no `llm` section

### Can I Skip It?

✅ Yes! Press `'s'` at the welcome screen or choose **"Skip - Configure Later"** from the provider list.

---

## 🔄 Wizard Flow

The Setup Wizard guides you through **3-4 steps** (depending on provider choice):

```
┌─────────────────────────────────────────────────┐
│  Step 0: Welcome Screen                         │
│  ├─ Overview of features                        │
│  ├─ What you'll configure                       │
│  └─ Option to skip setup                        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 1: Select LLM Provider                    │
│  ├─ OpenAI (GPT-4, GPT-3.5)                     │
│  ├─ Anthropic (Claude)                          │
│  ├─ OpenRouter (Multiple Models)                │
│  ├─ Ollama (Local Models)                       │
│  └─ Skip - Configure Later                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 2: Enter API Key (if required)            │
│  ├─ Provider-specific instructions              │
│  ├─ API key URL reference                       │
│  ├─ Password-masked input                       │
│  └─ Format validation hint                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 3: Select Model (OpenRouter/Ollama only)  │
│  ├─ Pre-configured popular models               │
│  ├─ Custom model input option                   │
│  └─ Model recommendations                       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 4: AG-UI Configuration                    │
│  ├─ Enable/disable generative UI                │
│  ├─ Agent endpoint URL                          │
│  └─ Default: http://localhost:3001/api/agent    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Final Step: Confirmation                       │
│  ├─ Review all settings                         │
│  ├─ Confirm and save                            │
│  └─ Option to restart wizard                    │
└─────────────────────────────────────────────────┘
```

---

## 🤖 LLM Provider Options

### 1. OpenAI (GPT-4, GPT-3.5)

**Best for:** Production-quality AI, reliability, general-purpose tasks

**Features:**
- GPT-4 Turbo (latest, most capable)
- GPT-3.5 Turbo (fast, cost-effective)
- High-quality code analysis
- Fast response times

**Requirements:**
- OpenAI API key (required)
- Account with credits/subscription

**Get API Key:**
- Visit: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Create new secret key
- Format: `sk-...`

**Default Model:** `gpt-4-turbo`

---

### 2. Anthropic (Claude)

**Best for:** Advanced reasoning, code analysis, longer context windows

**Features:**
- Claude 3.5 Sonnet (balanced performance)
- Claude 3 Opus (most capable)
- Claude 3 Haiku (fastest)
- 200K token context window
- Strong coding abilities

**Requirements:**
- Anthropic API key (required)
- Account with credits

**Get API Key:**
- Visit: [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- Create new API key
- Format: `sk-ant-...`

**Default Model:** `claude-3-5-sonnet-20241022`

---

### 3. OpenRouter (Multiple Models)

**Best for:** Access to multiple AI models, flexibility, experimentation

**Features:**
- 12+ pre-configured models
- Access to GPT-4, Claude, Gemini, Llama, Mistral, DeepSeek
- Unified API for all models
- Pay-per-use pricing
- Model comparison and selection

**Requirements:**
- OpenRouter API key (required)
- Account with credits

**Get API Key:**
- Visit: [https://openrouter.ai/keys](https://openrouter.ai/keys)
- Create new API key
- Format: `sk-or-...`

**Popular Models:**

| Model | Provider | Best For |
|-------|----------|----------|
| `openai/gpt-4-turbo` | OpenAI | General purpose, reliability |
| `anthropic/claude-3.5-sonnet` | Anthropic | Code analysis, reasoning |
| `google/gemini-pro-1.5` | Google | Long context, multimodal |
| `meta-llama/llama-3.1-405b-instruct` | Meta | Open source, powerful |
| `meta-llama/llama-3.1-70b-instruct` | Meta | Balanced performance |
| `mistralai/mistral-large` | Mistral | European option, code |
| `deepseek/deepseek-chat` | DeepSeek | Cost-effective, coding |

**Base URL:** `https://openrouter.ai/api/v1`

---

### 4. Ollama (Local Models)

**Best for:** Privacy, offline usage, no API costs, experimentation

**Features:**
- Runs models locally on your machine
- No API keys required
- Complete privacy (no data sent externally)
- Free to use
- Supports Llama, Mistral, CodeLlama, and more

**Requirements:**
- Ollama installed and running locally
- Sufficient RAM/GPU for models
- No API key needed

**Get Started:**
- Install Ollama: [https://ollama.ai](https://ollama.ai)
- Pull a model: `ollama pull llama3.1`
- Start Ollama: `ollama serve`

**Popular Models:**

| Model | Size | RAM Required | Best For |
|-------|------|--------------|----------|
| `llama3.1` | 8B | 8GB | General purpose |
| `llama3.1:70b` | 70B | 48GB | Advanced reasoning |
| `codellama` | 7B | 8GB | Code generation |
| `mistral` | 7B | 8GB | Fast, efficient |
| `deepseek-coder` | 6.7B | 8GB | Code-focused |

**Base URL:** `http://localhost:11434` (default)

**Note:** Model must be pulled first: `ollama pull <model-name>`

---

### 5. Skip - Configure Later

**Best for:** Quick testing, exploring UI first, manual configuration

**Result:**
- HistTUI launches without AI features
- Configuration can be added later manually
- Run `histtui config` to re-run wizard

---

## 🎯 Model Selection

### OpenRouter Model Selection

The wizard presents **12 popular models** plus a custom option:

```
┌─────────────────────────────────────────────────────┐
│  Choose AI Model                                    │
├─────────────────────────────────────────────────────┤
│  ▶ GPT-4 Turbo (openai/gpt-4-turbo)                │
│    GPT-4 (openai/gpt-4)                             │
│    GPT-3.5 Turbo (openai/gpt-3.5-turbo)             │
│    Claude 3.5 Sonnet (anthropic/claude-3.5-sonnet)  │
│    Claude 3 Opus (anthropic/claude-3-opus)          │
│    Claude 3 Haiku (anthropic/claude-3-haiku)        │
│    Gemini Pro 1.5 (google/gemini-pro-1.5)           │
│    Llama 3.1 405B (meta-llama/llama-3.1-405b)       │
│    Llama 3.1 70B (meta-llama/llama-3.1-70b)         │
│    Mistral Large (mistralai/mistral-large)          │
│    DeepSeek Chat (deepseek/deepseek-chat)           │
│    Custom Model (Enter manually)                    │
└─────────────────────────────────────────────────────┘
```

**Custom Model Entry:**
- Select "Custom Model" from list
- Enter model in format: `provider/model-name`
- Example: `anthropic/claude-3-opus`
- Example: `meta-llama/llama-3.1-8b-instruct`

### Ollama Model Selection

For Ollama, you enter the model name manually:

```
┌─────────────────────────────────────────────────────┐
│  Enter Ollama model name:                           │
│  Examples: llama3.1, codellama, mistral             │
│                                                      │
│  ▸ llama3.1_                                        │
└─────────────────────────────────────────────────────┘
```

**Common Ollama Models:**
- `llama3.1` - General purpose (recommended)
- `codellama` - Code-specific tasks
- `mistral` - Fast and efficient
- `deepseek-coder` - Code analysis
- `phi` - Lightweight, fast

**Note:** Model must be pulled first:
```bash
ollama pull llama3.1
```

---

## 🔑 API Key Configuration

### Secure Storage

API keys are stored in `~/.histtui/config.json` with **file permissions 600** (owner read/write only).

```json
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo"
  }
}
```

### Password-Masked Input

The wizard uses **PasswordInput** component from @inkjs/ui:
- Characters appear as `•` (bullets)
- Copy-paste works normally
- Backspace to correct mistakes
- Press Enter to submit

### Provider-Specific Key Formats

| Provider | Format | Example |
|----------|--------|---------|
| OpenAI | `sk-...` | `sk-proj-abc123...` |
| Anthropic | `sk-ant-...` | `sk-ant-api03-xyz789...` |
| OpenRouter | `sk-or-...` | `sk-or-v1-def456...` |
| Ollama | *(None)* | Not required |

### Where to Get API Keys

**OpenAI:**
```
URL: https://platform.openai.com/api-keys
1. Log in to OpenAI account
2. Navigate to API keys section
3. Click "Create new secret key"
4. Copy key immediately (shown only once)
5. Add billing/credits if needed
```

**Anthropic:**
```
URL: https://console.anthropic.com/settings/keys
1. Log in to Anthropic Console
2. Go to API Keys section
3. Click "Create Key"
4. Copy key and save securely
5. Add credits to account
```

**OpenRouter:**
```
URL: https://openrouter.ai/keys
1. Sign up/log in to OpenRouter
2. Navigate to Keys page
3. Click "Create API Key"
4. Copy key immediately
5. Add credits for usage
```

---

## 🎨 AG-UI Configuration

### What is AG-UI?

**AG-UI (Adaptive Generative UI)** enables AI agents to dynamically generate and update terminal UI components in real-time.

**Features:**
- ✅ Streaming AI insights
- ✅ Tool execution visualization
- ✅ Dynamic component generation
- ✅ Real-time status updates

### Configuration Options

**Enable AG-UI?** (Y/n)
- `Y` (Yes) - Enable generative UI features
- `n` (No) - Disable AG-UI, use static UI only

**Agent Endpoint:**
- Default: `http://localhost:3001/api/agent`
- Change if running agent server on different port/host
- Format: `http://<host>:<port>/api/agent`

### Agent Server Requirement

AG-UI requires the **agent server** to be running:

```bash
# Start agent server
bun run agent

# Or use the unified launcher
bun run launch
```

See [LAUNCHER.md](./LAUNCHER.md) and [AGENT_BACKEND.md](./AGENT_BACKEND.md) for details.

---

## 📄 Configuration File

### File Location

```
~/.histtui/config.json
```

**Permissions:** `600` (Owner read/write only)

### File Structure

```json
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000,
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
  "keyBindings": { ... },
  "theme": { ... }
}
```

### Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `llm.provider` | string | LLM provider name |
| `llm.apiKey` | string | API authentication key |
| `llm.model` | string | Model identifier |
| `llm.baseUrl` | string | Custom API base URL (optional) |
| `agui.enabled` | boolean | Enable AG-UI features |
| `agui.endpoint` | string | Agent server endpoint URL |

### Manual Configuration

You can edit the file directly:

```bash
# Open config in editor
nano ~/.histtui/config.json

# Or use jq to update programmatically
jq '.llm.model = "gpt-4"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

See [CONFIGURATION.md](./CONFIGURATION.md) for all options.

---

## ⏭️ Skipping Setup

### Option 1: Press 's' at Welcome Screen

```
┌─────────────────────────────────────────────────┐
│  Welcome to HistTUI!                            │
│  ...                                            │
│                                                 │
│  Press Enter to continue setup                  │
│  or                                             │
│  Press 's' to skip                              │
└─────────────────────────────────────────────────┘
```

### Option 2: Choose "Skip" in Provider List

```
┌─────────────────────────────────────────────────┐
│  Select LLM Provider                            │
├─────────────────────────────────────────────────┤
│    OpenAI (GPT-4, GPT-3.5)                      │
│    Anthropic (Claude)                           │
│    OpenRouter (Multiple Models)                 │
│    Ollama (Local Models)                        │
│  ▶ Skip - Configure Later                       │
└─────────────────────────────────────────────────┘
```

### Result of Skipping

- HistTUI launches with **basic features only**
- No AI-powered insights
- No generative UI
- Static terminal interface

### Re-running Wizard

```bash
# Re-run setup wizard
histtui config

# Or delete config and restart
rm ~/.histtui/config.json
histtui
```

---

## 🛠️ Troubleshooting

### Issue: Wizard Doesn't Appear

**Symptoms:**
- HistTUI launches directly without setup wizard
- No configuration prompts

**Solution:**
```bash
# Check if config already exists
cat ~/.histtui/config.json

# Delete config to trigger wizard
rm ~/.histtui/config.json

# Restart HistTUI
histtui
```

---

### Issue: API Key Format Error

**Symptoms:**
- "Invalid API key format" error
- Authentication failures

**Solution:**
```bash
# Verify key format matches provider:
# OpenAI: sk-...
# Anthropic: sk-ant-...
# OpenRouter: sk-or-...

# Check for extra spaces or characters
echo "sk-..." | wc -c  # Count characters

# Re-enter key carefully
```

---

### Issue: Ollama Connection Failed

**Symptoms:**
- "Cannot connect to Ollama" error
- Model not found

**Solution:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama if not running
ollama serve

# Pull model if needed
ollama pull llama3.1

# Verify model is available
ollama list
```

---

### Issue: AG-UI Agent Not Responding

**Symptoms:**
- "Agent connection failed" message
- No generative UI features

**Solution:**
```bash
# Check if agent server is running
curl http://localhost:3001/health

# Start agent server
bun run agent

# Verify endpoint in config
jq '.agui.endpoint' ~/.histtui/config.json

# Use unified launcher instead
bun run launch
```

---

### Issue: Configuration Not Saved

**Symptoms:**
- Wizard completes but config file doesn't exist
- Settings not persisted

**Solution:**
```bash
# Check permissions on .histtui directory
ls -la ~/.histtui

# Create directory if missing
mkdir -p ~/.histtui
chmod 700 ~/.histtui

# Manually create config
cat > ~/.histtui/config.json << 'EOF'
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo"
  }
}
EOF
chmod 600 ~/.histtui/config.json
```

---

### Issue: Model Not Available (OpenRouter)

**Symptoms:**
- "Model not found" error
- 404 response from OpenRouter

**Solution:**
```bash
# Check model availability at OpenRouter
# Visit: https://openrouter.ai/models

# Use exact model identifier from OpenRouter docs
# Example: anthropic/claude-3-5-sonnet

# Update config with correct model
jq '.llm.model = "anthropic/claude-3-5-sonnet"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Automated Setup

**Step 0:** Check if config exists

```bash
# Check for existing configuration
if [ -f ~/.histtui/config.json ]; then
  echo "Config exists"
  cat ~/.histtui/config.json
else
  echo "No config - wizard will run"
fi
```

**Step 1:** Create configuration directory

```bash
# Ensure config directory exists
mkdir -p ~/.histtui
chmod 700 ~/.histtui
```

**Step 2:** Create configuration file

```bash
# Create config with OpenAI example
cat > ~/.histtui/config.json << 'EOF'
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000,
  "llm": {
    "provider": "openai",
    "apiKey": "sk-YOUR-API-KEY-HERE",
    "model": "gpt-4-turbo"
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
EOF
chmod 600 ~/.histtui/config.json
```

**Step 3:** Update API key

```bash
# Replace placeholder with actual key
sed -i 's/sk-YOUR-API-KEY-HERE/sk-actual-key/' ~/.histtui/config.json

# Or use jq for safer editing
jq '.llm.apiKey = "sk-actual-key"' ~/.histtui/config.json > /tmp/config.json
mv /tmp/config.json ~/.histtui/config.json
```

**Step 4:** Verify configuration

```bash
# Validate JSON syntax
jq empty ~/.histtui/config.json && echo "Valid JSON" || echo "Invalid JSON"

# Check required fields
jq -r '.llm.provider, .llm.apiKey, .llm.model' ~/.histtui/config.json

# Verify permissions
ls -l ~/.histtui/config.json | grep "600"
```

## Configuration Templates

**Template: OpenAI**
```json
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo"
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
```

**Template: Anthropic**
```json
{
  "llm": {
    "provider": "anthropic",
    "apiKey": "sk-ant-...",
    "model": "claude-3-5-sonnet-20241022"
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
```

**Template: OpenRouter**
```json
{
  "llm": {
    "provider": "openrouter",
    "apiKey": "sk-or-...",
    "model": "anthropic/claude-3.5-sonnet",
    "baseUrl": "https://openrouter.ai/api/v1"
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
```

**Template: Ollama**
```json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3.1",
    "baseUrl": "http://localhost:11434"
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
```

## Testing Configuration

```bash
# Test LLM provider connection
case $(jq -r '.llm.provider' ~/.histtui/config.json) in
  openai)
    curl https://api.openai.com/v1/models \
      -H "Authorization: Bearer $(jq -r '.llm.apiKey' ~/.histtui/config.json)"
    ;;
  anthropic)
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $(jq -r '.llm.apiKey' ~/.histtui/config.json)" \
      -H "anthropic-version: 2023-06-01"
    ;;
  ollama)
    curl http://localhost:11434/api/tags
    ;;
esac

# Test AG-UI endpoint
curl $(jq -r '.agui.endpoint' ~/.histtui/config.json | sed 's|/api/agent|/health|')
```

</details>

---

**Last Updated:** 2026-01-14  
**HistTUI Version:** 1.1.0  
**Component:** SetupWizard.tsx
