import { OptimizationResult } from '../types';
import { ScoreDisplay } from './ScoreDisplay';
import { ImprovementsList } from './ImprovementsList';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import styles from './ComparisonView.module.css';

interface ComparisonViewProps {
    result: OptimizationResult;
}

export function ComparisonView({ result }: ComparisonViewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.optimized_prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`animate-fade-in ${styles.container}`}>
            <div className={styles.metricsCard}>
                <div className={styles.scoreGroup}>
                    <ScoreDisplay score={result.original_score} label="Original Impact" />
                    <div className={styles.arrowContainer}>
                        <div className={styles.pulseLine} />
                        <ArrowRight className={styles.arrowIcon} size={24} />
                    </div>
                    <ScoreDisplay score={result.optimized_score} label="Optimized Impact" variant="success" />
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Original Prompt</h3>
                    <div className={styles.originalContent}>
                        {result.original_prompt}
                    </div>
                </div>

                <div className={styles.column}>
                    <div className={styles.optimizedHeader}>
                        <h3 className={`${styles.columnTitle} ${styles.glowText}`}>
                            <Sparkles size={14} /> Optimized Result
                        </h3>
                        <button
                            className={styles.copyButton}
                            onClick={handleCopy}
                            title="Copy to clipboard"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>

                    <div id="optimized-content" className={styles.optimizedWrapper}>
                        <SyntaxHighlighter
                            language="markdown"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                borderRadius: '1rem',
                                fontSize: '0.9375rem',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                background: 'rgba(15, 23, 42, 0.8)',
                                padding: '1.5rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            }}
                            wrapLongLines={true}
                        >
                            {result.optimized_prompt}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            <ImprovementsList improvements={result.improvements} />
        </div>
    );
}
