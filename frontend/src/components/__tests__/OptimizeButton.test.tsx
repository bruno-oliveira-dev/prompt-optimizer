import { render, screen, fireEvent } from '@testing-library/react';
import { OptimizeButton } from '../OptimizeButton';

describe('OptimizeButton', () => {
    it('renders correctly', () => {
        render(<OptimizeButton onClick={() => { }} isLoading={false} />);
        expect(screen.getByText('Optimize Prompt')).toBeDefined();
    });

    it('shows loading state', () => {
        render(<OptimizeButton onClick={() => { }} isLoading={true} />);
        expect(screen.getByText('Optimizing...')).toBeDefined();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls onClick handler', () => {
        const handleClick = jest.fn();
        render(<OptimizeButton onClick={handleClick} isLoading={false} />);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('respects disabled prop', () => {
        const handleClick = jest.fn();
        render(<OptimizeButton onClick={handleClick} isLoading={false} disabled={true} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });
});
