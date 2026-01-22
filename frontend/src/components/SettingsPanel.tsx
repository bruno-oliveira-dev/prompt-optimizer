import { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { ProviderConfig, ProviderType } from '../types';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
    config: ProviderConfig;
    onConfigChange: (config: ProviderConfig) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const DEFAULT_MODELS: Record<ProviderType, string> = {
    anthropic: 'claude-3-5-sonnet-20240620',
    openai: 'gpt-4o',
    google: 'gemini-1.5-pro',
};

const PROVIDERS: { value: ProviderType; label: string }[] = [
    { value: 'anthropic', label: 'Anthropic (Claude)' },
    { value: 'openai', label: 'OpenAI (GPT / Grok / Custom)' },
    { value: 'google', label: 'Google (Gemini)' },
];

export function SettingsPanel({ config, onConfigChange, isOpen, onToggle }: SettingsPanelProps) {
    const [localConfig, setLocalConfig] = useState(config);

    // Sync local state when prop changes
    useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    const handleChange = (field: keyof ProviderConfig, value: string) => {
        const newConfig = { ...localConfig, [field]: value };

        // Auto-update model placeholder/default when provider changes
        if (field === 'provider') {
            newConfig.model = DEFAULT_MODELS[value as ProviderType];
            newConfig.baseUrl = ''; // Reset base URL on provider change
        }

        setLocalConfig(newConfig);
    };

    const handleSave = () => {
        onConfigChange(localConfig);
        onToggle();
    };

    if (!isOpen) {
        return (
            <button
                className={styles.toggleButton}
                onClick={onToggle}
                title="Configure AI Model"
            >
                <Settings size={20} />
            </button>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={`card ${styles.panel}`}>
                <div className={styles.header}>
                    <h3>Model Settings</h3>
                    <button className={styles.closeButton} onClick={onToggle}>×</button>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>AI Provider</label>
                    <select
                        className={styles.select}
                        value={localConfig.provider}
                        onChange={(e) => handleChange('provider', e.target.value as ProviderType)}
                    >
                        {PROVIDERS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Model Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={localConfig.model}
                        onChange={(e) => handleChange('model', e.target.value)}
                        placeholder={DEFAULT_MODELS[localConfig.provider]}
                    />
                    <span className={styles.hint}>e.g. gpt-4-turbo, claude-3-opus, grok-1</span>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>API Key</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={localConfig.apiKey || ''}
                        onChange={(e) => handleChange('apiKey', e.target.value)}
                        placeholder="sk-..."
                    />
                    <span className={styles.hint}>Stored locally in your browser</span>
                </div>

                {localConfig.provider === 'openai' && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Base URL (Optional)</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={localConfig.baseUrl || ''}
                            onChange={(e) => handleChange('baseUrl', e.target.value)}
                            placeholder="https://api.openai.com/v1"
                        />
                        <span className={styles.hint}>For local models (LM Studio, Ollama) or Grok</span>
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={`btn btn-primary ${styles.saveButton}`} onClick={handleSave}>
                        <Save size={16} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
