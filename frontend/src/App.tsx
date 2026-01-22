import { useState, useEffect } from 'react';
import { PromptInput } from './components/PromptInput';
import { OptimizeButton } from './components/OptimizeButton';
import { ComparisonView } from './components/ComparisonView';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { ApiClient } from './api/client';
import { OptimizationResult, ProviderConfig } from './types';
import { Sparkles, AlertCircle } from 'lucide-react';
import './index.css';

const DEFAULT_CONFIG: ProviderConfig = {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20240620',
};

function App() {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<OptimizationResult | null>(null);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [config, setConfig] = useState<ProviderConfig>(() => {
        const saved = localStorage.getItem('provider_config');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    });

    const [history, setHistory] = useState<OptimizationResult[]>(() => {
        const saved = localStorage.getItem('optimization_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('optimization_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('provider_config', JSON.stringify(config));
    }, [config]);

    const handleOptimize = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const optimizationResult = await ApiClient.optimizePrompt(prompt, config);
            setResult(optimizationResult);
            setHistory(prev => [optimizationResult, ...prev].slice(0, 10));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHistorySelect = (selectedResult: OptimizationResult) => {
        setPrompt(selectedResult.original_prompt);
        setResult(selectedResult);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
            <SettingsPanel
                config={config}
                onConfigChange={setConfig}
                isOpen={isSettingsOpen}
                onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
            />

            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    color: 'var(--accent-primary)'
                }}>
                    <Sparkles size={32} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Prompt Optimizer
                    </h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                    From messy to mastery in seconds.
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Using: <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{config.provider}</span> ({config.model})
                </div>
            </header>

            <main style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section className="card">
                    <PromptInput
                        value={prompt}
                        onChange={setPrompt}
                        disabled={isLoading}
                    />
                    <div style={{ marginTop: '1.5rem' }}>
                        <OptimizeButton
                            onClick={handleOptimize}
                            isLoading={isLoading}
                            disabled={!prompt.trim() || prompt.length < 10}
                        />
                    </div>

                    {error && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--error)',
                            borderRadius: '0.5rem',
                            color: 'var(--error)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}
                </section>

                {result && <ComparisonView result={result} />}

                <HistoryPanel history={history} onSelect={handleHistorySelect} />
            </main>
        </div>
    );
}

export default App;
