import { OptimizationResult } from '../types';
import { Clock, ChevronRight } from 'lucide-react';
import styles from './HistoryPanel.module.css';

interface HistoryPanelProps {
    history: OptimizationResult[];
    onSelect: (result: OptimizationResult) => void;
}

export function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
    if (history.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <Clock size={16} />
                Recent Optimizations
            </h3>
            <div className={styles.list}>
                {history.map((result, index) => (
                    <button
                        key={index}
                        className={styles.item}
                        onClick={() => onSelect(result)}
                    >
                        <div className={styles.itemContent}>
                            <span className={styles.preview}>
                                {result.original_prompt.slice(0, 40)}...
                            </span>
                            <div className={styles.meta}>
                                <span className={`
                  ${styles.score} 
                  ${result.optimized_score >= 8 ? styles.good : ''}
                `}>
                                    Score: {result.optimized_score}/10
                                </span>
                            </div>
                        </div>
                        <ChevronRight size={16} className={styles.arrow} />
                    </button>
                ))}
            </div>
        </div>
    );
}
