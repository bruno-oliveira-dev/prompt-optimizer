import { Wand2, Loader2 } from 'lucide-react';
import styles from './OptimizeButton.module.css';

interface OptimizeButtonProps {
    onClick: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

export function OptimizeButton({ onClick, isLoading, disabled }: OptimizeButtonProps) {
    return (
        <button
            className={`btn btn-primary ${styles.button}`}
            onClick={onClick}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <>
                    <Loader2 className={styles.spinner} size={20} />
                    Optimizing...
                </>
            ) : (
                <>
                    <Wand2 size={20} />
                    Optimize Prompt
                </>
            )}
        </button>
    );
}
