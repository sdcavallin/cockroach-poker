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
    const title = screen.getByText(/COCKROACH\s+POKER🪳/i);
    expect(title).to.exist;
  });

  test('renders the CREATE button', () => {
    renderWithProviders(<HomePage />);
    const button = screen.getByRole('button', { name: /create/i });
    expect(button).to.exist;
    expect(button.textContent.toLowerCase()).to.include('create');
  });

  test('renders the JOIN button as a link', () => {
    renderWithProviders(<HomePage />);
    const joinLink = screen.getByRole('link', { name: /join/i });
    expect(joinLink).to.exist;
    expect(joinLink.getAttribute('href')).to.equal('/join');
  });

  test('renders the image with alt text "Back"', () => {
    renderWithProviders(<HomePage />);
    const img = screen.getByAltText(/back/i);
    expect(img).to.exist;
  });
});
