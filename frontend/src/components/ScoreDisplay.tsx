import styles from './ScoreDisplay.module.css';
import { useEffect, useState } from 'react';

interface ScoreDisplayProps {
    score: number;
    label: string;
    variant?: 'default' | 'success';
}

export function ScoreDisplay({ score, label, variant = 'default' }: ScoreDisplayProps) {
    const [displayScore, setDisplayScore] = useState(0);

    // Animation duration
    const DURATION = 1000;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const progress = (displayScore / 10) * circumference;

    useEffect(() => {
        let start = 0;
        const end = score;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / DURATION, 1);

            // Easing function (easeOutQuart)
            const ease = 1 - Math.pow(1 - progress, 4);

            setDisplayScore(start + (end - start) * ease);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    const getColor = (val: number) => {
        if (val >= 8) return 'var(--success)';
        if (val >= 5) return 'var(--warning)';
        return 'var(--error)';
    };

    const color = getColor(score);

    return (
        <div className={`${styles.container} ${variant === 'success' ? styles.success : ''}`}>
            <div className={styles.gauge}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="var(--bg-tertiary)"
                        strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (displayScore / 10) * circumference}
                        transform="rotate(-90 50 50)"
                        className={styles.progressRing}
                        style={{
                            filter: `drop-shadow(0 0 6px ${color})`
                        }}
                    />
                </svg>
                <div className={styles.content}>
                    <span className={styles.value} style={{ color }}>
                        {displayScore.toFixed(1)}
                    </span>
                    <span className={styles.max}>/10</span>
                </div>
            </div>
            <span className={styles.label}>{label}</span>
            {variant === 'success' && (
                <div className={styles.badge} style={{ animation: 'bounceIn 0.5s 0.8s backwards' }}>
                    IMPROVED
                </div>
            )}
        </div>
    );
}
