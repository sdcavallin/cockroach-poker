import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from '../pages/HomePage';
import { describe, test, expect, vi } from 'vitest';

vi.mock('socket.io-client', () => {
  return {
    io: () => ({
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      connected: false,
      id: 'test-socket-id',
    }),
  };
});

const renderWithProviders = (ui) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </ChakraProvider>
  );
};

describe('HomePage component', () => {
  test('renders the title', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/COCKROACH\s+POKER🪳/i)).toBeInTheDocument();
  });

  test('renders the CREATE button', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  test('renders the JOIN button as a link', () => {
    renderWithProviders(<HomePage />);
    const joinButton = screen.getByRole('button', { name: /join/i });
    expect(joinButton).toBeInTheDocument();
    expect(joinButton.closest('a')).toHaveAttribute('href', '/join');
  });

  test('renders the image with alt text "Back"', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByAltText(/back/i)).toBeInTheDocument();
  });
});
