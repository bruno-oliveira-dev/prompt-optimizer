import { ChangeEvent } from 'react';
import styles from './PromptInput.module.css';

interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={styles.container}>
            <label htmlFor="prompt-input" className={styles.label}>
                Your Prompt
            </label>
            <textarea
                id="prompt-input"
                className={styles.textarea}
                value={value}
                onChange={handleChange}
                placeholder="e.g. Write a blog about AI..."
                disabled={disabled}
                maxLength={4000}
            />
            <div className={styles.footer}>
                <span className={styles.count}>{value.length} / 4000 characters</span>
            </div>
        </div>
    );
}
