import { Improvement } from '../types';
import { Lightbulb, Layout, Zap, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './ImprovementsList.module.css';

interface ImprovementsListProps {
    improvements: Improvement[];
}

const getIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('context')) return <Lightbulb size={20} />;
    if (cat.includes('structure')) return <Layout size={20} />;
    if (cat.includes('clarity')) return <Zap size={20} />;
    if (cat.includes('format')) return <FileText size={20} />;
    return <CheckCircle2 size={20} />;
};

export function ImprovementsList({ improvements }: ImprovementsListProps) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <span className={styles.titleIcon}>✨</span>
                AI Enhancements
            </h3>
            <div className={styles.grid}>
                {improvements.map((imp, index) => (
                    <div
                        key={index}
                        className={styles.card}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className={styles.header}>
                            <div className={styles.iconWrapper}>
                                {getIcon(imp.category)}
                            </div>
                            <span className={styles.category}>{imp.category}</span>
                        </div>
                        <p className={styles.description}>{imp.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
