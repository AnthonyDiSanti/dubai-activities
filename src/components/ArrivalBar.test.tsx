import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArrivalBar } from './ArrivalBar';

describe('ArrivalBar', () => {
  it('presents the stable brand and live countdown text', () => {
    render(<ArrivalBar countdown="9 days until I land" />);

    expect(screen.getByText('For Naima')).toBeInTheDocument();
    expect(screen.getByText('9 days until I land')).toHaveAttribute('aria-live', 'polite');
  });
});
