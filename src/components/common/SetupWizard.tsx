/**
 * First Launch Setup Wizard
 * Interactive setup for configuring LLM API keys and preferences
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { TextInput, PasswordInput, Select, ConfirmInput } from '@inkjs/ui';
import { BoxBorder, StatusMessage, Alert } from './UI';

interface SetupWizardProps {
  onComplete: (config: SetupConfig) => void;
  onSkip: () => void;
}

export interface SetupConfig {
  llmProvider?: 'openai' | 'anthropic' | 'openrouter' | 'ollama' | 'none';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  agentEndpoint?: string;
  enableAGUI?: boolean;
}

type SetupStep = 'welcome' | 'provider' | 'apikey' | 'model' | 'agent' | 'confirm' | 'complete';

export function SetupWizard({ onComplete, onSkip }: SetupWizardProps) {
  const [step, setStep] = useState<SetupStep>('welcome');
  const [config, setConfig] = useState<SetupConfig>({});
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [agentEndpointInput, setAgentEndpointInput] = useState('http://localhost:3001/api/agent');

  // Popular OpenRouter models
  const openRouterModels = [
    { label: 'GPT-4 Turbo (openai/gpt-4-turbo)', value: 'openai/gpt-4-turbo' },
    { label: 'GPT-4 (openai/gpt-4)', value: 'openai/gpt-4' },
    { label: 'GPT-3.5 Turbo (openai/gpt-3.5-turbo)', value: 'openai/gpt-3.5-turbo' },
    { label: 'Claude 3.5 Sonnet (anthropic/claude-3.5-sonnet)', value: 'anthropic/claude-3.5-sonnet' },
    { label: 'Claude 3 Opus (anthropic/claude-3-opus)', value: 'anthropic/claude-3-opus' },
    { label: 'Claude 3 Haiku (anthropic/claude-3-haiku)', value: 'anthropic/claude-3-haiku' },
    { label: 'Gemini Pro 1.5 (google/gemini-pro-1.5)', value: 'google/gemini-pro-1.5' },
    { label: 'Llama 3.1 405B (meta-llama/llama-3.1-405b-instruct)', value: 'meta-llama/llama-3.1-405b-instruct' },
    { label: 'Llama 3.1 70B (meta-llama/llama-3.1-70b-instruct)', value: 'meta-llama/llama-3.1-70b-instruct' },
    { label: 'Mistral Large (mistralai/mistral-large)', value: 'mistralai/mistral-large' },
    { label: 'DeepSeek Chat (deepseek/deepseek-chat)', value: 'deepseek/deepseek-chat' },
    { label: 'Custom Model (Enter manually)', value: 'custom' },
  ];

  const providers = [
    { label: 'OpenAI (GPT-4, GPT-3.5)', value: 'openai' },
    { label: 'Anthropic (Claude)', value: 'anthropic' },
    { label: 'OpenRouter (Multiple Models)', value: 'openrouter' },
    { label: 'Ollama (Local Models)', value: 'ollama' },
    { label: 'Skip - Configure Later', value: 'none' },
  ];

  const handleProviderSelect = (provider: string) => {
    const newConfig = { ...config, llmProvider: provider as any };
    
    if (provider === 'none') {
      setStep('complete');
      onComplete({ ...newConfig, llmProvider: 'none' });
    } else if (provider === 'ollama') {
      // Ollama doesn't need API key but needs model
      setConfig({ ...newConfig, baseUrl: 'http://localhost:11434' });
      setStep('model');
    } else if (provider === 'openrouter') {
      // OpenRouter needs API key AND model selection
      setConfig({ ...newConfig, baseUrl: 'https://openrouter.ai/api/v1' });
      setStep('apikey');
    } else {
      // OpenAI, Anthropic need API key
      setConfig(newConfig);
      setStep('apikey');
    }
  };

  const handleApiKeySubmit = (key: string) => {
    setConfig({ ...config, apiKey: key });
    // For OpenRouter, go to model selection
    if (config.llmProvider === 'openrouter') {
      setStep('model');
    } else {
      setStep('agent');
    }
  };

  const handleModelSelect = (model: string) => {
    if (model === 'custom') {
      // Stay on model step but show text input
      return;
    }
    setConfig({ ...config, model });
    setStep('agent');
  };

  const handleCustomModelSubmit = (model: string) => {
    setConfig({ ...config, model });
    setStep('agent');
  };

  const handleAgentConfig = (enable: boolean) => {
    if (enable) {
      setConfig({ ...config, enableAGUI: true, agentEndpoint: agentEndpointInput });
    } else {
      setConfig({ ...config, enableAGUI: false });
    }
    setStep('confirm');
  };

  const handleConfirm = (confirmed: boolean) => {
    if (confirmed) {
      setStep('complete');
      onComplete(config);
    } else {
      setStep('welcome');
      setConfig({});
    }
  };

  if (step === 'welcome') {
    return (
      <Box flexDirection="column" padding={2}>
        <Box marginBottom={2}>
          <Text bold color="cyan" wrap="wrap">
            🚀 Welcome to HistTUI!
          </Text>
        </Box>

        <BoxBorder title="First-Time Setup" borderColor="green" width="100%">
          <Box flexDirection="column" gap={1}>
            <Text>
              Let's configure HistTUI with generative AI capabilities powered by AG-UI.
            </Text>
            
            <Box marginTop={1}>
              <Text bold color="cyan">✨ What you'll get:</Text>
            </Box>
            <Box marginLeft={2} flexDirection="column">
              <Text>• 🤖 AI-powered insights and code analysis</Text>
              <Text>• 💬 Interactive generative UI with real-time streaming</Text>
              <Text>• 🎨 Beautiful terminal interface with @inkjs/ui</Text>
              <Text>• 📊 Dynamic visualizations and recommendations</Text>
              <Text>• 🔍 Intelligent search and navigation</Text>
            </Box>
            
            <Box marginTop={1}>
              <Text dimColor bold>Configure:</Text>
            </Box>
            <Box marginLeft={2} flexDirection="column">
              <Text>• LLM Provider (OpenAI, Anthropic, OpenRouter, Ollama)</Text>
              <Text>• API Keys for cloud providers</Text>
              <Text>• Model selection (OpenRouter: 12+ models)</Text>
              <Text>• AG-UI Agent endpoint (optional)</Text>
            </Box>
            <Box marginTop={1}>
              <Alert variant="info">
                You can skip this setup and configure later with: histtui config
              </Alert>
            </Box>
          </Box>
        </BoxBorder>

        <Box marginTop={2} gap={2}>
          <Box>
            <Text bold color="green">Press Enter to continue setup</Text>
          </Box>
          <Box marginLeft={4}>
            <Text dimColor>or</Text>
          </Box>
          <Box marginLeft={2}>
            <Text bold color="yellow">Press 's' to skip</Text>
          </Box>
        </Box>

        <Box marginTop={1}>
          <ConfirmInput
            onConfirm={() => setStep('provider')}
            onCancel={onSkip}
          />
        </Box>
      </Box>
    );
  }

  if (step === 'provider') {
    return (
      <Box flexDirection="column" padding={2}>
        <Box marginBottom={1}>
          <Text bold color="cyan">Step 1/3: Select LLM Provider</Text>
        </Box>

        <BoxBorder title="Choose Your AI Provider" borderColor="blue" width="100%">
          <Box flexDirection="column" gap={1}>
            <Text dimColor>
              HistTUI uses AI to provide generative insights, code analysis, and
              intelligent recommendations.
            </Text>
            <Box marginTop={1}>
              <Select
                options={providers}
                onChange={handleProviderSelect}
              />
            </Box>
          </Box>
        </BoxBorder>

        <Box marginTop={1}>
          <Text dimColor>Use arrow keys to navigate, Enter to select</Text>
        </Box>
      </Box>
    );
  }

  if (step === 'apikey') {
    const providerInfo: Record<string, { name: string; keyUrl: string; format: string }> = {
      openai: {
        name: 'OpenAI',
        keyUrl: 'https://platform.openai.com/api-keys',
        format: 'sk-...',
      },
      anthropic: {
        name: 'Anthropic',
        keyUrl: 'https://console.anthropic.com/settings/keys',
        format: 'sk-ant-...',
      },
      openrouter: {
        name: 'OpenRouter',
        keyUrl: 'https://openrouter.ai/keys',
        format: 'sk-or-...',
      },
    };

    const info = providerInfo[config.llmProvider!];

    return (
      <Box flexDirection="column" padding={2}>
        <Box marginBottom={1}>
          <Text bold color="cyan">Step 2/3: Enter API Key</Text>
        </Box>

        <BoxBorder title={`${info.name} API Key`} borderColor="yellow" width="100%">
          <Box flexDirection="column" gap={1}>
            <Text>
              Enter your {info.name} API key to enable AI-powered features.
            </Text>
            <Box marginTop={1}>
              <StatusMessage variant="info">
                Get your API key at: {info.keyUrl}
              </StatusMessage>
            </Box>
            <Box marginTop={1}>
              <Text dimColor>Expected format: {info.format}</Text>
            </Box>
            <Box marginTop={1}>
              <Text bold>API Key:</Text>
              <PasswordInput
                placeholder={info.format}
                defaultValue={apiKeyInput}
                onChange={setApiKeyInput}
                onSubmit={handleApiKeySubmit}
              />
            </Box>
          </Box>
        </BoxBorder>

        <Box marginTop={1}>
          <Text dimColor>Your API key will be stored securely in ~/.histtui/config.json</Text>
        </Box>
      </Box>
    );
  }

  if (step === 'model') {
    const [showCustomInput, setShowCustomInput] = useState(false);
    
    return (
      <Box flexDirection="column" padding={2}>
        <Box marginBottom={1}>
          <Text bold color="cyan">
            {config.llmProvider === 'openrouter' ? 'Step 3/4' : 'Step 2/3'}: Select Model
          </Text>
        </Box>

        <BoxBorder title="Choose AI Model" borderColor="magenta" width="100%">
          <Box flexDirection="column" gap={1}>
            <Text>
              {config.llmProvider === 'openrouter' 
                ? 'OpenRouter gives you access to multiple AI models. Choose one below:'
                : 'Select the model you want to use:'}
            </Text>
            
            {config.llmProvider === 'openrouter' && (
              <>
                <Box marginTop={1}>
                  <StatusMessage variant="info">
                    Popular models for code analysis and insights
                  </StatusMessage>
                </Box>
                
                {!showCustomInput ? (
                  <Box marginTop={1}>
                    <Select
                      options={openRouterModels}
                      onChange={(model) => {
                        if (model === 'custom') {
                          setShowCustomInput(true);
                        } else {
                          handleModelSelect(model);
                        }
                      }}
                    />
                  </Box>
                ) : (
                  <Box marginTop={1} flexDirection="column">
                    <Text bold>Enter custom model name:</Text>
                    <Text dimColor>Format: provider/model-name (e.g., anthropic/claude-3-opus)</Text>
                    <Box marginTop={1}>
                      <TextInput
                        placeholder="provider/model-name"
                        defaultValue={modelInput}
                        onChange={setModelInput}
                        onSubmit={handleCustomModelSubmit}
                      />
                    </Box>
                  </Box>
                )}
              </>
            )}
            
            {config.llmProvider === 'ollama' && (
              <Box marginTop={1} flexDirection="column">
                <Text bold>Enter Ollama model name:</Text>
                <Text dimColor>Examples: llama3.1, codellama, mistral</Text>
                <Box marginTop={1}>
                  <TextInput
                    placeholder="llama3.1"
                    defaultValue={modelInput}
                    onChange={setModelInput}
                    onSubmit={handleCustomModelSubmit}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </BoxBorder>

        <Box marginTop={1}>
          <Text dimColor>
            {showCustomInput 
              ? 'Enter the model name and press Enter'
              : 'Use arrow keys to navigate, Enter to select'}
          </Text>
        </Box>
      </Box>
    );
  }

  if (step === 'agent') {
    const stepNumber = config.llmProvider === 'openrouter' ? '4/4' : '3/3';
    
    return (
      <Box flexDirection="column" padding={2}>
        <Box marginBottom={1}>
          <Text bold color="cyan">Step {stepNumber}: AG-UI Agent Configuration</Text>
        </Box>

        <BoxBorder title="Enable Generative UI?" borderColor="green" width="100%">
          <Box flexDirection="column" gap={1}>
            <Text>
              AG-UI enables AI agents to dynamically generate and update terminal UI
              components in real-time.
            </Text>
            <Box marginTop={1}>
              <StatusMessage variant="info">
                Features: Streaming insights, tool execution, dynamic visualizations
              </StatusMessage>
            </Box>
            <Box marginTop={1} flexDirection="column">
              <Text bold>Agent Endpoint (optional):</Text>
              <Text dimColor>Leave default if running agent locally</Text>
              <Box marginTop={1}>
                <TextInput
                  placeholder="http://localhost:3001/api/agent"
                  defaultValue={agentEndpointInput}
                  onChange={setAgentEndpointInput}
                  onSubmit={() => {}}
                />
              </Box>
            </Box>
            <Box marginTop={2}>
              <Text bold>Enable AG-UI agent features? (Y/n)</Text>
            </Box>
            <Box marginTop={1}>
              <ConfirmInput
                onConfirm={() => handleAgentConfig(true)}
                onCancel={() => handleAgentConfig(false)}
              />
            </Box>
          </Box>
        </BoxBorder>
      </Box>
    );
  }

  if (step === 'confirm') {
    return (
      <Box flexDirection="column" padding={2}>
        <Box marginBottom={1}>
          <Text bold color="cyan">Confirm Configuration</Text>
        </Box>

        <BoxBorder title="Review Your Settings" borderColor="magenta" width="100%">
          <Box flexDirection="column" gap={1}>
            <Box>
              <Text bold>LLM Provider: </Text>
              <Text color="green">{config.llmProvider?.toUpperCase()}</Text>
            </Box>
            {config.model && (
              <Box>
                <Text bold>Model: </Text>
                <Text color="cyan">{config.model}</Text>
              </Box>
            )}
            {config.baseUrl && (
              <Box>
                <Text bold>API Base URL: </Text>
                <Text color="blue">{config.baseUrl}</Text>
              </Box>
            )}
            <Box>
              <Text bold>API Key: </Text>
              <Text color="yellow">{config.apiKey ? '••••••••••••' : 'Not configured'}</Text>
            </Box>
            <Box>
              <Text bold>AG-UI Enabled: </Text>
              <Text color={config.enableAGUI ? 'green' : 'red'}>
                {config.enableAGUI ? 'Yes' : 'No'}
              </Text>
            </Box>
            {config.enableAGUI && (
              <Box>
                <Text bold>Agent Endpoint: </Text>
                <Text color="cyan">{config.agentEndpoint}</Text>
              </Box>
            )}
            <Box marginTop={2}>
              <Alert variant="success">
                Configuration will be saved to ~/.histtui/config.json
              </Alert>
            </Box>
            <Box marginTop={1}>
              <Text bold>Confirm and save? (Y/n)</Text>
            </Box>
            <Box marginTop={1}>
              <ConfirmInput
                onConfirm={() => handleConfirm(true)}
                onCancel={() => handleConfirm(false)}
              />
            </Box>
          </Box>
        </BoxBorder>
      </Box>
    );
  }

  if (step === 'complete') {
    return (
      <Box flexDirection="column" padding={2}>
        <BoxBorder title="Setup Complete!" borderColor="green" width="100%">
          <Box flexDirection="column" gap={1}>
            <Text bold color="green">✅ Configuration saved successfully!</Text>
            <Box marginTop={1}>
              <Text>Your HistTUI is now configured with:</Text>
              <Box marginLeft={2} marginTop={1} flexDirection="column">
                {config.llmProvider && config.llmProvider !== 'none' && (
                  <Text>• {config.llmProvider?.toUpperCase()} integration</Text>
                )}
                {config.enableAGUI && (
                  <Text>• AG-UI generative capabilities</Text>
                )}
                <Text>• Enhanced terminal UI with @inkjs/ui</Text>
              </Box>
            </Box>
            <Box marginTop={2}>
              <StatusMessage variant="success">
                Launching HistTUI...
              </StatusMessage>
            </Box>
          </Box>
        </BoxBorder>
      </Box>
    );
  }

  return null;
}
