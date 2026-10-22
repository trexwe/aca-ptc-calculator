import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ACA Premium Tax Credit Calculator header and key controls', () => {
  render(<App />);
  const headingElement = screen.getByText(/ACA Premium Tax Credit Calculator/i);
  expect(headingElement).toBeInTheDocument();

  expect(screen.getByLabelText(/Household size/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Monthly Silver plan premium/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Age of primary adult/i)).toBeInTheDocument();
  expect(screen.getByText(/2025 Monthly Premiums/i)).toBeInTheDocument();
  expect(screen.getByText(/2026 Monthly Premiums/i)).toBeInTheDocument();
});

test('renders premium comparison table and policy link', () => {
  render(<App />);
  expect(screen.getByRole('table', { name: /Premium tax credit comparison across income levels/i })).toBeInTheDocument();
  const policyLink = screen.getByRole('link', { name: /Learn more about policy background/i });
  expect(policyLink).toBeInTheDocument();
  expect(policyLink).toHaveAttribute('href', 'https://github.com/trexwe/aca-ptc-calculator/blob/release/POLICY_BACKGROUND.md');
});
